import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Autocomplete } from "@mui/material";
import { InputLabel, Select, MenuItem, TextareaAutosize } from "@mui/material";
import {
  Button,
  TextField,
  Box,
  Typography,
  Paper,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  generatePDF,
} from "./utils/pdfGeneratorAtestado";
import Modal from "@mui/material/Modal";

function AtestadoForm({ patient, onClose, professionals }) {
  const navigate = useNavigate();
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [cid, setCid] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [horaInicial, setHoraInicial] = useState("");
  const [horaFinal, setHoraFinal] = useState("");
  const [tipo, setTipo] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [dias, setDias] = useState(''); // New state for the "Quantidade de Dias"

  const handleCidChange = (event) => {
    const newValue = event.target.value;
    if (newValue.length <= 100) { // Checks the length to ensure it's within the limit
      setCid(newValue);
    }
  };

  const handleSubmit = async () => {
    const atestadoData = {
      pacienteId: patient.id,
      profissionalId: selectedProfessional ? selectedProfessional.id : 1, // Garanta que selectedProfessional não seja null
      cid: cid,
      data: date, 
      dias: tipo ? 0 : dias, // Se tipo for true, dias será 0; caso contrário, use o valor de dias
      horaInicial: tipo ? horaInicial + ':00' : '00:00:00', 
      horaFinal: tipo ? horaFinal + ':00' : '00:00:00',
      tipo: tipo,
    };
    try {
      const response = await fetch(
        "https://clinicapi-api.azurewebsites.net/Atestado/CriarAtestado",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(atestadoData),
        }
      );
  
      if (!response.ok) {
        console.log(atestadoData);
        throw new Error("Failed to send atestado data");
      }
  
      const responseData = await response.json();
      console.log("Atestado sent successfully:", responseData);
    } catch (error) {
      console.error("Error sending atestado to API:", error);
    }
  };


  function formatarData(data) {
    const dataObj = new Date(data);
    const dia = String(dataObj.getDate()).padStart(2, '0');
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0'); // Janeiro é 0
    const ano = dataObj.getFullYear();
  
    return `${dia}/${mes}/${ano}`;
  }

  const handleDataChange = (event) => {
    setDate(event.target.value);
  };

  const handleOpenModal = async () => {
    // Primeiro, envie os dados para a API
    await handleSubmit(); // Isso vai esperar até que a função handleSubmit termine sua execução
  
    // Depois, abra o modal
    setOpenModal(true);
   
    console.log("Atestado enviada com sucesso.");
  };

  // Function to handle the closing of the modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const dataFormatada = formatarData(date);


  const formData = {
    date: dataFormatada,
    horaInicial: horaInicial,
    horaFinal: horaFinal,
    dias: dias,
    cid: cid,
    // Adicione outros campos conforme necessário
  };

  



  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "70vh",
        backgroundColor: "#fafafa",
      }}
    >
      <Paper sx={{ width: "fit-content", padding: 0 , width:'720px'}}>
        <Box>
          <div
            style={{
              backgroundColor: "whitesmoke",
              padding: 3,
              display: "flex",
            }}
          >
            <Button startIcon={<ArrowBackIcon />} onClick={onClose} />
            <Typography
              variant="h6"
              gutterBottom
              component="div"
              sx={{ color: "black" }}
            >
              Atestados
            </Typography>
          </div>
          <div
            style={{
              padding: 23,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              gap: "23px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <FormLabel>Tipo de atestado</FormLabel>
              <FormControl component="fieldset">
                <RadioGroup
                  row
                  aria-label="tipo"
                  name="tipo"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value === "true")}
                >
                  <FormControlLabel
                    value={false}
                    control={<Radio />}
                    label="Atestado de dias"
                  />
                  <FormControlLabel
                    value={true}
                    control={<Radio />}
                    label="Presença na consulta"
                  />
                </RadioGroup>
              </FormControl>
            </div>
            {tipo ? (
            <div style={{display:'flex',gap:'18px'}}>
              <TextField
                id="date"
                label="Data do atestado"
                type="date"
                size="small"
                sx={{width:'200px'}}
                required
                defaultValue={date}
                onChange={(e) => setDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                id="horaInicial"
                label="Hora inicial"
                type="time"
                required
                size="small"
                sx={{width:'170px'}}
                defaultValue={horaInicial}
                onChange={(e) => setHoraInicial(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                id="horaFinal"
                label="Hora final"
                type="time"
                required
                size="small"
                sx={{width:'170px'}}
                defaultValue={horaFinal}
                onChange={(e) => setHoraFinal(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </div>
            ) : (
              <div style={{display:'flex',gap:'18px'}}>
              <TextField
                id="date"
                label="Data do atestado"
                type="date"
                size="small"
                sx={{width:'200px'}}
                required
                defaultValue={date}
                onChange={(e) => setDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
             <TextField
                  id="quantidadeDias"
                  label="Quantidade de dias"
                  type="number"
                  size="small"
                  value={dias}
                  onChange={(e) => setDias(e.target.value)}
                  required
                />
            </div>
            )
            }
            <TextField
              id="cid"
              label="CID"
              required
              sx={{ width: '350px', marginTop: "18px" }}
              size="small"
              value={cid}
              onChange={handleCidChange}
              inputProps={{
                maxLength: 100
              }}
              helperText={`${cid.length}/100`}
            />
          </div>

          {/* Add more form fields as needed */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              paddingTop: "18px",
              gap: "10px",
              paddingBottom: 23,
              paddingRight: 23,

            }}
          >
            <Button variant="text" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#2e7d32" }}
              onClick={handleOpenModal}
            >
              Emitir Atestado
            </Button>
          </div>
        </Box>
      </Paper>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div
          style={{
            backgroundColor: "white",
            padding: 20,
            outline: "none",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography variant="h5">
            Oque você quer fazer com o Atestado?
          </Typography>

          <Typography variant="h6">Paciente: {patient.name}</Typography>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "45px",
              gap: "8px",
            }}
          >
            <Button variant="text" onClick={handleCloseModal}>
              {" "}
              Fechar{" "}
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#2e7d32" }}
              onClick={() => generatePDF("print-content", patient, tipo,formData)}
            >
              Baixar PDF
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default AtestadoForm;
