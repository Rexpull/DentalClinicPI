  import React, { useState } from "react";
  import "devextreme/dist/css/dx.light.css";
  import "../style/css/ModalPaciente.css";
  import { FormControl, FormLabel, HStack } from "@chakra-ui/react";
  import { Form, GroupItem } from "devextreme-react/form";
  import Dialog from "@mui/material/Dialog";
  import Button from "@mui/material/Button";
  import Tabs from "@mui/material/Tabs";
  import Tab from "@mui/material/Tab";
  import TextField from "@mui/material/TextField";
  import RadioGroup from "@mui/material/RadioGroup";
  import FormControlLabel from "@mui/material/FormControlLabel";
  import Radio from "@mui/material/Radio";
  import Autocomplete from "@mui/material/Autocomplete";
  import Checkbox from "@mui/material/Checkbox";
  import InputMask from "react-input-mask";
  import { ToastContainer, toast } from "react-toastify";
  import "react-toastify/dist/ReactToastify.css";
  import axios from "axios";
  import Accordion from '@mui/material/Accordion';
  import MenuItem from '@mui/material/MenuItem';
  import Select from '@mui/material/Select';
  import InputAdornment from '@mui/material/InputAdornment';
  import AccordionSummary from '@mui/material/AccordionSummary';
  import AccordionDetails from '@mui/material/AccordionDetails';
  import Typography from '@mui/material/Typography';
  import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  import { faLayerGroup,faIdCardClip } from '@fortawesome/free-solid-svg-icons';

  function ModalUsuario() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTab, setSelectedTab] = React.useState(0);
    const [selectedUF, setSelectedUF] = useState(null); // Estado selecionado
    const [nomeUsuario, setNomeUsuario] = useState("");
    const [senha, setSenha] = useState("");
    const [telefone, setTelefone] = useState("");
    const [email, setEmail] = useState("");
    const [sexo, setSexo] = React.useState("");
    const [perfil, setPerfil] = useState("");
    const [rua, setRua] = useState("");
    const [bairro, setBairro] = useState("");
    const [cidade, setCidade] = useState("");
    const [cep, setCEP] = useState("");
    const [valorPorcentagem, setValorPorcentagem] = useState("");
    const [salarioBruto, setSalarioBruto] = useState("");
    const [selectedCommissionOption, setSelectedCommissionOption] = useState("");
    const [acessoAjustes, setAcessoAjustes] = useState(false);
    const [acessoDashboard, setAcessoDashboard] = useState(false);
    const [acessoFinanceiro, setAcessoFinanceiro] = useState(false);
    const [acessoTratamento, setAcessoTratamento] = useState(false);
    const [acessoDocumento, setAcessoDocumento] = useState(false);

    const openModal = () => {
      setIsOpen(true);
    };

    const handleClickOpen = () => {
      setIsOpen(true);
    };

    const handleClose = () => {
      setIsOpen(false);
    };

    
    

    const commissionFields = (
      <div style={{display:'flex', justifyContent:'center', flexDirection:'column', alignItems:'center',gap:'20px', padding:'20px'}}>
          <TextField
          label="Valor do Salario base"
          variant="outlined"
          required
          fullWidth
          InputProps={{
            startAdornment: <InputAdornment position="start">R$</InputAdornment>,
          }}
          size="small"
        />
        <TextField
          label="Porcentagem de comissão"
          variant="outlined"
          size="small"
          required
          fullWidth
          InputProps={{
            startAdornment: <InputAdornment position="start">%</InputAdornment>,
          }}
        />
       <FormControl>
       
        <Select
          size="small"
          fullWidth
          sx={{ width: '770px', color: 'black' }}
          value={selectedCommissionOption}
          onChange={(e) => setSelectedCommissionOption(e.target.value)}
          helpertext='teste'
        >
          <MenuItem value={"Tratamento Finalizado"}>Tratamento Finalizado</MenuItem>
          <MenuItem value={"Débito recebido do paciente"}>Débito recebido do paciente</MenuItem>
        </Select>
      </FormControl>
      </div>
    );

    const permissionFields = (
      <div >
        <h1 style={{color:'#696969', fontSize:'15px',paddingBottom: '10px',display:'flex',justifyContent:'left'}}>As permissões são pré-definidas, mas podem ser alteradas abaixo:</h1>
        <Accordion sx={{marginBottom:'10px', border:'0'}} >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className="accordionTitle" ><FontAwesomeIcon icon={faLayerGroup} /> Acessos</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{display:'flex', justifyContent:'space-around'}}>
          <div onClick={(e) => e.stopPropagation()} >
          <FormControlLabel
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.preventDefault()}
            
            control={ 
              <Checkbox
                checked={acessoAjustes}
                onChange={(e) => setAcessoAjustes(e.target.checked)}
                sx={{pointerEvents: "none"}}
              />
            }
            label="Acesso à Ajustes"
          />
          </div>
        <FormControlLabel
          control={
            <Checkbox
            checked={acessoDashboard}
              onChange={(e) => setAcessoDashboard(e.target.checked)}
            />
          }
          label="Acesso à Dashboard"
        />
        <FormControlLabel
          control={
            <Checkbox
            checked={acessoFinanceiro}
              onChange={(e) => setAcessoFinanceiro(e.target.checked)}
            />
          }
          label="Acesso à Financeiro"
        />
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{marginBottom:'10px'}}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className="accordionTitle"><FontAwesomeIcon icon={faIdCardClip} /> Criação</Typography>
          </AccordionSummary>
          <AccordionDetails  sx={{display:'flex', justifyContent:'space-around'}}>
          <FormControlLabel
          control={
            <Checkbox
            checked={acessoTratamento}
              onChange={(e) => setAcessoTratamento(e.target.checked)}
            />
          }
          label="Criação de Tratamentos"
        />
        <FormControlLabel
          control={
            <Checkbox
            checked={acessoDocumento}
              onChange={(e) => setAcessoDocumento(e.target.checked)}
            />
          }
          label="Criação de Documentos"
        />
          </AccordionDetails>
        </Accordion>

      </div>
    );

    const officeHoursFields = <div>{/* Fields for office hours */}</div>;

    async function enviarDadosUsuario() {
      const usuarioData = {
        nome: nomeUsuario,
        senha,
        telefone,
        email,
        sexo,
        perfil,
        endereco: {
          rua,
          bairro,
          cidade,
          cep,
        },
        horariosAtendimento: {
          // Adicione os campos de horários de atendimento aqui
        },
        comissao: {
          valorPorcentagem,
          salarioBruto,
        },
      };

      console.log("Dados do usuário enviados para a API:", usuarioData);

      try {
        const response = await axios.post("URL_DA_API", usuarioData);

        if (response.status === 200) {
          console.log("deu boa");
        } else {
          // Lide com outros casos, se necessário
        }
      } catch (error) {
        console.error("Erro ao enviar os dados do usuário:", error);
      }
    }

    function RenderTabFields() {
      if (selectedTab === 0) {
        return permissionFields;
      } else if (selectedTab === 1) {
        return commissionFields;
      } else if (selectedTab === 2) {
        return officeHoursFields;
      } 
      return null;
    }

    return (
      <>
        <Button
          variant="contained"
          onClick={openModal}
          style={{
            backgroundColor: "#50ae54",
            color: "white",
            position: "absolute",
            left: "25px",
            top: "95px",
          }}
        >
          Cadastrar Profissional
        </Button>

        {isOpen && (
          <>
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-container">
                  <FormControl display="flex" flexDir="column" gap="4">
                  <HStack spacing="4" className="tituloUsuario">
                          <div >
                              <p className="titleFormUsuario">Cadastro de Usuario</p>
                          </div>
                      </HStack>
                    <div>
                      
                      <HStack spacing="15" mb={25}>
                        <TextField
                          label="Nome"
                          variant="outlined"
                          fullWidth
                          size="small"
                          value={nomeUsuario}
                          onChange={(e) => setNomeUsuario(e.target.value)}
                          required
                        />
                        <TextField
                          label="Senha"
                          type="password"
                          variant="outlined"
                          fullWidth
                          size="small"
                          value={senha}
                          onChange={(e) => setSenha(e.target.value)}
                          required
                        />
                        <InputMask
                          mask="(99) 99999-9999"
                          maskChar={null}
                          value={telefone}
                          onChange={(e) => setTelefone(e.target.value)}
                        >
                          {(inputProps) => (
                            <TextField
                              label="Telefone"
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

                      <HStack spacing="15" mb={25}>
                        <TextField
                          label="Email"
                          variant="outlined"
                          fullWidth
                          size="small"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />

                       
                          <FormLabel>Quanto?</FormLabel>
                          <Select
                            size="small"
                            label="Perfil"
                            fullWidth
                            value={perfil}
                            onChange={(e) => setPerfil(e.target.value)}
                            required
                            helperText="Pleas"
                          >
                            <MenuItem value={"Dentista"}>Dentista</MenuItem>
                            <MenuItem value={"Secretário(a)"}>Secretário(a)</MenuItem>
                          </Select>
                      
                        <FormControl
                          component="fieldset"
                          style={{ display: "flex" }}
                        >
                          <FormLabel
                            component="legend"
                            ml={75}
                            mr={16}
                            fontSize={20}
                            pb={2}
                            color="#000"
                            display="flex"
                            alignItems="center"
                          >
                            Sexo
                          </FormLabel>
                          <RadioGroup
                            value={sexo}
                            onChange={(e) => setSexo(e.target.value)}
                            required
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              flexWrap: "nowrap",
                            }}
                          >
                            <FormControlLabel
                              value="Masculino"
                              control={<Radio />}
                              label="Masculino"
                            />
                            <FormControlLabel
                              value="Feminino"
                              control={<Radio />}
                              label="Feminino"
                            />
                          </RadioGroup>
                        </FormControl>
                      </HStack>
                    </div>

                    <Form colCount={1}>
                      <GroupItem caption=" ">
                        <Tabs
                          value={selectedTab}
                          onChange={(event, newValue) => {
                            setSelectedTab(newValue);
                          }}
                          sx={{
                            borderBottom: 1,
                            borderColor: "divider",
                            margin: 0,
                            
                          }}
                        >
                          <Tab
                            label="Permissão"
                            sx={{
                              fontFamily: "Roboto,Helvetica Neue,sans-serif",
                              fontSize: "14px",
                              fontWeight: "700",
                            }}
                          />
                          <Tab
                            label="Comissão"
                            sx={{
                              fontFamily: "Roboto,Helvetica Neue,sans-serif",
                              fontSize: "14px",
                              fontWeight: "700",
                            }}
                          />
                          
                          <Tab
                            label="Horários de Atendimento"
                            sx={{
                              fontFamily: "Roboto,Helvetica Neue,sans-serif",
                              fontSize: "14px",
                              fontWeight: "700",
                            }}
                          />
                        </Tabs>
                      </GroupItem>
                    </Form>
                    <RenderTabFields />
                  </FormControl>
                  {/* Botões no rodapé do modal */}
                  <div className="fixed-buttons">
                    <Button onClick={handleClose} className="cancel-modal">
                      Fechar
                    </Button>
                    <Button onClick={enviarDadosUsuario} className="submit-modal">
                      Salvar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </>
    );

    // Adicione as guias de "Horários de Atendimento" e "Comissão" conforme necessário
    return null;
  }
  export default ModalUsuario;
