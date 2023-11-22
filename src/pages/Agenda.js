/* eslint-disable max-classes-per-file */
/* eslint-disable react/no-unused-state */
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import * as React from "react";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import "../style/css/agenda.css";
import Typography from "@mui/material/Typography";
import ModalPaciente from "../components/ModalPaciente";
import SugestaoHorarios from "../components/sugestionAppointment";
import Chip from "@mui/material/Chip";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ViewState, EditingState } from "@devexpress/dx-react-scheduler";
import Autocomplete from "@mui/material/Autocomplete";
import InputMask from "react-input-mask";
import "react-datepicker/dist/react-datepicker.css";
import DateFnsUtils from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import MenuItem from "@mui/material/MenuItem";
import { format } from "date-fns";
import {
  Scheduler,
  Toolbar,
  DayView,
  WeekView,
  ViewSwitcher,
  Appointments,
  AppointmentTooltip,
  AppointmentForm,
  DragDropProvider,
  EditRecurrenceMenu,
  AllDayPanel,
  DateNavigator,
  TodayButton,
} from "@devexpress/dx-react-scheduler-material-ui";
import { connectProps } from "@devexpress/dx-react-core";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import axios from "axios";

const PREFIX = "Demo";

// #FOLD_BLOCK
const classes = {
  content: `${PREFIX}-content`,
  header: `${PREFIX}-header`,
  closeButton: `${PREFIX}-closeButton`,
  buttonGroup: `${PREFIX}-buttonGroup`,
  button: `${PREFIX}-button`,
  picker: `${PREFIX}-picker`,
  wrapper: `${PREFIX}-wrapper`,
  icon: `${PREFIX}-icon`,
  textField: `${PREFIX}-textField`,
  addButton: `${PREFIX}-addButton`,
};

// #FOLD_BLOCK
const StyledDiv = styled("div")(({ theme }) => ({
  [`& .${classes.icon}`]: {
    margin: theme.spacing(2, 0),
    marginRight: theme.spacing(2),
  },

  [`& .${classes.header}`]: {
    overflow: "hidden",
    paddingTop: theme.spacing(0.5),
  },
  [`& .${classes.textField}`]: {
    width: "100%",
  },
  [`& .${classes.content}`]: {
    padding: theme.spacing(2),
    paddingTop: 0,
  },
  [`& .${classes.closeButton}`]: {
    float: "right",
  },
  [`& .${classes.picker}`]: {
    marginRight: theme.spacing(2),
    "&:last-child": {
      marginRight: 0,
    },
    width: "50%",
  },
  [`& .${classes.wrapper}`]: {
    display: "flex",
    justifyContent: "space-between",
    padding: theme.spacing(1, 0),
  },
  [`& .${classes.buttonGroup}`]: {
    display: "flex",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 2),
  },
  [`& .${classes.button}`]: {
    marginLeft: theme.spacing(2),
  },
}));
const StyledFab = styled(Fab)(({ theme }) => ({
  [`&.${classes.addButton}`]: {
    position: "absolute",
    bottom: theme.spacing(3),
    right: theme.spacing(4),
  },
}));

//Formulario para criação de agendamento
class AppointmentFormContainerBasic extends React.PureComponent {
  constructor(props) {
    super(props);
    this.marcarAgendamento = this.marcarAgendamento.bind(this);

    this.state = {
      appointmentChanges: {},
      tipoRepeticao: 'todos',
      paciente: "", // Novo estado para o campo Paciente
      profissional: "", // Novo estado para o campo Profissional
      consultorio: "", // Novo estado para o campo Consultorio
      dataConsulta: null, // Novo estado para o campo Data da Consulta
      horaInicio: null, // Novo estado para o campo Hora de Inicio  1
      duracao: 30, // Novo estado para o campo Duração da Consulta (inicializado com 15)
      observacao: "", // Novo estado para o campo Observação
      isModalOpen: false, //Estado padrão do Modal de Paciente
      openSugestaoHorarios: false, // Define o estado inicial de openSugestaoHorarios como falso
      dataSelecionada: null, // Novo estado para a data selecionada
      retornoSelecionado: "Sem Retorno",
      isAgendamentoMode: true,
      selectedDate: new Date(),
      pacientes: [],
      professionals: [],
      consultorios: ["Consultorio 1", "Consultorio 2"],
      duracoes: ["15", "30", "45", "60", "90", "120"],
      formData: {
        horaInicial: "00:00",
      },
      compromisso:"",
      errors: { 
        paciente: false,
        profissional: false,
        consultorio: false,
        dataConsulta: false,
        horaInicio: false,
      }
    };

    
    this.getAppointmentData = () => {
      const { appointmentData } = this.props;
      return appointmentData;
    };
    this.getAppointmentChanges = () => {
      const { appointmentChanges } = this.state;
      return appointmentChanges;
    };

    this.changeAppointment = this.changeAppointment.bind(this);
    this.commitAppointment = this.commitAppointment.bind(this);
  }

  toggleModeCompromisso = () => {
    this.setState(() => ({
      isAgendamentoMode: false,
    }));
  };

  toggleModeAgendamento = () => {
    this.setState(() => ({
      isAgendamentoMode: true,
    }));
  };


  
  openModal = () => {
    this.setState({ isModalOpen: true });
  };

  async componentDidMount() {
    try {
      // Faça a chamada à API para buscar os profissionais
      const professionalsResponse = await axios.get(professionalusers);
      console.log("Resposta da API (Profissionais):", professionalsResponse);

      if (professionalsResponse.status === 200) {
        const professionals = professionalsResponse.data.retorno.map(
          (user) => ({
            id: user.id,
            nome: user.nome,
          })
        );
        this.setState({ professionals });
        console.log("Profissionais:", professionals);
      } else {
        console.error(
          "Erro ao buscar profissionais. Status:",
          professionalsResponse.status
        );
      }
    } catch (error) {
      console.error("Erro ao buscar profissionais. Status:", error);
      // Trate o erro, exiba uma mensagem, etc.
    }

    try {
      // Faça a chamada à API para buscar os profissionais
      const pacientesResponse = await axios.get(pacienteusers);
      console.log("Resposta da API (pacientes):", pacientesResponse);

      if (pacientesResponse.status === 200) {
        const pacientes = pacientesResponse.data.retorno.map((user) => ({
          id: user.id,
          nome: user.nome,
        }));
        this.setState({ pacientes });
        console.log("pacientes:", pacientes);
      } else {
        console.error(
          "Erro ao buscar pacientes. Status:",
          pacientesResponse.status
        );
      }
    } catch (error) {
      console.error("Erro ao buscar pacientes. Status:", error);
      // Trate o erro, exiba uma mensagem, etc.
    }

    this.openModal();
  }

  validateForm = () => {
    const { paciente, profissional, consultorio, dataConsulta, formData: { horaInicial } } = this.state;
    let isValid = true;
    let errors = {};

    if (!paciente) {
      errors.paciente = true;
      isValid = false;
    }
    if (!profissional) {
      errors.profissional = true;
      isValid = false;
    }
    // Repita para os outros campos necessários

    this.setState({ errors });
    return isValid;
  }


  async marcarAgendamento() {
    if (!this.validateForm()) {
      
      return;
    }
    function converterMinutosParaHoraDuracao(duracao) {
      const horas = Math.floor(duracao / 60);
      const minutosRestantes = duracao % 60;

      // Formate as horas e minutos como strings com dois dígitos
      const horasFormatadas = horas.toString().padStart(2, "0");
      const minutosFormatados = minutosRestantes.toString().padStart(2, "0");

      // Retorne a duração formatada no formato "HH:MM:SS"
      return `${horasFormatadas}:${minutosFormatados}:00`;
    }

    const {
      paciente,
      profissional,
      consultorio,

      
      duracao,
      observacao,
    } = this.state;

    console.log("clickou");
    // Certifique-se de que a função validateForm está definida

    const selectedDate = new Date(this.state.selectedDate);
    selectedDate.setHours(0, 0, 0, 0);

    const duracaoFormatada = converterMinutosParaHoraDuracao(duracao);
    const { dataConsulta, formData: { horaInicial } } = this.state;

  // A data e hora devem ser combinadas corretamente antes do envio
  const dataHoraConsulta = new Date(dataConsulta);
  const [hora, minuto] = horaInicial.split(':');
  dataHoraConsulta.setHours(hora, minuto, 0); // Configura a hora e os minutos

    const dataAgendamento = {
      pacienteId: paciente, // Defina o pacienteId conforme necessário
      usuarioId: profissional, // Defina o usuarioId conforme necessário
      dataConsulta: new Date().toISOString().split('T')[0], // Teste com a data atual
      horaInicio: format(dataHoraConsulta, "HH:mm:ss"), // Converte a hora de início para o formato ISO
      duracao: duracaoFormatada, // Use a duração selecionada
      sala: consultorio,
      observacao: observacao,
      titulo: "Consulta do Paciente: " +paciente,
    };
    console.log(dataAgendamento);
    try {
      // Faça a chamada à API
      const response = await axios.post(
        "https://clinicapi-api.azurewebsites.net/Agendamento/CriarAgendamento",
        dataAgendamento
      );
      console.log(dataAgendamento);
      if (response.status === 200) {
        alert("Agendamento marcado com sucesso!"); // Exiba uma mensagem de sucesso
      } else {
        alert("Ocorreu um erro ao marcar o agendamento."); // Exiba uma mensagem de erro
      }
    } catch (error) {
      alert("Ocorreu um erro ao marcar o agendamento: " + error.message);
    }
  }


  async criarCompromisso() {
    const {
      profissional,
      compromisso,
      repetirCompromisso,
      diaInteiro,
      disponivel,
    } = this.state;
  
    const { dataInicial, dataFinal } = this.state.appointmentChanges;

    const ajustarFusoHorario = (dataHora) => {
      const data = new Date(dataHora);
      data.setHours(data.getHours() - 3); // Subtrai 3 horas
      return data;
    };


if (!(dataInicial instanceof Date && dataFinal instanceof Date)) {
  console.error("Data inicial ou final não definida");
  alert("Erro: Data não definida.");
  return;
}

    let dataHoraInicio;
    let dataHoraFim;
    if (diaInteiro) {
      const dataInicialAjustada = ajustarFusoHorario(dataInicial);
      const dataFinalAjustada = ajustarFusoHorario(dataFinal);
      dataHoraInicio = new Date(dataInicialAjustada.setHours(0, 0, 0, 0)).toISOString();
      dataHoraFim = new Date(dataFinalAjustada.setHours(23, 59, 59, 999)).toISOString();
    } else {
      dataHoraInicio = ajustarFusoHorario(dataInicial).toISOString();
      dataHoraFim = ajustarFusoHorario(dataFinal).toISOString();
    }
  
    const payload = {
      usuarioId: profissional,
      dataHoraInicio,
      dataHoraFim,
      descricao: compromisso,
      repetir: repetirCompromisso,
      titulo: compromisso,
      permitirAgendamento: !disponivel,
    };
  
    try {
      const response = await axios.post(
        "https://clinicapi-api.azurewebsites.net/Compromisso/CriarCompromisso",
        payload
      );
  
      if (response.status === 200) {
        alert("Compromisso criado com sucesso!");
        console.log(payload);
      } else {
        alert("Erro ao criar compromisso.");
      }
    } catch (error) {
      console.error("Erro ao criar compromisso: ", error);
      alert("Erro ao criar compromisso: " + error.message);
    }
  }
  
  
  handleRetornoChange = (event) => {
    this.setState({ retornoSelecionado: event.target.value });
  };

  calculateEndDate(startDate, duration) {
    const endDate = new Date(startDate);
    endDate.setMinutes(startDate.getMinutes() + duration);
    return endDate;
  }

  changeAppointment({ field, changes }) {
    const nextChanges = {
      ...this.getAppointmentChanges(),
      [field]: changes,
    };
    this.setState({
      appointmentChanges: nextChanges,
    });
  }


  filterProfessionals(inputValue) {
    return this.state.professionals.filter((professional) =>
      professional.toLowerCase().includes(inputValue.toLowerCase())
    );
  }

  filterPacientes(inputValue) {
    return this.state.pacientes.filter((paciente) =>
      paciente.toLowerCase().includes(inputValue.toLowerCase())
    );
  }

  filterConsultorios(inputValue) {
    return this.state.consultorios.filter((consultorio) =>
      consultorio.toLowerCase().includes(inputValue.toLowerCase())
    );
  }

  filterDuracoes(inputValue) {
    return this.state.duracoes.filter((duracao) =>
      duracao.toLowerCase().includes(inputValue.toLowerCase())
    );
  }

  commitAppointment(type) {
    const { commitChanges } = this.props;

    const appointment = {
      ...this.getAppointmentData(),
      ...this.getAppointmentChanges(),
    };
    if (type === "deleted") {
      commitChanges({ [type]: appointment.id });
    } else if (type === "changed") {
      commitChanges({ [type]: { [appointment.id]: appointment } });
    } else {
      commitChanges({ [type]: appointment });
    }
    this.setState({
      appointmentChanges: {},
    });
  }

  render() {
    const {
      visible,
      visibleChange,
      appointmentData,
      cancelAppointment,
      target,
      onHide,
      dataSelecionada,
    } = this.props;
    const {
      appointmentChanges,
      paciente,
      profissional,
      consultorio,
      dataConsulta,
      horaInicio,
      duracao,
      observacao,
      pacientes,
      professionals,
      consultorios,
      selectedDate,
      duracoes,
      formData,
      compromisso,
      titulo,
      repetir,
      descricao,
      diaSemana,
      diaInteiro,
      dataInicial,
      dataFinal,
      disponivel,
      
    } = this.state;
    const { errors } = this.state;

    const displayCompromissoData = {
      Titulo: titulo,
      Profissional: profissional,
      Consultorio: consultorio,
      DataInicial: dataInicial,
      DataFicial: dataFinal,
      Repetir: repetir,
      Descricao: descricao,
      diaSemana: diaSemana,
    };

    const displayAppointmentData = {
      ...appointmentData,
      ...appointmentChanges,
      Paciente: paciente,
      Profissional: profissional,
      Consultorio: consultorio,
      DataConsulta: dataConsulta,
      "Hora de Inicio": horaInicio,
      "Duração da Consulta": duracao,
      Observacao: observacao,
    };

    const isNewAppointment = appointmentData.id === undefined;

    const applyChanges = isNewAppointment
      ? () => this.commitAppointment("added")
      : () => this.commitAppointment("changed");

    const textEditorProps = (field) => ({
      variant: "outlined",
      onChange: ({ target: change }) =>
        this.changeAppointment({
          field: [field],
          changes: change.value,
        }),
      value: displayAppointmentData[field] || "",
      label: field[0].toUpperCase() + field.slice(1),
      className: classes.textField,
    });

    
    const pickerEditorProps = (field) => ({
      // keyboard: true,
      value: displayAppointmentData[field],
      onChange: (date) =>
      this.changeAppointment({
        field: [field],
        changes: date
        ? new Date(date) 
        : new Date(displayAppointmentData[field]),
      }),
      ampm: false,
      inputFormat: "dd/MM/yyyy HH:mm",
      onError: () => null,
      renderInput: (props) => (
        <TextField
          className={classes.picker}
          {...props.inputProps}
          inputProps={{
            ...props.inputProps,
            readOnly: true, // Set input as readOnly
          }}
          />
          ),
        });
        
        const dataInicialPickerProps = pickerEditorProps("dataInicial");
        const dataFinalPickerProps = pickerEditorProps("dataFinal");
        const dataConsultaPickerProps = pickerEditorProps("dataConsulta");
        dataInicialPickerProps.minDateTime = new Date();
        dataFinalPickerProps.minDateTime = dataInicialPickerProps.minDateTime;
        dataInicialPickerProps.fullWidth = this.state.diaInteiro; // Tornar full-width se "Dia Inteiro" estiver ativado
        dataInicialPickerProps.inputFormat = this.state.diaInteiro ? "dd/MM/yyyy" : "dd/MM/yyyy HH:mm"; // Formato sem hora se "Dia Inteiro"
        dataConsultaPickerProps.inputFormat = "dd/MM/yyyy";

        dataFinalPickerProps.onError = (error) => {
          if (!error) {
            return; // Retorna cedo se não houver erro
          }
        
        
          if (error.code === "validate.min") {
            return "A data não pode ser menor que 'Começa em'";
          }
        };
        
        
       const handleDataInicialChange = (date) => {
          if (this.state.diaInteiro) {
            date.setHours(0, 0, 0, 0);
            this.setState({
              dataInicial: date,
              dataFinal: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59),
            });
          } else {
            this.changeAppointment({
              field: "dataInicial",
              changes: date ? new Date(date) : new Date()
            });
          }
        };
        
  
        const handleDataFinalChange = (date) => {
          this.changeAppointment({
            field: "dataFinal",
            changes: date ? new Date(date) : new Date()
          });
        };

  const handleDataConsultaChange = (date) => {
    // Garanta que apenas a data seja armazenada, excluindo a hora
    this.changeAppointment({
      field: ["dataConsulta"],
      changes: date ? format(date, "yyyy-MM-dd") : null,
    });
  };
  

  const handleHoraInicialChange = (event) => {
    const { value } = event.target;
  
    if (!value || value.includes('_')) {
      // Se o valor for vazio ou incompleto, reset para um valor padrão
      this.setState({ formData: { ...this.state.formData, horaInicial: "00:00" } });
    } else {
      // Atualize o estado com o valor da hora
      this.setState({ formData: { ...this.state.formData, horaInicial: value } });
    }
  };
  

    const setFormData = (data) => {
      this.setState({
        formData: { ...this.state.formData, ...data },
      });
    };

    // Make setFormData accessible within the component
    this.setFormData = setFormData;

    const datePickerProps = pickerEditorProps("dataConsulta");
    const timePickerProps = pickerEditorProps("horaInicio");
  
    const cancelChanges = () => {
      this.setState({
        appointmentChanges: {},
      });
      visibleChange();
      cancelAppointment();
    };

    const handleOpenSugestaoHorarios = () => {
      this.setState({ openSugestaoHorarios: true });
    };

    const { isAgendamentoMode } = this.state;

    return (
      <AppointmentForm.Overlay
        visible={visible}
        target={target}
        fullSize
        onHide={onHide}
        style={{
          maxWidth: "33.5rem",
          borderRight: "solid 1px rgba(168,163,168,0.61)",
          paddingRight: "20px !important",
          boxshadow: "2px 2px 5px 1px rgba(168,163,168,0.61)",
        }}
      >
        <div
          style={{ display: "flex", padding: "15px", marginTop: "40px" }}
          className={classes.header}
        >
          <Chip
            label="Consulta"
            onClick={this.toggleModeAgendamento}
            clickable
            color={isAgendamentoMode ? "primary" : "default"}
            sx={{
              width: "90px",
              marginRight: "5px",
              fontSize: "16px",
              fontWeight: "400",
            }}
          />
          <Chip
            label="Compromisso"
            onClick={this.toggleModeCompromisso}
            clickable
            color={isAgendamentoMode ? "default" : "primary"}
            sx={{ width: "125px", fontSize: "16px", fontWeight: "400" }}
          />
        </div>
        {isAgendamentoMode ? (
          <StyledDiv style={{ margingRight: "20px !important" }}>
            <div className={classes.content}>
              {/* Campo Paciente */}
              <div
                className={classes.wrapper}
                style={{
                  maxWidth: "31.5rem",

                  paddingBottom: "0px",
                  marginTop: "5px",
                }}
              >
                <Autocomplete
                  freeSolo
                  sx={{
                    maxWidth: "31.5rem !important",
                    width: "31.5rem !important",
                  }}
                  options={pacientes} // Use a lista de pacientes buscada na API
                  getOptionLabel={(option) => option.nome}
                  value={
                    pacientes
                      ? pacientes.find((p) => p.id === paciente) || null
                      : null
                  }
                  onChange={(_, newValue) =>
                    this.setState({ paciente: newValue ? newValue.id : null })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Paciente"
                      variant="outlined"
                      required
                      size="small"
                      // Aplicando estilo adicional para erro
                      error={errors.paciente}
                      InputProps={{
                        ...params.InputProps,
                        className: errors.paciente ? 'error-paciente' : '',
                      }}
                    />
                  )}
                />

              </div>

              <div
                style={{
                  paddingLeft: "365px",
                  color: "#2196f3",
                  fontSize: "13px",
                  paddingBottom: "10.5px",
                  marginTop: "4px",
                }}
              >
                {" "}
                {/* Ignorem essa puta gambiarra aqui, no fim é necessaria... */}
                <a
                  href="#"
                  onClick={this.openModal}
                  style={{ display: "none !important" }}
                ></a>
                {this.state.isModalOpen && (
                  <ModalPaciente openModal={this.openModal} />
                )}
              </div>

              <div
                style={{
                  maxWidth: "31.5rem",
                }}
              >
                {/* Campo Profissional */}
                <div style={{ paddingBottom: "21.5px", maxWidth: "31.5rem" }}>
                  <Autocomplete
                    freeSolo
                    options={professionals}
                    getOptionLabel={(option) => option.nome}
                    value={
                      professionals.find((p) => p.id === profissional) || null
                    }
                    onChange={(_, newValue) =>
                      this.setState({
                        profissional: newValue ? newValue.id : null,
                      })
                    }
                    renderInput={(params) => (
                      <TextField
                        {...textEditorProps("Profissional")}
                        {...params}
                        required
                        size="small"
                        error={errors.profissional}
                      InputProps={{
                        ...params.InputProps,
                        className: errors.profissional ? 'error-profissional' : '',
                      }}
                      />
                    )}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                 
                  maxWidth: "31.5rem",
                }}
              >
                {/* Campo Consultorio */}
                <div
                  style={{
                    flexBasis: "48%",
                    paddingBottom: "23.5px",
                    maxWidth: "300px !important",
                  }}
                >
                  <Autocomplete
                    freeSolo
                    options={consultorios}
                    getOptionLabel={(option) => option}
                    value={consultorio}
                    onChange={(_, newValue) =>
                      this.setState({ consultorio: newValue })
                    }
                    renderInput={(params) => (
                      <TextField
                        {...textEditorProps("Consultorio")}
                        {...params}
                        required
                        size="small"
                        error={errors.consultorio}
                        InputProps={{
                        ...params.InputProps,
                        className: errors.consultorio ? 'error-consultorio' : '',
                      }}
                      />
                    )}
                  />
                </div>

                {/* Campo Duração da Consulta */}
                <div style={{ flexBasis: "48%", maxWidth: "300px !important" }}>
                  <Autocomplete
                    freeSolo
                    options={this.state.duracoes}
                    value={this.state.duracaoSelecionada}
                    onChange={(_, newValue) =>
                      this.setState({ duracaoSelecionada: newValue })
                    }
                    renderInput={(params) => (
                      <TextField
                        {...textEditorProps("Duração da consulta (min)")}
                        {...params}
                        required
                        size="small"
                        defaultValue="30"
                      />
                    )}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  
                  maxWidth: "31.5rem",
                }}
              >
                {/* Campo Data da Consulta */}
                <div
                  style={{
                    marginRight: "10px",
                    flexBasis: "68%",
                    maxWidth: "300px !important",
                  }}
                >
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Data da Consulta"
                      inputFormat="dd/MM/yyyy"
                      size="small"
                      {...dataConsultaPickerProps}
                      onChange={handleDataConsultaChange}
                      renderInput={(params) => (
                        <TextField {...params} size="small" />
                      )}
                    />
                  </LocalizationProvider>
                </div>

                {/* Campo Hora de Início */}
                <div
                  style={{ maxWidth: "300px !important", marginLeft: "10px", flexBasis: "68%" }}
                >
                  <InputMask
                    mask="99:99" // Define a máscara para o formato de hora (hh:mm)
                    maskChar="_" // O caractere a ser exibido como espaço reservado
                    value={this.state.formData.horaInicial}
                    onChange={handleHoraInicialChange}
                  >
                    {(inputProps) => (
                      <TextField
                        className={classes.picker}
                        variant="outlined"
                        label="Hora de Início"
                        size="small"
                        {...inputProps}
                      />
                    )}
                  </InputMask>
                </div>
              </div>

              {/* Botão "Sugestão de Horário" */}
              <div
                style={{
                  color: "#2196f3",
                  fontSize: "13px",
                  paddingBottom: "18.5px",
                }}
              >
                <a href="#" onClick={handleOpenSugestaoHorarios} size="small">
                  Encontrar horário livre
                </a>
              </div>
              <SugestaoHorarios
                open={this.state.openSugestaoHorarios}
                onClose={() => this.setState({ openSugestaoHorarios: false })}
              />
              {/* Campo Observação */}
              <div className={classes.wrapper} style={{ maxWidth: "31.5rem" }}>
                <TextField
                  {...textEditorProps("Observacao")}
                  multiline
                  rows="2"
                  value={observacao}
                  onChange={(e) =>
                    this.setState({ observacao: e.target.value })
                  }
                />
              </div>
              <div className={classes.wrapper} style={{ maxWidth: "31.5rem" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <TextField
                    value={this.state.retornoSelecionado}
                    onChange={this.handleRetornoChange}
                    
                    size="small"
                    select
                    label="Retorno em"
                  >
                    <MenuItem value="Sem Retorno">Sem Retorno</MenuItem>
                    <MenuItem value="1 Mês">1 Mês</MenuItem>
                    <MenuItem value="2 Meses">2 Meses</MenuItem>
                    <MenuItem value="6 Meses">6 Meses</MenuItem>
                    <MenuItem value="12 Meses">12 Meses</MenuItem>
                  </TextField>
                </div>
              </div>
            </div>

            <div
              className={classes.buttonGroup}
              style={{ maxWidth: "33.5rem" }}
            >
              <Button
                className={classes.closeButton}
                onClick={cancelChanges}
                size="large"
                style={{ color: "black" }}
              >
                {isNewAppointment ? "Fechar" : ""}
              </Button>
              {!isNewAppointment && (
                <Button
                  variant="outlined"
                  color="secondary"
                  className={classes.button}
                  onClick={() => {
                    visibleChange();
                    this.commitAppointment("deleted");
                  }}
                >
                  Desmarcar
                </Button>
              )}

              <Button
                variant="contained"
                color="success"
                className={classes.button}
                onClick={() => {
                  this.marcarAgendamento(); // Agora a função está definida
                }}
              >
                {isNewAppointment ? "Marcar" : "Salvar"}
              </Button>
            </div>
          </StyledDiv>
        ) : (
          <div>
             <StyledDiv style={{ margingRight: "20px !important" }}>
              <div className={classes.content}>
                {/* Campo Compromisso */}
                <div
                  className={classes.wrapper}
                  style={{ maxWidth: "31.5rem" }}
                >
                  <TextField
                    {...textEditorProps("Qual é o compromisso?")}
                    required
                    size="small"
                    value={compromisso}
                    onChange={(e) =>
                      this.setState({ compromisso: e.target.value })
                    }
                    InputProps={{
                      endAdornment: (
                  <Typography variant="caption" color="textSecondary">{`${compromisso.length}/255`}</Typography>
                  ),
                  }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingBottom: "34.5px",
                    maxWidth: "31.5rem",
                    paddingTop: "8.5px",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "400px !important",
                      flexBasis: "70%",
                    }}
                  >
                    {/* Campo Profissional */}
                    <div style={{ maxWidth: "31.5rem" }}>
                      <Autocomplete
                        freeSolo
                        options={professionals}
                        getOptionLabel={(option) => option.nome}
                        value={
                          professionals.find((p) => p.id === profissional) ||
                          null
                        }
                        onChange={(_, newValue) =>
                          this.setState({
                            profissional: newValue ? newValue.id : null,
                          })
                        }
                        renderInput={(params) => (
                          <TextField
                            {...textEditorProps("Agenda de")}
                            {...params}
                            required
                            size="small"
                          />
                        )}
                      />
                    </div>
                  </div>
                  {/* Campo Dia Inteiro (Switch) */}
                  <div
                    style={{ flexBasis: "28%", maxWidth: "200px !important" }}
                  >
                    <Switch
                      checked={diaInteiro}
                      onChange={(e) =>
                        this.setState({ diaInteiro: e.target.checked })
                      }
                      color="primary"
                    />
                    <label>Dia Inteiro</label>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingBottom: "21.5px",
                    maxWidth: "31.5rem",
                  }}
                >
                  {/* Começa em */}
                  <div
                    style={{
                      flexBasis: "48%",
                      maxWidth: "400px !important",
                    }}
                  >
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DateTimePicker
                        label="Começa em"
                        inputFormat="dd/MM/yyyy HH:mm"
                        size="small"
                        {...dataInicialPickerProps}// Use o estado apropriado para armazenar a data/hora de início
                        onChange={handleDataInicialChange} // Implemente a função de manipulador
                        renderInput={(params) => (
                          <TextField {...params} size="small" />
                        )}
                        required
                      />
                    </LocalizationProvider>
                  </div>

                  {/* Termina em */}
                  <div
                    style={{
                      flexBasis: "48%",
                      maxWidth: "400px !important",
                    }}
                    >
                    {!this.state.diaInteiro && (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DateTimePicker
                        label="Termina em"
                        inputFormat="dd/MM/yyyy HH:mm"
                        size="small"
                        {...dataFinalPickerProps}
                        onChange={handleDataFinalChange}
                        renderInput={(params) => (
                          <TextField {...params} size="small" />
                        )}
                        required
                      />
                    </LocalizationProvider>
                )}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingBottom: "21.5px",
                    maxWidth: "31.5rem",
                    flexDirection:'column',
                  }}
                >
                  {/* Repetir Compromisso */}
                  <div
                    style={{ flexBasis: "28%", maxWidth: "200px !important" }}
                  >
                    <Switch
                       checked={this.state.repetirCompromisso}
                      onChange={(e) =>
                        this.setState({ repetirCompromisso: e.target.checked })
                      }
                      color="primary"
                    />
                    <label>Repetir Compromisso</label>
                  </div>

                  {this.state.repetirCompromisso && (
                    <div style={{ maxWidth: "13.5rem" }}>
                      {/* Campo para escolher a repetição do compromisso */}
                      <TextField
                        select
                        label="Repetir"
                        value={this.state.tipoRepeticao}
                        onChange={(e) => this.setState({ tipoRepeticao: e.target.value })}
                        size="small"
                        fullWidth
                      >
                        <MenuItem value="todos">Todos os dias</MenuItem>
                        <MenuItem value="semana">Semanalmente</MenuItem>
                        <MenuItem value="quinzena">Quinzenalmente</MenuItem>
                        <MenuItem value="mes">Mensalmente</MenuItem>
                        <MenuItem value="ano">Anualmente</MenuItem>
                      </TextField>
                    </div>
                  )}

                  {/* Receber alerta */}
                  <div
                    style={{ flexBasis: "28%", maxWidth: "200px !important" }}
                  >
                    <Switch
                      checked={this.state.receberAlerta}
                      onChange={(e) =>
                        this.setState({ receberAlerta: e.target.checked })
                      }

                      color="primary"
                    />
                    <label>Receber Alerta</label>
                  </div>
                  {this.state.receberAlerta && (
                    <div style={{ maxWidth: "31.5rem" }}>
                      {/* Campo para escolher quando receber o alerta */}
                      <TextField
                        select
                        label="Alerta"
                        value={this.state.tipoAlerta}
                        onChange={(e) => this.setState({ tipoAlerta: e.target.value })}
                        size="small"
                        fullWidth
                      >
                        <MenuItem value="5min">5 minutos antes</MenuItem>
                        <MenuItem value="10min">10 minutos antes</MenuItem>
                        <MenuItem value="15min">15 minutos antes</MenuItem>
                        <MenuItem value="30min">30 minutos antes</MenuItem>
                        {/* ... outros valores que você queira oferecer */}
                      </TextField>
                    </div>
                  )}
                </div>

                <div
                  className="card-label"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingBottom: "21.5px",
                    maxWidth: "31.5rem",
                    flexDirection:'column',
                    paddingLeft:'12px'
                
                  }}
                >
                  <FormControlLabel
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.preventDefault()}
                  sx={{color:'black',paddingLeft:'5px',fontsize: '16px',
                  fontweight: '500',
                  margin: '0',
                  lineheight: '18px'}}
                    control={ 
                      <Checkbox
                      
                      
                        onChange={(e) =>this.setState({ disponivel: e.target.checked })}
                        sx={{pointerEvents: "none",color:'blue',paddingLeft:'5px'}}
                      />
                    }
                    label="Não disponível para atendimento neste período."
                  />
                  <label className="card-label" style={{paddingLeft:'30px', fontSize:'13px',color:'black',paddingRight:'30px'}}>Marcando essa opção um compromisso ficará visível em sua agenda. Caso seja necessário marcar um atendimento neste horário você será avisado por e-mail.</label>
                </div>
              
              </div>

              <div
                className={classes.buttonGroup}
                style={{ maxWidth: "33.5rem" }}
              >
                <Button
                  className={classes.closeButton}
                  onClick={cancelChanges}
                  size="large"
                  style={{ color: "black" }}
                >
                  {isNewAppointment ? "Fechar" : ""}
                </Button>
                {!isNewAppointment && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    className={classes.button}
                    onClick={() => {
                      visibleChange();
                      this.commitAppointment("deleted");
                    }}
                  >
                    Desmarcar
                  </Button>
                )}

                <Button
                  variant="contained"
                  color="success"
                  className={classes.button}
                  onClick={() => {
                    this.criarCompromisso(); // Agora a função está definida
                  }}
                >
                  {isNewAppointment ? "Marcar" : "Salvar"}
                </Button>
              </div>
            </StyledDiv>
          </div>
        )}
      </AppointmentForm.Overlay>
    );
  }
}

const pacienteusers =
  "https://clinicapi-api.azurewebsites.net/Paciente/ListarPacientes";
const professionalusers =
  "https://clinicapi-api.azurewebsites.net/Usuario/ListarUsuarios?param=0";
const appointmentsApiUrl =
  "https://clinicapi-api.azurewebsites.net/Agendamento/ListarAgendamentos";

/* eslint-disable-next-line react/no-multi-comp */
export default class Demo extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.state = {
      data: [],
      currentDate: new Date(), // Pega a data atual com o Date_fns
      selectedDate: new Date(),
      confirmationVisible: false,
      editingFormVisible: false,
      deletedAppointmentId: undefined,
      editingAppointment: undefined,
      previousAppointment: undefined,
      addedAppointment: {},
      startDayHour: 9,
      endDayHour: 19,
      isNewAppointment: false,
      dataSelecionada: null,
    };

    this.currentDateChange = (currentDate) => {
      this.setState({ currentDate });
    };

    this.toggleConfirmationVisible = this.toggleConfirmationVisible.bind(this);
    this.commitDeletedAppointment = this.commitDeletedAppointment.bind(this);
    this.toggleEditingFormVisibility =
      this.toggleEditingFormVisibility.bind(this);

    this.commitChanges = this.commitChanges.bind(this);
    this.onEditingAppointmentChange =
      this.onEditingAppointmentChange.bind(this);
    this.onAddedAppointmentChange = this.onAddedAppointmentChange.bind(this);
    this.appointmentForm = connectProps(AppointmentFormContainerBasic, () => {
      const {
        editingFormVisible,
        editingAppointment,
        data,
        addedAppointment,
        isNewAppointment,
        previousAppointment,
      } = this.state;

      const currentAppointment =
        data.filter(
          (appointment) =>
            editingAppointment && appointment.id === editingAppointment.id
        )[0] || addedAppointment;
      const cancelAppointment = () => {
        if (isNewAppointment) {
          this.setState({
            editingAppointment: previousAppointment,
            isNewAppointment: false,
          });
        }
      };

      return {
        visible: editingFormVisible,
        appointmentData: currentAppointment,
        commitChanges: this.commitChanges,
        visibleChange: this.toggleEditingFormVisibility,
        onEditingAppointmentChange: this.onEditingAppointmentChange,
        cancelAppointment,
      };
    });
  }

  async componentDidMount() {
    try {
      const response = await axios.get(appointmentsApiUrl);
      const appointments = response.data.retorno;
  
      if (appointments) {
        const formattedAppointments = appointments.map((appointment) => {
          const startDate = new Date(`${appointment.dataConsulta}T${appointment.horaInicio}`);
          const duration = appointment.duracao.split(':');
          const endDate = new Date(startDate.getTime() + parseInt(duration[0], 10) * 60 * 60 * 1000 + parseInt(duration[1], 10) * 60 * 1000);
  
          // Format the startDate and endDate to match the structure of the scheduler component
          const formattedStartDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), startDate.getHours(), startDate.getMinutes());
          const formattedEndDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), endDate.getHours(), endDate.getMinutes());
  
          return {
            title: appointment.titulo,
            startDate: formattedStartDate,
            endDate: formattedEndDate,
            id: appointment.agendamentoId,
            location: appointment.sala,
          };
        });
  
        this.setState({ data: formattedAppointments });
        console.log("Formatted Appointments:", formattedAppointments);
      }
    } catch (error) {
      console.error("Erro ao buscar dados da API:", error);
    }
  }
  
  

 

  applyChanges() {
    const { commitChanges } = this.props;
    const {
      duracao,
      paciente,
      profissional,
      consultorio,
      dataConsulta,
      horaInicio,
      observacao,
    } = this.state;

    // Verifique se todos os campos obrigatórios estão preenchidos
   

    const startDate = new Date(dataConsulta);
    startDate.setHours(horaInicio.getHours());
    startDate.setMinutes(horaInicio.getMinutes());

    const appointment = {
      Paciente: paciente,
      Profissional: profissional,
      Consultorio: consultorio,
      DataConsulta: dataConsulta, // Use a data de início calculada
      HoraInicio: horaInicio, // Use a data de início calculada
      Duracao: duracao,
      Observacao: observacao,
    };

    commitChanges({ added: appointment });
    this.setState({
      appointmentChanges: {},
    });
  }

  handleDateChange = (newDate) => {
    this.setState({ selectedDate: newDate });
  };

  componentDidUpdate() {
    this.appointmentForm.update();
  }

  onEditingAppointmentChange(editingAppointment) {
    this.setState({ editingAppointment });
  }

  onAddedAppointmentChange(addedAppointment) {
    this.setState({ addedAppointment });
    const { editingAppointment } = this.state;
    if (editingAppointment !== undefined) {
      this.setState({
        previousAppointment: editingAppointment,
      });
    }
    this.setState({ editingAppointment: undefined, isNewAppointment: true });
  }

  setDeletedAppointmentId(id) {
    this.setState({ deletedAppointmentId: id });
  }

  toggleEditingFormVisibility() {
    const { editingFormVisible } = this.state;
    this.setState({
      editingFormVisible: !editingFormVisible,
    });
  }

  toggleConfirmationVisible() {
    const { confirmationVisible } = this.state;
    this.setState({ confirmationVisible: !confirmationVisible });
  }

  commitDeletedAppointment() {
    this.setState((state) => {
      const { data, deletedAppointmentId } = state;
      const nextData = data.filter(
        (appointment) => appointment.id !== deletedAppointmentId
      );

      return { data: nextData, deletedAppointmentId: null };
    });
    this.toggleConfirmationVisible();
  }

  commitChanges({ added, changed, deleted }) {
    this.setState((state) => {
      let { data } = state;
      if (added) {
        const startingAddedId =
          data.length > 0 ? data[data.length - 1].id + 1 : 0;
        data = [...data, { id: startingAddedId, ...added }];
      }
      if (changed) {
        data = data.map((appointment) =>
          changed[appointment.id]
            ? { ...appointment, ...changed[appointment.id] }
            : appointment
        );
      }
      if (deleted !== undefined) {
        this.setDeletedAppointmentId(deleted);
        this.toggleConfirmationVisible();
      }
      return { data, addedAppointment: {} };
    });
  }

  handleDateNavigatorChange(action) {
    const { currentDate } = this.state;
    const newDate = new Date(currentDate);

    if (action === "prev") {
      newDate.setDate(newDate.getDate() - 7); // Retrocede uma semana
    } else if (action === "next") {
      newDate.setDate(newDate.getDate() + 7); // Avança uma semana
    }

    this.setState({ currentDate: newDate });
  }

  render() {
    const {
      currentDate,
      data,
      confirmationVisible,
      editingFormVisible,
      startDayHour,
      endDayHour,
      dataSelecionada,
    } = this.state;

    const messages = {
      "pt-BR": {
        Week: "Semana",
        Day: "Dia",
      },
    };

    console.log("Current Date:", this.state.currentDate);
    return (
      <LocalizationProvider
        dateAdapter={AdapterDateFns}
        className="tbAgenda"
        locale="pt-BR"
      >
        <Paper className="papers">
          <Scheduler data={data} height={680} locale="pt-BR">
            <ViewState
              currentDate={currentDate}
              onCurrentDateChange={this.currentDateChange}
              locale="pt-BR"
            />
            <EditingState
              onCommitChanges={this.commitChanges}
              onEditingAppointmentChange={this.onEditingAppointmentChange}
              onAddedAppointmentChange={this.onAddedAppointmentChange}
            />
            <WeekView
              startDayHour={startDayHour}
              endDayHour={endDayHour}
              firstDayOfWeek={2} // Define a segunda-feira como o primeiro dia da semana
              locale="pt-BR"
              messages={messages["pt-BR"]}
            />
            <DayView messages={messages["pt-BR"]} />
            <AllDayPanel messages={{ "All Day": "Hoje" }} />
            <EditRecurrenceMenu />
            <Appointments />
            <AppointmentTooltip
              showOpenButton
              showCloseButton
              showDeleteButton
            />
            <Toolbar />
            <ViewSwitcher messages={messages["pt-BR"]} />
            <DateNavigator />
            <TodayButton messages={{ today: "Hoje" }} />

            <AppointmentForm
              overlayComponent={this.appointmentForm}
              visible={editingFormVisible}
              onVisibilityChange={this.toggleEditingFormVisibility}
            />
            <DragDropProvider />
          </Scheduler>

          <Dialog open={confirmationVisible} onClose={this.cancelDelete}>
            <DialogTitle>Excluir Apontamento</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Você tem certeza que quer excluir esse apontamento?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={this.toggleConfirmationVisible}
                color="primary"
                variant="outlined"
              >
                Cancelar
              </Button>
              <Button
                onClick={this.commitDeletedAppointment}
                color="secondary"
                variant="outlined"
              >
                Excluir
              </Button>
            </DialogActions>
          </Dialog>

          <StyledFab
            color="primary"
            className={classes.addButton}
            onClick={() => {
              this.setState({ editingFormVisible: true });
              this.onEditingAppointmentChange(undefined);
              this.onAddedAppointmentChange({
                startDate: new Date(currentDate).setHours(startDayHour),
                endDate: new Date(currentDate).setHours(startDayHour + 1),
              });
            }}
          >
            <AddIcon />
          </StyledFab>
        </Paper>
      </LocalizationProvider>
    );
  }
}
