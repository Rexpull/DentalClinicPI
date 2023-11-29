import React, { useState,useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import { Editor } from "@tinymce/tinymce-react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";


const AddEvolutionModal = ({ open, handleClose, handleAdd,setIsAddEvolutionModalOpen, id, handleDeleteEvolution, readOnly,readOnlyModal}) => {
  const [date, setDate] = useState(new Date());
  const [text, setText] = useState("");
  const [professional, setProfessional] = useState('');
  const [professionals, setProfessionals] = useState([]); // Array para guardar os profissionais
  const handleProfessionalChange = (event) => {
    setProfessional(event.target.value);
  };

  const handleDateChange = (newValue) => {
    setDate(newValue);
  };

  const handleEditorChange = (content, editor) => {
    setText(content);
  };

  

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

  

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems:'center',
        maxHeight: "600px !important",
      }}
    >
      <Paper sx={{ width: "650px", heigth: "600px !important" }}>
        <Box sx={{heigth: "600px !important" }}>
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{font: '400 20px/32px Roboto,Helvetica Neue,sans-serif',letterSpacing: 'normal', margin: '0 0 19px',paddingTop:'20px',paddingLeft:'25px'}}>
          Adicionar evolução odontológica
          </Typography>
          <div style={{ display: "flex", justifyContent:'space-between',padding: '0 25px', gap:'20px' }}>
          <TextField
            size="small"
            fullWidth
            labelId="professional-label"
            id="professional"
            value={professional}
            label="Profissional"
            onChange={handleProfessionalChange}
            select
          >
            {professionals.map((prof) => (
              <MenuItem key={prof.id} value={prof.id}>
                {prof.nome}
              </MenuItem>
            ))}
          </TextField>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
                label="Data"
                inputFormat="dd/MM/yyyy"
                size="small"
                value={date}
                readOnly={readOnlyModal}
                onChange={(newValue) => {
                  setDate(newValue);
                }}
                renderInput={(params) => (
                  <TextField {...params} size="small"  />
                )}
              />
            </LocalizationProvider>
          </div>
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{font: '600 17px/28px Roboto,Helvetica Neue,sans-serif',letterSpacing: 'normal',paddingTop:'20px',paddingLeft:'25px'}}>
          Evolução
          </Typography>
          <Box
            sx={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
            
            }}
          >
            <Editor
              init={{
                height: 300,
                width: 600,
                menubar: false,
                disabled: readOnlyModal,
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "print",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "insertdatetime",
                  "media",
                  "table",
                  "paste",
                  "code",
                  "wordcount",
                ],
                toolbar: "undo redo | formatselect | " + "bold  |  bullist",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                  placeholder: "Insira o texto da evolução aqui...", 
                api_key: "ulvad2203an7i2wv0odtpknes1k84pi4p7x3rl3sixe70ciz",
              }}
              onEditorChange={handleEditorChange}
            />
          </Box>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              width: "100%",
              marginTop: "30px",
              marginBottom: "25px",
              gap: "10px",
              paddingRight: "25px",
            }}
          >
            {readOnlyModal ? (
            <Button
              variant="text"
              onClick={handleClose}
              sx={{ display: "flex", alignItems: "center", color: "black" }}
            >
              Fechar
            </Button>
            ) : (
              <>
              <Button
              variant="text"
              onClick={handleClose}
              sx={{ display: "flex", alignItems: "center", color: "black" }}
              >
              Cancelar
            </Button>
            <Button
              onClick={() => handleAdd(professional, date, text)}
              variant="contained"
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#50ae54",
              }}
            >
              Adicionar
            </Button>
              </>
            )}
          </div>
        </Box>
      </Paper>
    </Modal>
  );
};

export default AddEvolutionModal;
