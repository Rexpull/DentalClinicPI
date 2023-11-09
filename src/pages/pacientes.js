import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import {
  PagingState,
  CustomPaging,
  SearchState,
  IntegratedFiltering,
  SortingState,
  IntegratedSorting,
  IntegratedPaging,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow,
  Toolbar,
  SearchPanel,
  PagingPanel,
} from '@devexpress/dx-react-grid-material-ui';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import "../style/css/paciente.css";
import ModalPaciente from "../components/ModalPaciente";


const URL = 'https://clinicapi-api.azurewebsites.net/paciente/ListarPacientes';
const DELETE_URL = 'https://clinicapi-api.azurewebsites.net/Paciente/DeletarPaciente';

function Pacientes() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [columns] = useState([
    { name: 'sexo', title: 'Sexo', getCellValue: row => (row.sexo === 'F' ? 
    <AccountCircleIcon sx={{border:'3px solid pink' ,padding:'0px',borderRadius:'50px', width:'50px',height:'50px'}} /> : 
    <AccountCircleIcon sx={{border:'3px solid blue' ,padding:'0px',borderRadius:'50px', width:'50px',height:'50px'}}/>) },
    { name: 'nome', title: 'Nome' },
    { name: 'telefone', title: 'Telefone' },
    { name: 'cpf', title: 'CPF' },
    { name: 'email', title: 'Email' },
    { name: 'actions', title: 'Ações'   },
   
  ]);

  const [rows, setRows] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(9);
  const [currentPage, setCurrentPage] = useState(0);
  const [lastQuery, setLastQuery] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [patientToDeleteId, setPatientToDeleteId] = useState(null);
  const [isModalPacienteOpen, setIsModalPacienteOpen] = useState(false);


  const getQueryString = () => (
    `${URL}?take=${pageSize}&skip=${pageSize * currentPage}`
  );

  
  const loadData = () => {
    const queryString = getQueryString();
    if (queryString !== lastQuery) {
      setIsLoading(true);
      fetch(queryString)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Erro na solicitação da API');
          }
          return response.json();
        })
        .then(({ retorno, totalCount: newTotalCount }) => {
          if (!retorno || retorno.length === 0) {
            setRows([]);
            setTotalCount(0);
          } else {
            const mappedData = retorno.map((item) => ({
              nome: item.nome,
              sexo: item.sexo,
              telefone: item.telefone,
              cpf: item.cpf,
              email: item.email,
              actions: (
                <div >
                  <IconButton color="primary" onClick={() => handleEdit(item)}>
                    <InfoIcon />
                  </IconButton>
                  <IconButton color="danger" onClick={() => handleDelete(item.id)}>
                    <DeleteIcon />
                  </IconButton>
                </div>
              ),
            }));
            setRows(mappedData);
            setTotalCount(newTotalCount);
          }
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
      setLastQuery(queryString);
    }
  };

  const handleEdit = (item) => {
    // Implemente a lógica para editar o item aqui
  };

  const openModalPaciente = () => {
    setIsModalPacienteOpen(true);
  };

  const handleDelete = (id) => {
    console.log(id);
    setPatientToDeleteId(id);
    setIsDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirmation = (confirmed) => {
    setIsDeleteConfirmationOpen(false);
    if (confirmed) {
      const idToDelete = patientToDeleteId;
      console.log('ID a ser excluído:', idToDelete);
  
      const deleteUrlWithId = `${DELETE_URL}?id=${idToDelete}`;
  
      fetch(deleteUrlWithId, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Erro na solicitação da API de exclusão');
          }
          return response.json();
        })
        .then((data) => {
          if (data.sucesso) {
            // Atualize os dados após a exclusão bem-sucedida
            const updatedRows = rows.filter(item => item.id !== idToDelete);
            setRows(updatedRows);
            notifySuccess('Registro excluído com sucesso!'); // Notificação de sucesso
          } else {
            console.error(data.mensagem);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };
  
  

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(0);
  };

  useEffect(() => {
    loadData();
  }, [currentPage, pageSize]);

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      if (currentPage * pageSize < totalCount) {
        setCurrentPage(currentPage + 1);
      }
    }
  };

  // Função para notificação de sucesso
  const notifySuccess = (message) => {
    toast.success(message, {
      position: "bottom-right",
      autoClose: 3500,
      hideProgressBar: false,
      closeOnClick: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  return (
    <Paper style={{ position: 'relative' }}>
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '100px' }}>
          Carregando dados...
        </div>
      ) : (
        <Grid rows={rows} columns={columns} noDataText="Nenhum Registro Encontrado" onScroll={handleScroll}>
          <PagingState
            currentPage={currentPage}
            onCurrentPageChange={setCurrentPage}
            pageSize={pageSize}
          />
          <SortingState defaultSorting={[{ columnName: 'nome', direction: 'asc' }]} />
          <IntegratedSorting />
          <SearchState />
          <IntegratedFiltering />
          <CustomPaging
            totalCount={totalCount}
          />
          <IntegratedPaging />
          <Table />
          <TableHeaderRow showSortingControls />
          <Toolbar /> {/* Adicione a Toolbar para a barra de ferramentas */}
          <SearchPanel />
          <PagingPanel
            pageSizes={[9, 20, 50, 100]}
            onPageSizeChange={handlePageSizeChange}
          />
        </Grid>
      )}

      <Dialog
        open={isDeleteConfirmationOpen}
        onClose={() => handleDeleteConfirmation(false)}
      >
        <DialogContent>
          <DialogContentText>
            Tem certeza de que deseja excluir este registro?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDeleteConfirmation(false)} color="error">
            Não
          </Button>
          <Button onClick={() => handleDeleteConfirmation(true)} color="primary"  variant="contained">
            Sim
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer /> {/* Toastify container */}
      
 
    <Fab color="success" aria-label="add" size='medium' onClick={openModalPaciente} sx={{position:'absolute', left:'1%',top:'7px'}}>
      <AddIcon />
      <ModalPaciente open={isModalPacienteOpen} onClose={() => setIsModalPacienteOpen(false)} sx={{color:'black'}}/>
    </Fab>
    
      
    </Paper >
   
  );
}

export default Pacientes;
