import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import { Paper, Grid } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import FileIcon from "@mui/icons-material/InsertDriveFile";
import ReceituarioForm from "./DocumentosForm/ReceituarioForm";
import AtestadoForm from "./DocumentosForm/AtestadoForm";
import Tooltip from "@mui/material/Tooltip";
import InfoIcon from "@mui/icons-material/Info";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"; // Import the icon
import AddEvolutionModal from "./AddEvolutionModal";
import Switch from "@mui/material/Switch";
import "../style/css/tratamento.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";

import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  IconButton,
} from "@mui/material";

function PatientPage() {
  const [appointments, setAppointments] = useState([]);
  const [evolutions, setEvolutions] = useState([]); // State to hold evolution records
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [showAtestadoForm, setShowAtestadoForm] = useState(false);
  const [isAddEvolutionModalOpen, setIsAddEvolutionModalOpen] = useState(false);
  const [treatment, setTreatment] = useState("");
  const [toothRegion, setToothRegion] = useState("");
  const [value, setValue] = useState("");
  const [professional, setProfessional] = useState("");
  const [readOnlyModal, setReadOnlyModal] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [patient, setPatient] = useState({
    name: "Carregando...",
    phone: "",
    id: "",
  });

  const handleOpenReadOnlyModal = (evolution) => {
    // Definir os dados da evolução no estado do modal, se necessário
    // Por exemplo:
    // setDate(new Date(evolution.data));
    // setText(evolution.descricao);
    // setProfessional(evolution.profissionalId);
    
    setReadOnlyModal(true); // Ativar o modo somente leitura
    setIsAddEvolutionModalOpen(true); // Abrir o modal
  };

  const handleAdd = async (professionalId, selectedDate, description) => {
    const apiUrl =
      "https://clinicapi-api.azurewebsites.net/Evolucao/CriarEvolucao";
    const formattedDate = selectedDate.toISOString().split("T")[0]; // Formata a data para o formato esperado pela API
    const evolutionData = {
      pacienteId: patient.id, // Supondo que "patient.id" seja o ID do paciente no estado do componente pai
      profissionalId: professionalId,
      data: formattedDate,
      descricao: description,
    };
    console.log(evolutionData);
    try {
      const response = await axios.post(apiUrl, evolutionData);
      if (response.status === 200) {
        console.log("Evolução adicionada com sucesso");
        handleCloseEvolutionModal(); // Fechar o modal
        setIsAddEvolutionModalOpen(false);
        toast.success("Evolução adicionada com sucesso!", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
        });
        fetchEvolutions();
      } else {
        toast.error("Erro ao inserir os dados. Tente novamente!", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
        });
        console.error("Erro ao adicionar evolução. Status:", response.status);
      }
    } catch (error) {
      toast.error("Erro ao fazer a solicitação de evolução. Tente novamente.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
      });
      console.error("Erro ao adicionar evolução:", error);
    }
  };

  const renderEvolutions = () => {
    if (evolutions.length === 0) {
      return <NoEvolutions />;
    }

    return evolutions.map((evolution, index) => (
      <Box
        key={index}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography>
          {new Date(evolution.data).toLocaleDateString("pt-BR", {
            timeZone: "UTC",
          })}{" "}
          | Profissional ID: {evolution.profissionalId}
        </Typography>
        <Box>
          <Button
           onClick={() => handleOpenReadOnlyModal(evolution)}
            sx={{
              color: "white",
              backgroundColor: "#1976d2",
              minWidth:'34px !important',
              "&:hover": {
                backgroundColor: "#063f78",
              },
            }}
          >
            <InfoIcon sx={{color:'white'}}/>
          </Button>
          <Button
            onClick={() => handleDeleteEvolution(evolution.id)}
            sx={{
              color: "white",
              backgroundColor: "red",
              minWidth:'34px !important',
              marginLeft: "8px", // Espaço entre os botões
              "&:hover": {
                backgroundColor: "darkred",
              },
            }}
          >
            <DeleteIcon sx={{color:'white'}}/>
          </Button>
        </Box>
      </Box>
    ));
  };

  useEffect(() => {
    fetch(
      `https://clinicapi-api.azurewebsites.net/Agendamento/ListarAgendamentos/?id=${id}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data && data.sucesso && Array.isArray(data.retorno)) {
          setAppointments(data.retorno); // Acessar a propriedade "retorno" para os agendamentos
        }
        console.log(data);
      })
      .catch((error) => console.error("Erro ao carregar agendamentos:", error));
  }, [id]);

  useEffect(() => {
    fetch(
      `https://clinicapi-api.azurewebsites.net/Paciente/BuscarPaciente/?id=${id}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data && data.retorno) {
          const idade = calcularIdade(data.retorno.dataNascimento);
          setPatient({
            name: data.retorno.nome,
            phone: data.retorno.telefone.replace(/[^\d]/g, ""),
            telefone: data.retorno.telefone,
            id: data.retorno.id,
            email: data.retorno.email,
            cpf: data.retorno.cpf,
            dataNascimento: data.retorno.dataNascimento,

            ...data.retorno, // espalha os outros dados do paciente
            idade: idade, // adiciona a idade calculada
          });
        }
      })
      .catch((error) =>
        console.error("Erro ao carregar dados do paciente:", error)
      );
  }, [id]);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Aqui você pode integrar a lógica para enviar os dados para a API ou manipular da maneira que precisar
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  function formatarData(dataNascimento) {
    const dataObj = new Date(dataNascimento);
    const dia = String(dataObj.getDate()).padStart(2, "0");
    const mes = String(dataObj.getMonth() + 1).padStart(2, "0"); // Janeiro é 0
    const ano = dataObj.getFullYear();

    return `${dia}/${mes}/${ano}`;
  }

  function calcularIdade(dataNascimento) {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  }
  const handleOpenEvolutionModal = () => {
    setIsAddEvolutionModalOpen(true);
  };

  const handleCloseEvolutionModal = () => {
    setIsAddEvolutionModalOpen(false);
    setReadOnlyModal(false);
  };

  const fetchEvolutions = async () => {
    try {
      const response = await axios.get(
        `https://clinicapi-api.azurewebsites.net/Evolucao/ListarEvolucao/?id=${id}`
      );
      if (
        response.data &&
        response.data.sucesso &&
        Array.isArray(response.data.retorno)
      ) {
        const patientEvolutions = response.data.retorno.filter(
          (evo) => evo.pacienteId === parseInt(id)
        );
        setEvolutions(patientEvolutions);
      }
    } catch (error) {
      console.error("Erro ao carregar evoluções:", error);
    }
  };

  useEffect(() => {
    fetchEvolutions();
  }, [id]);

  const handleDeleteEvolution = async (evolutionId) => {
    const deleteUrl = `https://clinicapi-api.azurewebsites.net/Evolucao/DeletarEvolucao/?id=${evolutionId}`;

    try {
      const response = await axios.delete(deleteUrl);
      if (response.status === 200) {
        console.log("Evolução deletada com sucesso");
        toast.success("Evolução excluida com sucesso!", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
        });
        fetchEvolutions(); // Atualiza os dados na tela
      } else {
        toast.success("Erro ao excluir a evolução, tente novamente!", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
        });
        console.error("Erro ao deletar evolução. Status:", response.status);
      }
    } catch (error) {
      toast.success("Erro ao excluir a evolução, tente novamente!", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
      });
      console.error("Erro ao deletar evolução:", error);
    }
  };

  const NoEvolutions = () => (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      mt={12}
    >
      <Typography variant="subtitle1">
        O paciente não possui evoluções
      </Typography>
      <Button
        onClick={handleOpenEvolutionModal}
        sx={{ backgroundColor: "#50ae54" }}
        variant="contained"
      >
        ADICIONAR EVOLUÇÃO
      </Button>
    </Box>
  );

  const DocumentIcon = ({ svg }) => {
    return <div dangerouslySetInnerHTML={{ __html: svg }} />;
  };

  const contratoSvg = `  <svg width="100%" height="100%" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" fit="" preserveAspectRatio="xMidYMid meet" focusable="false">
    <path d="M40 80C61.8486 80 79.5605 62.0914 79.5605 40C79.5605 17.9086 61.8486 0 40 0C18.1514 0 0.439575 17.9086 0.439575 40C0.439575 62.0914 18.1514 80 40 80Z" fill="#16835B"></path>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M20.5442 13.6589H59.455V66.342H20.5442V13.6589Z" fill="white"></path>
    <path opacity="0.6" d="M30.109 59.4879H36.5943M30.109 57.5363H36.5943H30.109Z" stroke="#2095F3" stroke-width="1.02" stroke-linecap="square"></path>
    <path opacity="0.6" d="M44.109 59.4879H50.5943M44.109 57.5363H50.5943H44.109Z" stroke="#2095F3" stroke-width="1.02" stroke-linecap="square"></path>
    <path d="M25 26H56V27.3H25V26Z" fill="#9D9D9D"></path>
    <path d="M25 41H56V42.3H25V41Z" fill="#9D9D9D"></path>
    <path d="M31 21H49V22.3H31V21Z" fill="#9D9D9D"></path>
    <path d="M25 29H56V30.3H25V29Z" fill="#9D9D9D"></path>
    <path d="M25 44H56V45.3H25V44Z" fill="#9D9D9D"></path>
    <path d="M25 32H56V33.3H25V32Z" fill="#9D9D9D"></path>
    <path d="M25 35H56V36.3H25V35Z" fill="#9D9D9D"></path>
</svg>`; // Replace with your SVG string for "Contrato"
  const receituarioSvg = `<svg width="100%" height="100%" viewBox="0 0 90 91" xmlns="http://www.w3.org/2000/svg" fit="" preserveAspectRatio="xMidYMid meet" focusable="false"><g fill="none" fill-rule="evenodd"><ellipse fill="#42A5F5" cx="45" cy="45.5" rx="45" ry="45.5"></ellipse><path d="M36.516 21.085h8.115M37.254 22.565h8.853" stroke="#979797" stroke-linecap="square"></path><path fill="#FFF" d="M22.869 15.537H67.13v59.927H22.869z"></path><path d="M37.623 34.033h15.492M28.77 41.43h15.492M28.77 44.39h7.378M28.77 47.35h32.46M28.77 50.309h32.46" stroke="#000" stroke-width="2" stroke-linecap="square" opacity=".6"></path><path d="M40.574 66.585h7.377M40.574 68.805h7.377" stroke="#2095F3" stroke-width="2" stroke-linecap="square" opacity=".6"></path><path d="M36.885 25.154h5.164M36.885 22.935h5.164" stroke="#000" stroke-width="2" stroke-linecap="square" opacity=".3"></path><path opacity=".2" fill="#000" d="M26.558 19.976h8.115v8.138h-8.115z"></path></g></svg>`; // Replace with your SVG string for "Receituário"
  const atestadosSvg = `<svg width="100%" height="100%" viewBox="0 0 90 91" xmlns="http://www.w3.org/2000/svg" fit="" preserveAspectRatio="xMidYMid meet" focusable="false"><g fill="none" fill-rule="evenodd"><ellipse fill="#66BB6A" cx="45" cy="45.5" rx="45" ry="45.5"></ellipse><path d="M36.516 21.085h8.115M37.254 22.565h8.853" stroke="#979797" stroke-linecap="square"></path><path fill="#FFF" d="M22.869 15.537H67.13v59.927H22.869z"></path><path d="M37.623 34.033h15.492M28.77 47.35h32.46M28.77 44.39h32.46M28.77 41.43h32.46M28.77 50.309h32.46" stroke="#000" stroke-width="2" stroke-linecap="square" opacity=".6"></path><path d="M36.885 25.154h5.164M36.885 22.935h5.164" stroke="#000" stroke-width="2" stroke-linecap="square" opacity=".3"></path><path opacity=".2" fill="#000" d="M26.558 19.976h8.115v8.138h-8.115z"></path></g></svg>`; // Replace

  const DocumentCard = ({ title, icon, onNewClick }) => {
    return (
      <Card sx={{ minWidth: 275, textAlign: "center", margin: "8px" }}>
        <CardContent
          sx={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ width: "80px", height: "80px" }}>
            <DocumentIcon svg={icon} />
          </div>
          <Typography
            variant="h5"
            component="div"
            sx={{
              color: "#a9a9a9 !important",
              font: "500 17px/28px Roboto,Helvetica Neue,sans-serif",
            }}
          >
            {title}
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: "space-between" }}>
          <Button
            sx={{
              color: "black",
              textTransform: "uppercase",
              lineHeight: "36px",
              fontFamily: "Roboto,Helvetica Neue,sans-serif",
              fontSize: "14px",
              fontWeight: "600",
            }}
            size="small"
          >
            Histórico
          </Button>
          <Button
            sx={{
              textTransform: "uppercase",
              lineHeight: "36px",
              fontFamily: "Roboto,Helvetica Neue,sans-serif",
              fontSize: "14px",
              fontWeight: "600",
            }}
            size="small"
            onClick={onNewClick}
          >
            Novo
          </Button>
        </CardActions>
      </Card>
    );
  };

  const renderAppointments = () => {
    const currentDate = new Date();

    return appointments.map((appointment, index) => {
      // Creating a Date object for the appointment's date and time
      const appointmentDate = new Date(
        appointment.dataConsulta + "T" + appointment.horaInicio
      );

      // Formatting time to display only hours and minutes
      const timeString = appointmentDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      // Checking if the appointment date is before the current date
      const isPastAppointment = appointmentDate < currentDate;

      // Applying color based on the date comparison
      const appointmentStyle = {
        display: "flex",
        gap: "10px",
        fontSize: "18px",
        color: isPastAppointment ? "orange" : "green",
      };

      return (
        <Box
          key={index}
          sx={{
            display: "flex",
            alignItems: "center",
            pb: 1,
            justifyContent: "space-around",
          }}
        >
          <Typography variant="body1" sx={appointmentStyle}>
            {appointmentDate.toLocaleDateString()} - {timeString}
          </Typography>
          <Typography variant="body1" sx={{ fontSize: "18px" }}>
            {patient.name}
          </Typography>
          <Typography variant="body1" sx={{ fontSize: "18px" }}>
            {appointment.sala}
          </Typography>
          <Tooltip title={appointment.observacao} placement="bottom" arrow>
            <InfoIcon sx={{ color: "lightblue", ml: 1, cursor: "pointer" }} />
          </Tooltip>
        </Box>
      );
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0: //Sobre
        return (
          <Grid
            container
            spacing={2}
            padding={2}
            sx={{ backgroundColor: "#fafafa", height: "100%" }}
          >
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ marginBottom: 3 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  component="div"
                  sx={{
                    backgroundColor: "whitesmoke",
                    color: "#696969",
                    padding: 2,
                  }}
                >
                  {patient.name}{" "}
                  {patient.idade ? `(${patient.idade} anos)` : ""}
                </Typography>
                <div style={{ display: "flex", gap: "50px", padding: 18 }}>
                  <div style={{ padding: 2, paddingLeft: 13 }}>
                    <Typography variant="body1" color="textSecondary">
                      Celular:
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      Número paciente:
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      Data de Nascimento:
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      Email:
                    </Typography>
                  </div>
                  <div sx={{ padding: 2 }}>
                    <Typography variant="body1" color="textPrimary">
                      {patient.telefone}
                    </Typography>
                    <Typography variant="body1" color="textPrimary">
                      {patient.id}
                    </Typography>
                    <Typography variant="body1" color="textPrimary">
                      {patient.dataNascimento
                        ? formatarData(patient.dataNascimento)
                        : "Carregando..."}
                    </Typography>
                    <Typography variant="body1" color="textPrimary">
                      {patient.email}
                    </Typography>
                  </div>
                </div>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ marginBottom: 3 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  component="div"
                  sx={{
                    backgroundColor: "whitesmoke",
                    color: "#696969",
                    padding: 2,
                  }}
                >
                  Consultas <small>(10 Ultimos)</small>
                </Typography>
                <div style={{ padding: 18 }}>{renderAppointments()}</div>
              </Paper>
            </Grid>
          </Grid>
        );
      case 1: //Documentos
        if (showPrescriptionForm) {
          return (
            <ReceituarioForm
              patient={patient}
              onClose={() => setShowPrescriptionForm(false)}
            />
          );
        }
        if (showAtestadoForm) {
          return (
            <AtestadoForm
              patient={patient}
              onClose={() => setShowAtestadoForm(false)}
            />
          );
        }
        return (
          <Grid
            container
            spacing={2}
            pt={2}
            sx={{ backgroundColor: "#fafafa", height: "100%" }}
          >
            <Grid item xs={12} sm={4} pl={0}>
              <DocumentCard title="Contrato" icon={contratoSvg} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <DocumentCard
                title="Receituário"
                icon={receituarioSvg}
                onNewClick={() => setShowPrescriptionForm(true)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <DocumentCard
                title="Atestados"
                icon={atestadosSvg}
                onNewClick={() => setShowAtestadoForm(true)}
              />
            </Grid>
          </Grid>
        );

      case 2: //Tratamento
        return (
          <Grid
            container
            spacing={2}
            padding={2}
            sx={{ backgroundColor: "#fafafa", height: "100%" }}
          >
            <Grid item xs={12} md={7.5} sx={{ height: "100%" }}>
              <Paper elevation={3} sx={{ marginBottom: 3 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  component="div"
                  sx={{
                    backgroundColor: "whitesmoke",
                    color: "#696969",
                    padding: 2,
                  }}
                >
                  Adicionar tratamento
                </Typography>
                <div style={{ display: "flex", gap: "50px", padding: 18 }}>
                  <form
                    onSubmit={handleSubmit}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0px",
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={5} sm={6}>
                        <TextField
                          required
                          id="treatment"
                          label="Tratamento"
                          value={treatment}
                          onChange={(e) => setTreatment(e.target.value)}
                          margin="normal"
                          fullWidth
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={5} sm={6}>
                        <TextField
                          id="tooth-region"
                          label="Dentes/Região"
                          value={toothRegion}
                          onChange={(e) => setToothRegion(e.target.value)}
                          margin="normal"
                          fullWidth
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={5} sm={6}>
                        <TextField
                          id="value"
                          label="Valor R$"
                          type="number"
                          required
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                          margin="normal"
                          fullWidth
                          size="small"
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                      <Grid item xs={5} sm={6}>
                        <FormControl
                          fullWidth
                          required
                          margin="normal"
                          size="small"
                        >
                          <InputLabel id="professional-label">
                            Profissional
                          </InputLabel>
                          <Select
                            labelId="professional-label"
                            id="professional"
                            value={professional}
                            label="Profissional"
                            onChange={(e) => setProfessional(e.target.value)}
                          >
                            <MenuItem value={10}>Profissional A</MenuItem>
                            <MenuItem value={20}>Profissional B</MenuItem>
                            <MenuItem value={30}>Profissional C</MenuItem>
                          </Select>
                          <FormHelperText>
                            Este campo é obrigatório
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <div
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ backgroundColor: "#50ae54", width: "220px" }}
                      >
                        ADICIONAR TRATAMENTO
                      </Button>
                    </div>
                  </form>
                </div>
                <Grid item xs={12} pb={0.3}>
                  <Paper
                    elevation={3}
                    sx={{ mt: "0 !important", m: 2, height: "210px" }}
                  >
                    <Typography
                      variant="h6"
                      gutterBottom
                      component="div"
                      sx={{
                        backgroundColor: "whitesmoke",
                        color: "#696969",
                        padding: 0.5,
                        paddingLeft: 1.5,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      Tratamentos
                      <div style={{ fontSize: "14px", paddingRight: "10px" }}>
                        <Switch color="primary" />
                        <label style={{ fontSize: "14px" }}>
                          Mostrar finalizados
                        </label>
                      </div>
                    </Typography>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                      marginTop="50px"
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{ fontSize: "1.2em", fontWeight: 400 }}
                      >
                        Nenhum tratamento cadastrado ainda.
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontSize: "1.0em",
                          fontWeight: 400,
                          margin: "0 0 8px",
                        }}
                      >
                        Mas você pode começar nos campos acima digitando o nome
                        do tratamento.
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4.5}>
              <Paper elevation={3} sx={{ marginBottom: 3, height: "370px" }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  component="div"
                  sx={{
                    backgroundColor: "whitesmoke",
                    color: "#696969",
                    padding: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingRight: 2,
                  }}
                >
                  Evoluções
                  <IconButton onClick={handleOpenEvolutionModal}>
                    <AddCircleOutlineIcon />
                  </IconButton>
                </Typography>
                <div style={{ padding: 18 }}>{renderEvolutions()}</div>
              </Paper>
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  const whatsappUrl = `https://api.whatsapp.com/send?phone=55${patient.phone}&text=Ol%C3%A1,%20Paciente`;

  const handleBack = () => {
    navigate("/app/paciente");
  };

  return (
    <>
      <Paper style={{ width: "94vw", height: "94vh", overflow: "hidden" }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={2}
        >
          <Box display="flex" alignItems="center">
            <Button onClick={handleBack} sx={{ marginRight: 0 }}>
              <ArrowBackIcon />
            </Button>
            <PersonIcon sx={{ fontSize: 60, marginRight: 2 }} />{" "}
            {/* User Icon */}
            <Box>
              <Typography variant="h5">{patient.name}</Typography>
              <div style={{ display: "flex", gap: "3px" }}>
                <Typography
                  sx={{ color: "#696969 !important", fontSize: "14px" }}
                  variant="subtitle1"
                >
                  {patient.telefone} -{" "}
                </Typography>
                <Typography
                  sx={{ color: "#696969 !important", fontSize: "14px" }}
                  variant="subtitle1"
                >
                  Nº paciente: {patient.id}
                </Typography>
              </div>
            </Box>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "white !important",
                color: "black ",
                marginLeft: 4,
              }}
            >
              Editar
            </Button>
          </Box>
          <Box>
            <Button
              variant="contained"
              startIcon={<WhatsAppIcon />}
              href={whatsappUrl}
              target="_blank"
              sx={{ backgroundColor: "#d5f8d6", color: "#316030" }}
            >
              WhatsApp
            </Button>
          </Box>
        </Box>

        <AppBar position="static">
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            sx={{ zIndex: 10, backgroundColor: "#FAFAFA", color: "#666666" }}
          >
            <Tab label="SOBRE" />
            <Tab label="DOCUMENTOS" />
            <Tab label="TRATAMENTOS" />
          </Tabs>
        </AppBar>

        <div>{renderTabContent()}</div>
      </Paper>
      <AddEvolutionModal
        open={isAddEvolutionModalOpen}
        handleClose={handleCloseEvolutionModal}
        handleAdd={handleAdd}
        setIsAddEvolutionModalOpen={setIsAddEvolutionModalOpen}
        id={id}
        handleDeleteEvolution={handleDeleteEvolution}
        readOnlyModal={readOnlyModal} 
      />

      <ToastContainer />
    </>
  );
}

export default PatientPage;
