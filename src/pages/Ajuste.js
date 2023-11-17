import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import InputMask from 'react-input-mask';
import Autocomplete from '@mui/material/Autocomplete';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ModalUsuario from '../components/ModalUsuario';
import UserCard from '../components/UserCard';
import '../style/css/ajuste.css';

const initialFormData = {
  nome: '',
  cnpj: '',
  responsavel: '',
  razaoSocial: '',
  horaInicial: '',
  horaFinal: '',
  telefone: '',
  email: '',
  sexo:'',
  endereco: {
    cep: '',
    cidade: '',
    rua: '',
    bairro: '',
    complemento: '',
    numero: '',
    estado: '', // Altere para a sigla do estado, ex.: 'MG'
  },
};

const initialUserData = {
    nomeUsuario: '',
    senha: '',
    // Outros campos do usuário
  };
  

// Modifique a lista de estados para incluir apenas as siglas
const estadosDoBrasil = ['DF', 'GO', 'MT', 'MS', 'MG', 'RJ', 'RS', 'SC', 'SP'];

function AjustesClinica() {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [emailError, setEmailError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
 

  const handleTestClick = () => {
    console.log('Teste clicado'); // Adicione seu console.log aqui para depuração
     // Altera o estado para abrir o modal
  };

  const handleChangeTab = (event, newValue) => {
    setActiveTab(newValue);
  };
  

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch('https://clinicapi-api.azurewebsites.net/Usuario/ListarUsuarios');
        if (response.ok) {
          const data = await response.json();
          setUsers(data.retorno);
        } else {
          console.error('Error fetching user data from the API');
        }
      } catch (error) {
        console.error('Error fetching user data from the API:', error);
      }
    }

    fetchUsers();
  }, []);
  

  useEffect(() => {
    async function fetchClinicaData() {
      try {
        const response = await fetch('https://clinicapi-api.azurewebsites.net/clinica/ListarClinicas');
        if (response.ok) {
          const data = await response.json();
          const formattedTelefone = data.retorno[0].telefone.replace(/\D/g, ''); // Remova caracteres não numéricos
          const formattedPhoneNumber = `(${formattedTelefone.slice(0, 2)}) ${formattedTelefone.slice(2, 7)}-${formattedTelefone.slice(7, 11)}`;
          setFormData({ ...data.retorno[0], telefone: formattedPhoneNumber });
        } else {
          console.error('Erro ao buscar os dados da API');
        }
      } catch (error) {
        console.error('Erro ao buscar os dados da API:', error);
      }
    }

    fetchClinicaData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === 'email') {
      const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
      setEmailError(!emailPattern.test(value) ? 'E-mail inválido' : '');
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleCnpjChange = (event) => {
    const { name, value } = event.target;
    const formattedCnpj = value.replace(/\D/g, '');
  
    const maskedCnpj =
      formattedCnpj.length === 14
        ? `${formattedCnpj.slice(0, 2)}.${formattedCnpj.slice(2, 5)}.${formattedCnpj.slice(5, 8)}/${formattedCnpj.slice(8, 12)}-${formattedCnpj.slice(12, 14)}`
        : formattedCnpj;
  
    setFormData({
      ...formData,
      [name]: maskedCnpj, // Update the field using the provided 'name' value
    });
  };
  
  const handleUserEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };
  

  const handleSave = async () => {
    if (emailError) {
      return;
    }
  
    // Crie um objeto com as informações atualizadas
    const updatedData = {
      id: 4,
      nome: formData.nome,
      cnpj: formData.cnpj,
      responsavel: formData.responsavel,
      razaoSocial: formData.razaoSocial,
      horaInicial: formData.horaInicial,
      horaFinal: formData.horaFinal,
      telefone: formData.telefone,
      email: formData.email,
      endereco: {
        id: 12,
        cep: formData.endereco.cep,
        cidade: formData.endereco.cidade,
        rua: formData.endereco.rua,
        bairro: formData.endereco.bairro,
        complemento: formData.endereco.complemento,
        numero: formData.endereco.numero,
        uf: formData.endereco.estado,
      },
    };
    
    console.log('Dados a serem enviados ao servidor:', updatedData);

    try {
      const response = await fetch('https://clinicapi-api.azurewebsites.net/Clinica/EditarClinica', {
        method: 'PUT', // Use PUT para atualizar dados
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
  
      if (response.ok) {
        console.log('Dados atualizados com sucesso!');
        toast.success('Dados atualizados com sucesso!', {
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
           
          });
      } else {
        toast.error('Erro ao atualizar os dados. Tente novamente.', {
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            
          });
        console.error('Erro ao atualizar os dados:', response.statusText);
      }
    } catch (error) {
        toast.error('Erro ao fazer a solicitação de atualização. Tente novamente.', {
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            
          });
      console.error('Erro ao fazer a solicitação de atualização:', error);
    }
  };
  

  return (
    <Paper style={{ padding: '20px', position: 'relative', minHeight: '680px' }}>
        <Tabs value={activeTab} onChange={handleChangeTab} sx={{ borderBottom: 1, borderColor: "divider", margin: 0, color:'black',fontWeight:700 }}
        >
        <Tab label="Clínica" sx={{ borderBottom: 1, borderColor: "divider", margin: 0, color:'grey',fontWeight:700 }}/>
        <Tab label="Equipe" sx={{ borderBottom: 1, borderColor: "divider", margin: 0, color:'grey',fontWeight:700 }} />
      </Tabs>
      {activeTab === 0 && (
      <form>  {/* Conteúdo do formulário de cadastro do clinica */}
        {/* Seção 1: Dados da Clínica */}
        <Typography variant="h6" component="div" style={{ marginTop: '10px', font: '700 17px/28px Roboto,Helvetica Neue,sans-serif' }}>
          Dados da Clínica
        </Typography>
        <Grid container mb={2} spacing={2}>
          <Grid item xs={6}>
            <TextField
              name="nome"
              label="Nome da clínica"
              variant="outlined"
              fullWidth
              margin="normal"
              size="small"
              required
              value={formData.nome}
              onChange={handleChange}
             
              />
            </Grid>
            <Grid item xs={6}>
              <InputMask
                mask="99.999.999/9999-99"
                maskChar={null}
                value={formData.cnpj}
                onChange={handleCnpjChange}
              >
                {(inputProps) => (
                  <TextField
                    name="cnpj"
                    label="CNPJ da clínica"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    size="small"
                    value={inputProps.value}
                    onChange={inputProps.onChange}
                  />
                )}
              </InputMask>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                name="responsavel"
                label="Responsável pela clínica"
                variant="outlined"
                fullWidth
                margin="normal"
                size="small"
                required
                value={formData.responsavel}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <Typography variant="caption">{`${formData.responsavel.length}/120`}</Typography>
                  ),
                }}
                helperText="Limite de 120 caracteres"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="razaoSocial"
                label="Razão Social"
                variant="outlined"
                fullWidth
                margin="normal"
                size="small"
                required
                value={formData.razaoSocial}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <Typography variant="caption">{`${formData.razaoSocial.length}/120`}</Typography>
                  ),
                }}
                helperText="Limite de 120 caracteres"
              />
            </Grid>
          </Grid>
    
          {/* Seção 2: Horário de Funcionamento */}
          <Typography variant="h6" component="div" style={{ marginTop: '20px', font: '700 17px/28px Roboto,Helvetica Neue,sans-serif' }}>
            Horário de Funcionamento
          </Typography>
    
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                name="horaInicial"
                label="Horário inicial da clínica"
                variant="outlined"
                fullWidth
                margin="normal"
                size="small"
                required
                value={formData.horaInicial}
                onChange={handleChange}
                InputProps={{
                  inputProps: {
                    step: 1800, // Define o step de 30 minutos
                  },
                  placeholder: "hh:mm", // Texto de dica
                }}
                type="time"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="horaFinal"
                label="Horário final da clínica"
                variant="outlined"
                fullWidth
                margin="normal"
                size="small"
                required
                value={formData.horaFinal}
                onChange={handleChange}
                InputProps={{
                  inputProps: {
                    step: 1800, // Define o step de 30 minutos
                  },
                  placeholder: "hh:mm", // Texto de dica
                }}
                type="time"
              />
            </Grid>
          </Grid>
    
          {/* Seção 3: Informações da Clínica */}
          <Typography variant="h6" component="div" style={{ marginTop: '20px', font: '700 17px/28px Roboto,Helvetica Neue,sans-serif' }}>
            Informações da Clínica
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                name="telefone"
                label="Celular"
                variant="outlined"
                fullWidth
                margin="normal"
                size="small"
                required
                value={formData.telefone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="email"
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                size="small"
                required
                value={formData.email}
                onChange={handleChange}
                error={!!emailError}
                helperText={emailError}
              />
            </Grid>
          </Grid>
          {/* Seção 4: Localização */}
          <Typography variant="h6" component="div" style={{ marginTop: '20px', font: '700 17px/28px Roboto,Helvetica Neue,sans-serif' }}>
            Localização
          </Typography>
          <Grid container spacing={2} mb={1}>
            <Grid item xs={3}>
              <InputMask
                mask="99999-999"
                value={formData.endereco.cep}
                onChange={handleChange}
              >
                {(inputProps) => (
                  <TextField
                    name="endereco.cep"
                    label="CEP"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    size="small"
                    value={inputProps.value}
                    onChange={inputProps.onChange}
                  />
                )}
              </InputMask>
            </Grid>
            <Grid item xs={3}>
              <TextField
                name="endereco.rua"
                label="Rua"
                variant="outlined"
                fullWidth
                margin="normal"
                size="small"
                value={formData.endereco.rua}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                name="endereco.numero"
                label="Número"
                variant="outlined"
                fullWidth
                margin="normal"
                size="small"
                value={formData.endereco.numero}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                name="endereco.complemento"
                label="Complemento"
                variant="outlined"
                fullWidth
                margin="normal"
                size="small"
                value={formData.endereco.complemento}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} style={{ marginBottom: '15px' }}>
            <Grid item xs={4}>
              <TextField
                name="endereco.bairro"
                label="Bairro"
                variant="outlined"
                fullWidth
                margin="normal"
                size="small"
                required
                value={formData.endereco.bairro}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <Typography variant="caption">
                      {`${formData.endereco.bairro.length}/128`}
                    </Typography>
                  ),
                }}
                helperText="Limite de 128 caracteres"
              />
            </Grid>
            <Grid item xs={4} >
              <TextField
                name="endereco.cidade"
                label="Cidade"
                variant="outlined"
                fullWidth
                margin="normal"
                size="small"
                value={formData.endereco.cidade}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <Typography variant="caption">
                      {`${formData.endereco.cidade.length}/120`}
                    </Typography>
                  ),
                }}
                helperText="Limite de 120 caracteres"
              />
            </Grid>
            <Grid item xs={4}>
            <Autocomplete
                options={estadosDoBrasil}
                renderInput={(params) => (
                    <TextField
                    {...params}
                    name="endereco.estado"
                    label="Estado"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    size="small"
                    required
                    />
                )}
                value={formData.endereco.estado}  // Provide the value
                onChange={(event, newValue) => {
                    setFormData({
                    ...formData,
                    endereco: {
                        ...formData.endereco,
                        estado: newValue,
                    },
                    });
                }}
/>

          </Grid>
          </Grid>
          <Button
            variant="contained"
            onClick={handleSave}
            style={{
              backgroundColor: '#50ae54',
              color: 'white',
              position: 'absolute',
              bottom: '15px',
              right: '25px',
            }}
          >
            Salvar
          </Button>
        </form>
        )}
      {activeTab === 1 && (
        <div>
        <Grid container spacing={2} mt={6} style={{boxshadow: '1px 3px 8px 0px rgba(0,0,0,0.63)'}}> 
          {users.map((user) => (
            <Grid item key={user.id} xs={12} sm={6} md={3} lg={4}>
              <UserCard
                user={user} 
                onViewClick={() => handleUserEdit(user)}
                
              />
            </Grid>
          ))}
        </Grid>
        <a href="#" onClick={handleTestClick} style={{ display: "none !important" }}></a>
        {isModalOpen && <ModalUsuario />}
      </div>
        
        )}
          
        <ToastContainer />

      </Paper>
      );
      }
      
      export default AjustesClinica;
      