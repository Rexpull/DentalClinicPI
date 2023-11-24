import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  InputAdornment 
} from '@mui/material';
import Autocomplete from "@mui/material/Autocomplete";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import SouthWestIcon from '@mui/icons-material/SouthWest';
import { format } from 'date-fns';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

function AddModalReceita({ open, handleClose }) {
const [professionals, setProfessionals] = useState([]);
const [pacientes, setPacientes] = useState([]);
  const [selectedPaciente, setSelectedPaciente] = useState(null);
const [professional, setProfessional] = useState("");
const [charCount, setCharCount] = useState(0); 
  const [formData, setFormData] = useState({
    numDocto: '',
    pacienteId: '',
    profissionalId: '',
    agendamentoId: '',
    dataLancamento: null,
    dataVencimento: null,
    valor: '',
    valorRecebido: '',
    dataRecebimento: null,
    observacao: '',
    situacao: '',
    formaQuitacao: ''
  });

  useEffect(() => {

    // Carregar pacientes
    const fetchPacientes = async () => {
      try {
        const response = await axios.get('https://clinicapi-api.azurewebsites.net/Paciente/ListarPacientes');
        if (response.status === 200) {
          setPacientes(response.data.retorno);
        } else {
          console.error("Erro ao buscar pacientes. Status:", response.status);
        }
      } catch (error) {
        console.error("Erro ao buscar pacientes:", error);
      }
    };

    fetchPacientes();
  }, []);

  useEffect(() => {
    // Função para carregar os profissionais do banco de dados
    const fetchProfessionals = async () => {
      const professionalusers = "https://clinicapi-api.azurewebsites.net/Usuario/ListarUsuarios?param=0";
      try {
        const response = await axios.get(professionalusers);
        if (response.status === 200) {
          const fetchedProfessionals = response.data.retorno.map(user => ({
            id: user.id,
            nome: user.nome,
          }));
          setProfessionals(fetchedProfessionals);
          
        } else {
          console.error("Erro ao buscar profissionais. Status:", response.status);
        }
      } catch (error) {
        console.error("Erro ao buscar profissionais:", error);
      }
    };

    fetchProfessionals();
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "observacao") {
        setCharCount(value.length); // campo de observação
      }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!selectedPaciente || !professional || !formData.dataVencimento || !formData.valor) {
        toast.warn("Por favor, preencha todos os campos obrigatórios.");
        return; 
      }

    // Define a situação com base na data de vencimento
    const dataAtual = new Date();
    const situacao = formData.dataVencimento && formData.dataVencimento < dataAtual ? 'Vencido' : 'Em Aberto';
  
    // Formata os campos de data e prepara os dados para enviar
    const dadosParaEnviar = {
      numDocto: formData.numDocto || 'N/I',
      pacienteId: formData.pacienteId ,
      profissionalId: formData.profissionalId ,
      agendamentoId: 0,
      dataLancamento: new Date().toISOString().split('T')[0], // Data atual
      dataVencimento: formData.dataVencimento ? format(formData.dataVencimento, 'yyyy-MM-dd') : '',
      valor: formData.valor,
      valorRecebido: 0,
      dataRecebimento: '1970-01-01',
      observacao: formData.observacao ,
      situacao: situacao,
      formaQuitacao: ''
    };
    try {
      const response = await axios.post('https://clinicapi-api.azurewebsites.net/ContasReceber/CriarContasReceber', dadosParaEnviar);
      toast.success("Receita salva com sucesso!");
        handleClose();
    } catch (error) {
      console.error("Erro ao salvar a receita:", error);
      toast.error("Erro ao salvar a receita.");
    }
  };
  


  const handleProfessionalChange = (event) => {
    const selectedProfessionalId = event.target.value;
    setProfessional(selectedProfessionalId);
  
    const selectedProfessional = professionals.find(prof => prof.id === selectedProfessionalId);
    if (selectedProfessional) {
      setFormData(prevData => ({
        ...prevData,
        profissionalId: selectedProfessionalId
      }));
    }
  };
  

  return (
    <>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle sx={{display:'flex', justifyContent:'flex-start',gap:'6px', alignItems:'center'}}>Adicionar <span style={{color:'green'}}>Receita</span> <SouthWestIcon sx={{color:'green', mr:2}}/></DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <div style={{display:'flex', justifyContent:'space-between',gap:'10px', alignItems:'center'}}>
            <Autocomplete
                freeSolo
                fullWidth
                sx={{marginBottom:'5px'}}
                options={pacientes}
                getOptionLabel={(option) => option.nome}
                value={selectedPaciente}
                onChange={(_, newValue) => {
                    setSelectedPaciente(newValue);
                    setFormData(prevData => ({
                    ...prevData,
                    pacienteId: newValue ? newValue.id : ''
                    }));
                }}
                renderInput={(params) => (
                    <TextField {...params} label="Paciente" margin="normal" size="small" fullWidth required />
                )}
                />
                <TextField
                    size="small"
                    fullWidth
                    labelId="professional-label"
                    id="professional"
                    value={professional}
                    label="Profissional Contratada"
                    required
                    onChange={handleProfessionalChange}
                    select
                >
                    {professionals.map((prof) => (
                    <MenuItem key={prof.id} value={prof.id}>
                        {prof.nome}
                    </MenuItem>
                    ))}
                </TextField>
                
            </div>

            <div style={{display:'flex', justifyContent:'space-between',gap:'10px', alignItems:'center'}}>
                <DatePicker
                        label="Data de Vencimento"
                        value={formData.dataVencimento}
                        onChange={(newValue) => setFormData({ ...formData, dataVencimento: newValue })}
                        renderInput={(params) => <TextField {...params} fullWidth margin="normal" size="small" required/>}
                    />
                <TextField
                label="Numero do Documento"
                name="numDocto"
                value={formData.numDocto}
                onChange={handleChange}
                size="small"
                fullWidth
                margin="normal"
                
                />
                <TextField
                label="Valor"
                name="valor"
                value={formData.valor}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                size="small"
                type="number"
                InputProps={{
                    startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                }}
                />
            </div>
            <TextField
                label="Observação"
                name="observacao"
                value={formData.observacao}
                onChange={handleChange}
                fullWidth
                margin="normal"
                multiline
                rows={3} 
                size="small"
                helperText={`${charCount}/500`} //contagem de caracteres

            />
            {/* Outros campos do formulário como valorRecebido, dataRecebimento, etc. */}
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{color:'black'}}>Fechar</Button>
          <Button variant="contained" onClick={handleSubmit} sx={{backgroundColor:'#50ae54',fontWeight:600}}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
    <ToastContainer />
</>
    
  );
}

export default AddModalReceita;
