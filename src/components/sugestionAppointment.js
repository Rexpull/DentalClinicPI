import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Button from "@mui/material/Button";
import "../style/css/Sugestion.css";

const horariosManha = [
  "09h30 às 10h00",
  "10h00 às 10h30",
  "10h30 às 11h00",
  "11h00 às 11h30",
  "11h30 às 12h00",
];

const horariosTarde = [
  "13h00 às 13h30",
  "13h30 às 14h00",
  "14h00 às 14h30",
  "14h30 às 15h00",
  "15h00 às 15h30",
  "15h30 às 16h00",
  "16h00 às 16h30",
  "16h30 às 17h00",
  "17h00 às 17h30",
  "17h30 às 18h00",
];

function SugestaoHorarios({ open, onClose }) {
    const [horarioSelecionado, setHorarioSelecionado] = useState(null);
    const [dataSelecionada, setDataSelecionada] = useState(null);
  
    const handleHorarioChange = (horario) => {
      setHorarioSelecionado(horario);
      // Adicione o código para definir a data selecionada aqui
      // Por exemplo, você pode definir a data atual mais o horário selecionado
      const novaDataSelecionada = new Date();
      novaDataSelecionada.setHours(parseInt(horario.split(" ")[0].split("h")[0]));
      novaDataSelecionada.setMinutes(parseInt(horario.split(" ")[2].split("h")[0]));
      setDataSelecionada(novaDataSelecionada);
    };
  
    const handleEscolherData = () => {
      onClose(horarioSelecionado);
      // Adicione o código para definir a data no estado do AppointmentFormContainerBasic
      // Você pode passar a dataSelecionada para o componente pai ou tomar a ação desejada aqui.
    };
  

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xxs" >
      <DialogTitle>Sugestão de Horários</DialogTitle>
      <DialogContent>
        <div className="principal">
          <div className="card">
            <h3 className="h3-title"><span>Manhã</span></h3>
            <FormControl component="fieldset" >
              <FormGroup className="card-content">
                {horariosManha.map((horario, index) => (
                  <FormControlLabel
                    key={index}
                    control={
                      <Radio
                        checked={horarioSelecionado === horario}
                        onChange={() => handleHorarioChange(horario)}
                      />
                    }
                    label={horario}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </div>
          <div className="card">
            <h3 className="h3-title"><span>Tarde</span></h3>
            <FormControl component="fieldset" >
              <FormGroup className="card-content">
                {horariosTarde.map((horario, index) => (
                  <FormControlLabel
                    key={index}
                    control={
                      <Radio
                        checked={horarioSelecionado === horario}
                        onChange={() => handleHorarioChange(horario)}
                      />
                    }
                    label={horario}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </div>
        </div>
      </DialogContent>
      <div style={{ paddingLeft: "680px", paddingBottom: "15px", marginRight: '10px' }}>
        <Button onClick={onClose} style={{ paddingRight: "30px", color: '#000', fontFamily: 'Roboto,Helvetica Neue,sans-serif', fontSize: '14px', fontWeight: '700' }}>Fechar</Button>
        <Button onClick={handleEscolherData} variant="contained" color="success" style={{ fontFamily: 'Roboto,Helvetica Neue,sans-serif', fontSize: '14px', fontWeight: '700' }}>
          Escolher Data
        </Button>
      </div>
    </Dialog>
  );
}

export default SugestaoHorarios;
