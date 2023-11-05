/* eslint-disable max-classes-per-file */
/* eslint-disable react/no-unused-state */

import * as React from "react";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
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
import MenuItem from '@mui/material/MenuItem';
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
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"; // Use DateTimePicker do @mui/x-date-pickers
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"; // Use LocalizationProvider do @mui/x-date-pickers
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import axios from "axios";
import { appointments } from "../components/appointments";

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
      retornoSelecionado: 'Sem Retorno',
      isAgendamentoMode: true,
      selectedDate: new Date(),
      professionals: [],
      consultorios: ["Consultorio 1", "Consultorio 2"],
      duracoes: ["15", "30", "45", "60", "90", "120"],
      formData: {
        horaInicial: "15:15" 
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
        const professionals = professionalsResponse.data.retorno.map((user) => ({
          id: user.id,
          nome: user.nome,
        }));
        this.setState({ professionals });
        console.log("Profissionais:", professionals);
      } else {
        console.error('Erro ao buscar profissionais. Status:', professionalsResponse.status);
      }
    } catch (error) {
      console.error('Erro ao buscar profissionais. Status:', error);
      // Trate o erro, exiba uma mensagem, etc.
    }
  
    try {
      // Faça a chamada à API para buscar os pacientes
      const patientsResponse = await axios.get('https://clinicapi-api.azurewebsites.net/Paciente/CriarPaciente');
      console.log('Resposta da API (Pacientes):', patientsResponse);
  
      if (patientsResponse.status === 200) {
        const patients = patientsResponse.data.retorno.map((patient) => ({
          id: patient.id,
          nome: patient.nome,
        }));
        this.setState({ patients });
        console.log('Pacientes:', patients);
      } else {
        console.error('Erro ao buscar pacientes. Status:', patientsResponse.status);
      }
    } catch (error) {
      console.error('Erro ao buscar pacientes. Status:', error);
      // Trate o erro, exiba uma mensagem, etc.
    }
  
    this.openModal();
  }
  


  async marcarAgendamento() {
   
    function converterMinutosParaHoraDuracao(duracao) {
      const horas = Math.floor(duracao / 60);
      const minutosRestantes = duracao % 60;
    
      // Formate as horas e minutos como strings com dois dígitos
      const horasFormatadas = horas.toString().padStart(2, '0');
      const minutosFormatados = minutosRestantes.toString().padStart(2, '0');
    
      // Retorne a duração formatada no formato "HH:MM:SS"
      return `${horasFormatadas}:${minutosFormatados}:00`;
    }
    
    const {
      paciente,
      profissional,
      consultorio,
     
      horaInicial,
      duracao,
      observacao,
    } = this.state;

    console.log("clickou")
    // Certifique-se de que a função validateForm está definida
    
      const selectedDate = new Date(this.state.selectedDate);
      selectedDate.setHours(0,0,0,0);
     
      const duracaoFormatada = converterMinutosParaHoraDuracao(duracao);
      
      const dataAgendamento = {
        pacienteId: 1, // Defina o pacienteId conforme necessário
        usuarioId: profissional, // Defina o usuarioId conforme necessário
        DataConsulta: selectedDate.toISOString(), // Converte a data para o formato ISO
        horaInicio: "15:00:00", // Converte a hora de início para o formato ISO
        duracao: duracaoFormatada, // Use a duração selecionada
        sala: consultorio,
        observacao: observacao,
        titulo: "Consulta teste de banco",
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
      professionals,
      consultorios,
      selectedDate,
      duracoes,
      formData,
    } = this.state;

    const displayAppointmentData = {
      ...appointmentData,
      ...appointmentChanges,
      Paciente: paciente,
      Profissional: profissional,
      Consultorio: consultorio,
      "Data da Consulta": dataConsulta,
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
            ? date.toDate()
            : new Date(displayAppointmentData[field]),
        }),
      ampm: false,
      inputFormat: "DD/MM/YYYY HH:mm",
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

    const handleHoraInicialChange = (event) => {
      const { value } = event.target;
    
      // Divida a string da hora em horas e minutos
      const [hours, minutes] = value.split(":").map(Number);
    
      // Crie um novo objeto Date e defina as horas e minutos
      const selectedDate = new Date();
      selectedDate.setHours(hours);
      selectedDate.setMinutes(minutes);
    
      // Atualize o estado com a nova data
      const updatedFormData = { ...formData, horaInicial: selectedDate };
      this.setState({ formData: updatedFormData });
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
                  options={this.state.pacientes} // Use a lista de pacientes buscada na API
                  getOptionLabel={(option) => option.nome}
                  value={this.state.pacientes.find((p) => p.id === paciente) || null}
                  onChange={(_, newValue) =>
                    this.setState({ paciente: newValue ? newValue.id : null })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...textEditorProps("Paciente")}
                      {...params}
                      required
                      size="small"
                    />
                  )}
                />
              </div>

              <div
                style={{
                  paddingLeft: "365px",
                  color: "#2196f3",
                  fontSize: "13px",
                  paddingBottom: "18.5px",
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
                    value={professionals.find((p) => p.id === profissional) || null}
                    onChange={(_, newValue) =>
                      this.setState({ profissional: newValue ? newValue.id : null })
                    }
                    renderInput={(params) => (
                      <TextField
                        {...textEditorProps("Profissional")}
                        {...params}
                        required
                        size="small"
                      />
                    )}
                  />
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
                {/* Campo Consultorio */}
                <div
                  style={{
                    flexBasis: "48%",
                    paddingBottom: "21.5px",
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
                  paddingBottom: "21.5px",
                  maxWidth: "31.5rem",
                }}
              >
                {/* Campo Data da Consulta */}
                <div
                  style={{
                    marginRight: "5px",
                    flexBasis: "68%",
                    maxWidth: "300px !important",
                  }}
                >
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Data da Consulta"
                    inputFormat="dd/MM/yyyy"
                    size="small"
                    value={this.state.selectedDate}
                    onChange={this.handleDateChange}
                    renderInput={(params) => <TextField {...params} size="small"/>}
                  />
                  </LocalizationProvider>
                </div>

                {/* Campo Hora de Início */}
                <div
                  style={{ width: "32%", marginRight: "5px", flexBasis: "68%" }}
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
                  <InputLabel>Retorno em</InputLabel>
                  <Select
                    value={this.state.retornoSelecionado}
                    onChange={this.handleRetornoChange}
                    style={{ marginLeft: "10px" }}
                  >
                    <MenuItem value="Sem Retorno">Sem Retorno</MenuItem>
                    <MenuItem value="1 Mês">1 Mês</MenuItem>
                    <MenuItem value="2 Meses">2 Meses</MenuItem>
                    <MenuItem value="6 Meses">6 Meses</MenuItem>
                    <MenuItem value="12 Meses">12 Meses</MenuItem>
                  </Select>
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
            <h1>teste</h1>{" "}
          </div>
        )}
      </AppointmentForm.Overlay>
    );
  }
}
const professionalusers = 'https://clinicapi-api.azurewebsites.net/Usuario/ListarUsuarios?param=0';
const appointmentsApiUrl = 'https://clinicapi-api.azurewebsites.net/Agendamento/ListarAgendamentos';

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
    // Faz uma requisição para buscar os dados da API
    function parseDuration(duration) {
      const [hours, minutes] = duration.split(':').map(Number);
      return hours * 60 * 60 * 1000 + minutes * 60 * 1000;
    }
   
    try {
      const response = await axios.get(appointmentsApiUrl);
      const { retorno } = response.data;
     
      if (retorno) {
        // Formata os dados recebidos da API para o formato esperado
        const formattedAppointments = retorno.map((apiAppointment) => {
          
          const dataConsultaDate = new Date(apiAppointment.dataConsulta);
          const horaInicioTime = new Date(apiAppointment.horaInicio);
        
          // Extract date components
          const year = dataConsultaDate.getFullYear();
          const month = dataConsultaDate.getMonth();
          const day = dataConsultaDate.getDate();
        
          // Extract time components
          const hours = horaInicioTime.getHours();
          const minutes = horaInicioTime.getMinutes();
        
          const startDate = new Date(year, month, day, hours, minutes);
          console.log(startDate);
          return {
            id: apiAppointment.agendamentoId,
            title: apiAppointment.titulo,
            startDate: startDate,
            endDate: new Date(new Date(apiAppointment.dataConsulta + 'T' + apiAppointment.horaInicio).getTime() + parseDuration(apiAppointment.duracao)),
            location: apiAppointment.sala,
          };
        });
        // Atualiza o estado com os dados formatados
        this.setState({ data: formattedAppointments });
        console.log("teste",formattedAppointments);
      }
    } catch (error) {
      console.error('Erro ao buscar dados da API:', error);
    }
  }


  validateForm() {
    const {
      paciente,
      profissional,
      consultorio,
      dataConsulta,
      horaInicio,
      duracao,
    } = this.state;


    // Verifique se todos os campos obrigatórios estão preenchidos
    if (
      !paciente ||
      !profissional ||
      !consultorio ||
      !dataConsulta ||
      !horaInicio ||
      !duracao
    ) {
      return false;
    }

    return true;
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
    if (
      !paciente ||
      !profissional ||
      !consultorio ||
      !dataConsulta ||
      !horaInicio ||
      !duracao
    ) {
      alert(
        "Preencha todos os campos obrigatórios antes de criar o agendamento."
      );
      return; // Impedir a criação do agendamento se algum campo estiver faltando
    }




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

    

    console.log("Current Date:", this.state.currentDate);
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Paper>
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
              messages={{ week: "Semana" }}
            />
            <DayView messages={{ day: "Dia" }} />
            <AllDayPanel messages={{ "All Day": "Hoje" }} />
            <EditRecurrenceMenu />
            <Appointments />
            <AppointmentTooltip
              showOpenButton
              showCloseButton
              showDeleteButton
            />
            <Toolbar />
            <ViewSwitcher messages={{ week: "Semana", day: "Dia" }} />
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
