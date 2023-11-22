import React, { useState } from "react";
import "../style/css/ModalPaciente.css";
import "devextreme/dist/css/dx.light.css";
import {
  FormControl,
  FormLabel,
  HStack,
  Button,
} from "@chakra-ui/react";
import { Form, GroupItem } from "devextreme-react/form";
import '../style/css/agenda.css'
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import InputMask from "react-input-mask";
import Autocomplete from "@mui/material/Autocomplete";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TextField from "@mui/material/TextField";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import axios from 'axios';

function Modal() {

  const [isOpen, setIsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = React.useState(0);
  const [selectedUF, setSelectedUF] = useState(null); // Estado selecionado
  const [telefonePaciente, setTelefonePaciente] = useState("");
  const [telefoneResponsavel, setTelefoneResponsavel] = useState("");
  const [email, setEmail] = useState("");
  const [cpfPaciente, setCPFPaciente] = useState("");
  const [cpfResponsavel, setCPFResponsavel] = useState("");
  const [cpfError, setCPFError] = useState(false);
  const [nomePaciente, setNomePaciente] = useState("");
  const [dataNascimentoPaciente, setDataNascimentoPaciente] = useState("2023-01-01");
  const [responsavelObrigatorio, setResponsavelObrigatorio] = useState(false);

  async function enviarDadosPaciente() {
    const siglaUF = estadosSiglas[selectedUF] || "AA";
    const pacienteData = {
      nome: nomePaciente,
      sexo: gender,
      dataNascimento: dataNascimentoPaciente,
      cpf: cpfPaciente,
      telefone: telefonePaciente,
      email,
      observacao: "Observação do Paciente",
      endereco: {
        cep: "CEP do Paciente",
        cidade: "Cidade do Paciente",
        rua: "Rua do Paciente",
        bairro: "Bairro do Paciente",
        uf: siglaUF || "AA",
      },
      responsavel: {
        nome: "Nome do Responsável",
        dataNascimento: "2023-10-14T14:08:32.722Z",
        cpf: cpfResponsavel,
        telefone: telefoneResponsavel,
      },
    };
  
    console.log("Dados do paciente enviados para a API:", pacienteData); // Adicione este console.log
  
    try {
      const response = await axios.post('https://clinicapi-api.azurewebsites.net/Paciente/CriarPaciente', pacienteData);
      
      if (response.status === 200) {
        notify();
      } else {
        // Lide com outros casos, se necessário
      }
    } catch (error) {
      console.error('Erro ao enviar os dados do paciente:', error);
    }
  }

  const estadosSiglas = [
    { label: "Acre", value: "AC" },
    { label: "Alagoas", value: "AL" },
    { label: "Amazonas", value: "AM" },
    // Adicione o mapeamento completo aqui
  ];
  
  const calculateAge = (date) => {
    const today = new Date();
    const birthDate = new Date(date);
    const age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  };

  const checkResponsavelObrigatorio = (dataNascimento) => {
    const idade = calculateAge(dataNascimento);
    setResponsavelObrigatorio(idade < 18);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const formatTelefone = (value, field) => {
    // Remove all non-numeric characters
    const formattedTelefone = value.replace(/\D/g, "");
    const formattedPhoneNumber = `(${formattedTelefone.slice(0, 2)}) ${formattedTelefone.slice(2, 7)}-${formattedTelefone.slice(7, 11)}`;
    if (field === "paciente") {
      setTelefonePaciente(formattedPhoneNumber);
    } else if (field === "responsavel") {
      setTelefoneResponsavel(formattedPhoneNumber);
    }
  };

  const formatCPFPaciente = (value) => {
    // Remove all non-numeric characters
    const numericValue = value.replace(/\D/g, "");

    // Apply the CPF mask
    if (numericValue.length <= 11) {
      let formattedCPF = numericValue;

      if (numericValue.length > 3) {
        formattedCPF = `${numericValue.slice(0, 3)}.${numericValue.slice(3, 6)}.${numericValue.slice(6, 9)}-${numericValue.slice(9, 11)}`;
      } else if (numericValue.length > 6) {
        formattedCPF = `${numericValue.slice(0, 3)}.${numericValue.slice(3, 6)}.${numericValue.slice(6, 9)}`;
      } else if (numericValue.length > 3) {
        formattedCPF = `${numericValue.slice(0, 3)}.${numericValue.slice(3, 6)}`;
      }

      setCPFPaciente(formattedCPF);
    }
  };

  const formatCPFResponsavel = (value) => {
    // Remove all non-numeric characters
    const numericValue = value.replace(/\D/g, "");

    // Apply the CPF mask
    if (numericValue.length <= 11) {
      let formattedCPF = numericValue;

      if (numericValue.length > 3) {
        formattedCPF = `${numericValue.slice(0, 3)}.${numericValue.slice(3, 6)}.${numericValue.slice(6, 9)}-${numericValue.slice(9, 11)}`;
      } else if (numericValue.length > 6) {
        formattedCPF = `${numericValue.slice(0, 3)}.${numericValue.slice(3, 6)}.${numericValue.slice(6, 9)}`;
      } else if (numericValue.length > 3) {
        formattedCPF = `${numericValue.slice(0, 3)}.${numericValue.slice(3, 6)}`;
      }

      setCPFResponsavel(formattedCPF);
    }
  };



  function RenderTabFields() {
    if (selectedTab === 0) {
      return (
        <HStack spacing="15" mt={25} style={{ display: "flex", paddingBottom: '20px' }}>
          <TextField label="Email" variant="outlined" fullWidth size="small"  />
          <FormControl variant="outlined">
            <Autocomplete
              id="como-chegou"
              fullWidth
              options={[
                "Facebook",
                "Google",
                "Indicação de amigo",
                "Indicação de outro Dentista",
                "Jornal",
                "Outdoor",
                "Rádio",
                "TV",
                "Convenio",
                "Instagram",
                "Indicação Familiar",
                "Site",
                "Outro",
              ]}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  sx={{ width: "560px" }}
                  label="Como o paciente chegou na clínica"
                  variant="outlined"
                />
              )}
            />
          </FormControl>
        </HStack>
      );
    } else if (selectedTab === 1) {
      return (
        <div>
          <HStack spacing="15" mt={25} style={{ display: "flex", paddingBottom: '20px'  }}>
            <TextField label="CEP" variant="outlined" fullWidth size="small" />
            <TextField label="Rua" variant="outlined" fullWidth size="small" />
          </HStack>
          <HStack spacing="15" mt={15}>
            <TextField label="Cidade" variant="outlined" fullWidth size="small" />
            <TextField label="Bairro" variant="outlined" fullWidth size="small" />
            <FormControl variant="outlined">
              <Autocomplete
                id="como-chegou"
                fullWidth
                options={estadosSiglas}
                getOptionLabel={(option) => option.label} // Define como o rótulo é exibido
                value={selectedUF}
                onChange={(event, newValue) => {
                  setSelectedUF(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    sx={{ width: "320px" }}
                    label="Estado"
                    variant="outlined"
                  />
                )}
              />
            </FormControl>

          </HStack>
        </div>
      );
    }
    return null;
  }

  const notify = () => {
    toast.success("Cadastro realizado com sucesso!", {
      position: "bottom-right",
      autoClose: 3500,
      hideProgressBar: false,
      closeOnClick: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const [gender, setGender] = React.useState("");

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  return (
    <>
      <a href="#" onClick={openModal}>
        Cadastrar novo paciente
      </a>
      {isOpen && (
     
        <div className="modal-overlay">
          <div className="modal-content">
            
            <div className="modal-container">
              <FormControl display="flex" flexDir="column" gap="4">
                <HStack spacing="4">
                  <div className="titulo">
                    <p className="titleForm">Dados do Paciente</p>
                  </div>
                </HStack>
                <HStack spacing="15" mb={25}>
                <TextField label="Nome do paciente" variant="outlined" fullWidth size="small" value={nomePaciente} onChange={(e) => setNomePaciente(e.target.value)} required />
                  <FormControl component="fieldset" display="flex" alignItems="center">
                    <FormLabel
                      component="legend"
                      ml={75}
                      mr={16}
                      fontSize={20}
                      pb={2}
                      color="#000"
                      display="flex"
                      alignItems="center"
                      style={{
                        fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
                        fontWeight: "700",
                        fontSize: "1rem",
                        lineHeight: "1.5",
                        letterSpacing: "0.00938em",
                      }}
                    >
                      Sexo
                    </FormLabel>
                    <RadioGroup
                      value={gender}
                      onChange={handleGenderChange}
                      required
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "nowrap",
                      }} // Estilo para alinhar horizontalmente
                    >
                      <FormControlLabel value="M" control={<Radio />} label="Masculino" style={{ color: "#000" }}  />
                      <FormControlLabel value="F" control={<Radio />} label="Feminino" style={{ color: "#000" }} />
                    </RadioGroup>
                  </FormControl>
                </HStack>

                <HStack spacing="15" mb={25}>
                <TextField
                  label="Data de nascimento"
                  type="date"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={dataNascimentoPaciente}
                  onChange={(e) => setDataNascimentoPaciente(e.target.value)}
                  defaultValue="2023-01-01"
                  required
                />
                  <TextField label="CPF do Paciente" variant="outlined" fullWidth size="small" value={cpfPaciente} onChange={(e) => formatCPFPaciente(e.target.value)} required />
                  <InputMask
                    mask="(99) 99999-9999"
                    maskChar={null}
                    value={telefonePaciente}
                    onChange={(e) => formatTelefone(e.target.value, "paciente")}
                  >
                    {(inputProps) => (
                      <TextField
                        label="Celular do paciente"
                        variant="outlined"
                        fullWidth
                        size="small"
                        required
                        value={inputProps.value}
                        onChange={inputProps.onChange}
                      />
                    )}
                  </InputMask>
                </HStack>
                <hr></hr>
                <HStack spacing="4" mt={15}>
                  <div className="titulo">
                    <p className="titleForm">
                      Dados do responsável <small>{responsavelObrigatorio
              ? "(obrigatório)"
              : "(opcional)"}</small>
                    </p>
                  </div>
                </HStack>
                <HStack spacing="15" mb={25}>
                  <TextField label="Nome do responsável" variant="outlined" fullWidth size="small" />
                  <TextField
                    label="Data de nascimento"
                    type="date"
                    variant="outlined"
                    fullWidth
                    size="small"
                    defaultValue="2023-01-01"
                  />
                  <TextField label="CPF do Responsável" variant="outlined" fullWidth size="small" value={cpfResponsavel} onChange={(e) => formatCPFResponsavel(e.target.value)} />
                  <InputMask
                    mask="(99) 99999-9999"
                    maskChar={null}
                    value={telefoneResponsavel}
                    onChange={(e) => formatTelefone(e.target.value, "responsavel")}
                  >
                    {(inputProps) => (
                      <TextField
                        label="Celular do responsável"
                        variant="outlined"
                        fullWidth
                        size="small"
                        required
                        value={inputProps.value}
                        onChange={inputProps.onChange}
                      />
                    )}
                  </InputMask>
                </HStack>
                <HStack spacing="4" mb={15}>
                  <TextField label="Observação" variant="outlined" multiline rows={4} fullWidth size="small" />
                </HStack>
                <Form colCount={1}>
                  <GroupItem caption=" ">
                    <Tabs
                      value={selectedTab}
                      onChange={(event, newValue) => {
                        setSelectedTab(newValue);
                      }}
                      sx={{ borderBottom: 1, borderColor: "divider", margin: 0 }}
                    >
                      <Tab
                        label="Informações Adicionais"
                        sx={{
                          fontFamily: "Roboto,Helvetica Neue,sans-serif",
                          fontSize: "14px",
                          fontWeight: "700",
                          
                        }}
                      />
                      <Tab
                        label="Endereço"
                        sx={{
                          fontFamily: "Roboto,Helvetica Neue,sans-serif",
                          fontSize: "14px",
                          fontWeight: "700",
                        }}
                      />
                    </Tabs>
                    <RenderTabFields/>
                  </GroupItem>
                </Form>
              </FormControl>
            </div>
            <div className="fixed-buttons">
              <Button 
                className="cancel-modal"
                
                onClick={closeModal}
              >
                Fechar
              </Button>
              <Button
                className="submit-modal"
                onClick={async () => {
                  closeModal(); // Fecha o modal

                  // Adicione a função para enviar os dados
                  await enviarDadosPaciente();
                  
                  setTimeout(() => {
                    notify(); // Notifica o sucesso (ou outro feedback)
                  }, 50);
                }}
              >
                Salvar
              </Button>

            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </>
  );
}

export default Modal;
