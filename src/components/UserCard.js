import React, { useState } from "react";
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faUserLarge,faPhone,faCheck,faXmark } from '@fortawesome/free-solid-svg-icons';
import '../style/css/UserCard.css';
import { Column } from 'devextreme-react/data-grid';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from "axios";

const contentStyle = {
  flexGrow: 1,
  padding: 0,
};

const bodyStyle = {
  paddingLeft: 2,
  paddingRight: 3,
  color: '#696969 !important',
  fontSize:'16px',
  display:'flex',
  gap:'10px',
  alignItems:'center',
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  paddingTop: '18px',
  paddingRight: '6px',
  paddingLeft: '6px',
};



function getColorByInitial(initial) {
  const colorMap = {
    A: '#FF5733',
    B: '#33FF57',
    C: '#5733FF',
    D: '#FF57A7',
    E: '#57FFA7',
    F: '#FFC433',
    G: '#33FFC4',
    H: '#A733FF',
    I: '#FFB433',
    J: '#33FFB4',
    K: '#A7FF33',
    L: '#337AFF',
    M: '#d33D3A',
    N: '#A7FFB4',
    O: '#FFA733',
    P: '#A266F3',
    Q: '#33B4FF',
    R: '#FF33B4',
    S: '#B433FF',
    T: '#33FFA7',
    U: '#A7B4FF',
    V: '#FF33A7',
    W: '#33A7FF',
    X: '#FF7A33',
    Y: '#337AFF',
    Z: '#FFB433',
  };

  // cor padrão
  const defaultColor = '#999999';

  // inicial para maiúscula
  const upperInitial = initial.toUpperCase();

  // Verifique se a inicial está no mapa de cores
  if (colorMap.hasOwnProperty(upperInitial)) {
    return colorMap[upperInitial];
  }

  // Caso contrário, use a cor padrão
  return defaultColor;
}

function UserCard({ user, onViewClick }) {
  const [openConfirmationDialog, setOpenConfirmationDialog] = React.useState(false);


  const initials = user.nome[0];
  const color = getColorByInitial(initials);

  const reactivateUser = (user) => {
    // Chame a API para atualizar o atributo 'ativo' para true
    axios
      .put(`https://clinicapi-api.azurewebsites.net/Usuario/EditarUsuario/?id=${user.id}`, {
        ...user, // Mantenha os outros dados inalterados
        ativo: true, // Atualize 'ativo' para true
      })
      .then((response) => {
        // Se a chamada da API for bem-sucedida, você pode realizar ações adicionais, se necessário.
        console.log(`Usuário reativado: ${user.nome}`);
      })
      .catch((error) => {
        // Lidere com erros, por exemplo, exiba uma mensagem de erro ao usuário.
        console.error("Erro ao reativar o usuário", error);
      });
  };

  // Function to delete the user (example)
  const deleteUser = (user) => {
    // You can implement the logic to delete the user here
    console.log(`Deleting user: ${user.nome}`);
  };

  const backgroundClass = user.sexo === 'F' ? 'feminino-background' : 'masculino-background';
  const backgroundClassAtivo = user.ativo ? 'ativo-background' : 'inativo-background';
  return (
    <>
    <Card variant="outlined" style={{ marginTop: '20px' }} className='Cardzinho'>
      <CardContent sx={contentStyle}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }} className={backgroundClass}>
        <div
            style={{
              position: 'relative', // Required for positioning the badge
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '10px',
                color: 'white',
                fontSize: '18px',
                textTransform: 'uppercase',
                fontWeight: '600',
              }}
            >
              {initials}
              {user.ativo ? (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-2px',
                    right: '8px',
                    backgroundColor: 'green', // Color for active
                    color: 'white',
                    borderRadius: '50%',
                    padding: '0.5px 4px',
                    fontSize: '10px',
                  }}
                >
                  <FontAwesomeIcon icon={faCheck} />
                </div>
              ) : (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-2px',
                    right: '8px',
                    backgroundColor: 'red', // Color for inactive
                    color: 'white',
                    borderRadius: '50%',
                    padding: '0.5px 4px',
                    fontSize: '10px',
                  }}
                >
                  <FontAwesomeIcon icon={faXmark} />
                </div>
              )}
            </div>
          </div>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: '600',margin:'0 !important',height:'29px' }}>
              {user.nome}
            </Typography>
            <Typography sx={{fontSize:'14px'}}>
            {user.email}
            </Typography>
          </div>
        </div>
        <Typography variant="body2" sx={bodyStyle} style={{marginBottom:'10px',marginTop:'15px'}}>
        <FontAwesomeIcon icon={faUserLarge} /> {user.acesso.descricao}
        </Typography>

        <Typography variant="body2" sx={bodyStyle}>
        <FontAwesomeIcon icon={faPhone} />{user.telefone}
        </Typography>
      </CardContent>
      <div style={buttonContainerStyle}>
        {user.ativo ? ( 
          <Button onClick={() => onViewClick(user)} color="primary">
            Editar
          </Button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center'}}>
            <Button onClick={() => reactivateUser(user)} color="primary" sx={{fontWeight: '500',fontfamily: 'Roboto,Helvetica Neue,sans-serif',webkitfontsmoothing: 'antialiased',lineheight: '36px'}}>
              Reativar
            </Button>
            <Button onClick={() => setOpenConfirmationDialog(true)} color="error">
              Excluir
            </Button>

          </div>
        )}
      </div>
    </Card>

    <Dialog
    open={openConfirmationDialog}
    onClose={() => setOpenConfirmationDialog(false)}
    >
    <DialogTitle>Confirmação</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Tem certeza de que deseja excluir este registro?
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={() => setOpenConfirmationDialog(false)} color="primary">
        Não
      </Button>
      <Button
        onClick={() => {
          setOpenConfirmationDialog(false);
          // Chame sua função de exclusão aqui
          deleteUser(user);
        }}
        color="error"
      >
        Sim
      </Button>
    </DialogActions>
    </Dialog>
    </>
  );
}

export default UserCard;
