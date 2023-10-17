/* eslint-disable max-classes-per-file */
/* eslint-disable react/no-unused-state */

import * as React from "react";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ViewState, EditingState } from "@devexpress/dx-react-scheduler";
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
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Fab from "@mui/material/Fab";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import LocationOn from "@mui/icons-material/LocationOn";
import Notes from "@mui/icons-material/Notes";
import Close from "@mui/icons-material/Close";
import CalendarToday from "@mui/icons-material/CalendarToday";
import Create from "@mui/icons-material/Create";
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
    color: "#4682B4",
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

    this.state = {
      appointmentChanges: {},
      paciente: "", // Novo estado para o campo Paciente
      profissional: "", // Novo estado para o campo Profissional
      consultorio: "", // Novo estado para o campo Consultorio
      dataConsulta: null, // Novo estado para o campo Data da Consulta
      horaInicio: null, // Novo estado para o campo Hora de Inicio
      duracao: 15, // Novo estado para o campo Duração da Consulta (inicializado com 15)
      observacao: "", // Novo estado para o campo Observação
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
 


  commitAppointment(type) {
    const { commitChanges } = this.props;
    const { duracao } = this.state; // Obtenha a duração da consulta do estado
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
    } = this.props;
    const { appointmentChanges, paciente, profissional, consultorio, dataConsulta, horaInicio, duracao, observacao } = this.state;

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
    const datePickerProps = pickerEditorProps("startDate");

    const cancelChanges = () => {
      this.setState({
        appointmentChanges: {},
      });
      visibleChange();
      cancelAppointment();
    };

    return (
      <AppointmentForm.Overlay
        visible={visible}
        target={target}
        fullSize
        onHide={onHide}
        style={{maxWidth: "37.5rem", borderRight:"solid 1px black"}}
      >
        <StyledDiv   > 
          <div className={classes.header} style={{maxWidth: "35rem"}}>
            <IconButton
              className={classes.closeButton}
              onClick={cancelChanges}
              size="large"
            >
              <Close color="action" />
            </IconButton>
          </div>
          <div className={classes.content}>
            {/* Campo Paciente */}
            <div className={classes.wrapper} style={{ maxWidth: "35rem"}}>
            <TextField
                {...textEditorProps("Paciente")}
                value={paciente}
                onChange={(e) => this.setState({ paciente: e.target.value })}
                required
                size="small"
              />

            </div>
           
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", maxWidth: "35rem" }}>

              {/* Campo Profissional */}
              <div style={{ flexBasis: "48%" }}>
                <TextField
                  {...textEditorProps("Profissional")}
                  value={profissional}
                  onChange={(e) => this.setState({ profissional: e.target.value })}
                  required
                />
              </div>

              {/* Campo Consultorio */}
              <div style={{ flexBasis: "48%",}}>
                <TextField
                  {...textEditorProps("Consultorio")}
                  value={consultorio}
                  onChange={(e) => this.setState({ consultorio: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between",marginTop: "8px" , maxWidth: "35rem" }}>
              {/* Campo Data da Consulta */}
             
                <div className={classes.wrapper} style={{ flexBasis: "48%",  Width: "15rem !important" }} >
               
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DateTimePicker
                      label="Data"
                      renderInput={(props) => (
                        <TextField
                          className={classes.picker}
                          variant="outlined"
                          label="Data"
                          {...props}
                          inputProps={{
                            ...props.inputProps,
                            readOnly: true,
                          }}
                        />
                      )}
                      {...datePickerProps}
                    />
                  </LocalizationProvider>
                </div>
           

              {/* Campo Duração da Consulta */}
              <div style={{ flexBasis: "48%", marginTop: "8px" }}>
                <TextField
                  label="Duração da Consulta (min)"
                  type="number"
                  value={duracao}
                  onChange={(e) => this.setState({ duracao: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Campo Observação */}
            <div className={classes.wrapper} style={{maxWidth: "35rem"}}>
              <TextField
                {...textEditorProps("Observacao")}
                multiline
                rows="6"
                value={observacao}
                onChange={(e) => this.setState({ observacao: e.target.value })}
              />
            </div>

           
            
           
          </div>
          <div className={classes.buttonGroup} style={{maxWidth: "35rem"}}>
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
                Delete
              </Button>
            )}

            <Button
              variant="outlined"
              color="primary"
              className={classes.button}
              onClick={() => {
                visibleChange();
                applyChanges();
              }}
            >
              {isNewAppointment ? "Criar" : "Salvar"}
            </Button>
          </div>
        </StyledDiv>
      </AppointmentForm.Overlay>
    );
  }
}

/* eslint-disable-next-line react/no-multi-comp */
export default class Demo extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: appointments,
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
    if (!paciente || !profissional || !consultorio || !dataConsulta || !horaInicio || !duracao) {
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
    if (!paciente || !profissional || !consultorio || !dataConsulta || !horaInicio || !duracao) {
      alert("Preencha todos os campos obrigatórios antes de criar o agendamento.");
      return; // Impedir a criação do agendamento se algum campo estiver faltando
    }
  
    const startDate = new Date(dataConsulta);
    startDate.setHours(horaInicio.getHours());
    startDate.setMinutes(horaInicio.getMinutes());
  
    const endDate = this.calculateEndDate(startDate, duracao);
  
    const appointment = {
      Paciente: paciente,
      Profissional: profissional,
      Consultorio: consultorio,
      "Data da Consulta": startDate, // Use a data de início calculada
      "Hora de Inicio": startDate, // Use a data de início calculada
      "Duração da Consulta": duracao,
      Observacao: observacao,
    };
  
    commitChanges({ added: appointment });
    this.setState({
      appointmentChanges: {},
    });
  }
  
  

  
  handleDateChange = (date) => {
    this.setState({ currentDate: date });
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
    } = this.state;

    console.log("Current Date:", this.state.currentDate);
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns} >
        <Paper>
          <Scheduler data={data} height={640} locale="pt-BR">
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
              messages={{ week: 'Semana' }} 
            />
            <DayView messages={{ day: 'Dia' }} />
            <AllDayPanel messages={{ 'All Day': 'Hoje' }}/>
            <EditRecurrenceMenu />
            <Appointments />
            <AppointmentTooltip
              showOpenButton
              showCloseButton
              showDeleteButton
            />
            <Toolbar />
            <ViewSwitcher  messages={{ week: 'Semana', day: 'Dia' }}  />
            <DateNavigator />
            <TodayButton messages={{ today: 'Hoje' }} />

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
