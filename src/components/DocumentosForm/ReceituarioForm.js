import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Paper,Autocomplete } from '@mui/material';
import { FormControl, InputLabel, Select, MenuItem, TextareaAutosize } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { generatePDF, sendWhatsAppMessage } from './utils/pdfGeneratorReceituario';
import Modal from '@mui/material/Modal';



function PrescriptionForm({ patient, onClose }) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [suggestedMedications, setSuggestedMedications] = useState([]);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [medication, setMedication] = useState({
    name: '',
    quantity: 1,
    measure: 'caixa',
    posology: 'Tomar 2 comprimidos via oral de 12 em 12 horas por 5 dias',
   
  });
  
  const medicationData = {
    medications: [
      { name: "Aciclovir 200mg", dosage: "200mg" },
      { name: "Aciclovir (Creme, pomada)", dosage: "Creme/Pomada" },
      { name: "Amoxicilina 500mg", dosage: "500mg" },
      { name: "Azitromicina 500mg", dosage: "500mg" },
      { name: "Clavulin 500mg", dosage: "500mg" },
      // ... more medications
      { name: "Lisinopril 10mg", dosage: "10mg" },
      { name: "Metoprolol 50mg", dosage: "50mg" },
      { name: "Omeprazole 20mg", dosage: "20mg" },
      { name: "Losartan 50mg", dosage: "50mg" },
      { name: "Atenolol 25mg", dosage: "25mg" },
      { name: "Montelukast 10mg", dosage: "10mg" },
      { name: "Pantoprazole 40mg", dosage: "40mg" },
      { name: "Escitalopram 10mg", dosage: "10mg" },
      { name: "Prednisone 20mg", dosage: "20mg" },
      { name: "Meloxicam 15mg", dosage: "15mg" },
      { name: "Sertraline 50mg", dosage: "50mg" },
      { name: "Fluoxetine 20mg", dosage: "20mg" },
      { name: "Tramadol 50mg", dosage: "50mg" },
      { name: "Warfarin 5mg", dosage: "5mg" },
      { name: "Simvastatin 20mg", dosage: "20mg" },
      { name: "Alprazolam 0.25mg", dosage: "0.25mg" },
      { name: "Amlodipine 5mg", dosage: "5mg" },
      { name: "Ciprofloxacin 500mg", dosage: "500mg" },
      { name: "Diclofenac 75mg", dosage: "75mg" },
    ]
  };

  const handleQuantityChange = (event) => {
  setMedication({ ...medication, quantity: event.target.value });
};

const handleMeasureChange = (event) => {
  setMedication({ ...medication, measure: event.target.value });
};

const handlePosologyChange = (event) => {
  setMedication({ ...medication, posology: event.target.value });
};

const handleDataChange = (event) => {
  setDate(event.target.value);
};

  const handleOpenModal = () => {
    setOpenModal(true);
    sendPrescriptionToAPI(5, medication);
    console.log(medication);
   
    console.log("Receita enviada com sucesso.");
  };

  // Function to handle the closing of the modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const sendPrescriptionToAPI = async (patientId, medicationData) => {
    const prescriptionData = {
      pacienteId: patient.id,
      profissionalId: 5, // Ajuste conforme necessário
      dataReceita: date,
      medida: medicationData.measure,
      medicamento: medicationData.name,
      posologia: medicationData.posology,
      quantidade: medicationData.quantity
    };
  
    try {
      const response = await fetch('https://clinicapi-api.azurewebsites.net/Receituario/CriarReceituario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(prescriptionData)
      });
  
      if (!response.ok) {
        throw new Error('Failed to send prescription data');
      }
  
      const responseData = await response.json();
      console.log('Prescription sent successfully:', responseData);
    } catch (error) {
      console.error('Error sending prescription to API:', error);
    }
  };

  function searchMedications(input) {
    // A simple search that filters medications based on the input and returns the top 8 matches
    return medicationData.medications
      .filter(med => med.name.toLowerCase().includes(input.toLowerCase()))
      .slice(0, 8);
  }

  const handleInputChange = (event, newInputValue) => {
    // Check if the input value is a string before trying to call toLowerCase on it
    if (typeof newInputValue === 'string') {
      setInputValue(newInputValue);
      const results = searchMedications(newInputValue);
      setSuggestedMedications(results);
    }
  };
  
  const handlePrint = async () => {
    // Faça a chamada à API da clínica aqui
    const clinicResponse = await fetch(`https://clinicapi-api.azurewebsites.net/Clinica/ListarClinicas`);
    const clinicData = await clinicResponse.json();
  
    // Agora chame generatePDF com os dados necessários
    generatePDF('print-content', patient, medication, clinicData);

    
  };

  const handleSendWhatsApp = () => {
    const message = 'Your prescription message here';
    sendWhatsAppMessage('patientPhoneNumber', message);
  };

  const medicationOptions = medicationData.medications.map((medication, index) => ({
    label: medication.name,
    id: index
  }));

  const handleMedicationSelect = (event, newValue) => {
    if (newValue) {
      setSelectedMedication(newValue);
      setMedication({
        ...medication,
        name: newValue.label, // Aqui usamos newValue em vez de selectedMedication
        // Adicione outros campos conforme necessário
      });
    } else {
      setSelectedMedication(null);
      setMedication({
        name: '',
        quantity: 0,
        measure: '',
        posology: ''
      });
    }
  };
  


  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh', backgroundColor: '#fafafa' }}>
      <Paper sx={{ width: 'fit-content', padding: 0 }}>
        <Box>
          <div style={{ backgroundColor: 'whitesmoke', padding: 3, display: 'flex' }}>
            <Button startIcon={<ArrowBackIcon />} onClick={onClose} />
            <Typography variant="h6" gutterBottom component="div" sx={{ color: 'black' }}>
              Receituário
            </Typography>
          </div>
          <div style={{ padding: 23 }}>
            <div style={{display:'flex',justifyContent:'space-between'}}>
            <Typography pb={1}  variant="h6">Paciente: {patient.name}</Typography>
            <TextField
              id="date"
              label="Data"
              size='small'
              type="date"
              pb={6}
              defaultValue={date}
              sx={{ width: 220 }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            </div>
             <Autocomplete
              disablePortal
              size='small'
              id="combo-box-demo"
              options={medicationOptions}
              sx={{ width: 700,paddingTop:2 }}
              renderInput={(params) => <TextField {...params} label="Clique para adicionar o medicamento" />}
              onInputChange={handleInputChange}
              onChange={handleMedicationSelect}
            />
            {selectedMedication && (
              <div style={{border:'1px solid #ccc', paddingLeft:10,paddingRight:10,borderRadius:'5px', marginTop:19}}>
                <div style={{display:'flex', gap:'28px'}}>
              <TextField
                type="number"
                label="Qtd"
                required
                variant="outlined"
                size='small'
                margin="normal"
                fullWidth
                value={medication.quantity}
                onChange={handleQuantityChange}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel id="unit-label">Medida</InputLabel>
                <Select
                  labelId="unit-label"
                  id="unit-select"
                  label="Medida"
                   size='small'
                  required
                  defaultValue="caixa"
                  value={medication.measure}
                  onChange={handleMeasureChange}
                >
                  <MenuItem value="caixa">Caixa(s)</MenuItem>
                  <MenuItem value="frasco">Frasco(s)</MenuItem>
                  <MenuItem value="ampola">Ampola(s)</MenuItem>
                  <MenuItem value="comprimido">Comprimido(s)</MenuItem>
                  <MenuItem value="pacote">Pacote(s)</MenuItem>
                  <MenuItem value="tubo">Tubo(s)</MenuItem>
                  <MenuItem value="capsula">Cápsula(s)</MenuItem>
               
                </Select>
              </FormControl>
                </div>  
              <TextField
                label="Posologia"
                placeholder="Posologia"
                multiline
                rows={2}
                margin="normal"
                variant="outlined"
                size='small'
                fullWidth
                
                focused
                sx={{borderColor:'#ccc'}}
                value={medication.posology}
                onChange={handlePosologyChange}
              />
            </div>
            )}
            {/* Add more form fields as needed */}
            <div style={{display:'flex', justifyContent:'flex-end',paddingTop:'15px',gap:'10px'}}>

            <Button variant="text" onClick={onClose}>Cancelar</Button>
            <Button variant="contained" sx={{backgroundColor:'#2e7d32' }} onClick={handleOpenModal} >Imprimir</Button>
            </div>
          </div>
        </Box>
      </Paper>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={{ backgroundColor: 'white', padding: 20, outline: 'none', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          
          <Typography variant="h5">Oque você quer fazer com a Receita?</Typography>
          
          <Typography variant="h6">Paciente: {patient.name}</Typography>
          
          <div style={{display:'flex',justifyContent:'flex-end',marginTop:'45px',gap:'8px' }}>
          <Button variant="text"  onClick={handleCloseModal}> Fechar </Button>
          <Button variant="contained" sx={{backgroundColor:'#2e7d32'}}  onClick={() => generatePDF('print-content', patient)}>Baixar PDF</Button>
          </div>
         
          
        </div>
      </Modal>
    </div>
  );
}

export default PrescriptionForm;
