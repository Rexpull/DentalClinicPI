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
import Tooltip from '@mui/material/Tooltip';
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
import { useNavigate } from 'react-router-dom';
import WhatsAppIcon from "@mui/icons-material/WhatsApp";


const URL = 'https://clinicapi-api.azurewebsites.net/paciente/ListarPacientes';
const DELETE_URL = 'https://clinicapi-api.azurewebsites.net/Paciente/DeletarPaciente';

function Pacientes( user ) {
  const navigate = useNavigate();
  const [columns] = useState([
    { name: '', title: '', getCellValue: row => (row.sexo === 'F' ? 
    <AccountCircleIcon sx={{border:'3px solid pink' ,padding:'0px',borderRadius:'50px', width:'50px',height:'50px'}} /> : 
    <AccountCircleIcon sx={{border:'3px solid blue' ,padding:'0px',borderRadius:'50px', width:'50px',height:'50px'}}/>) },
    { name: 'nome', title: 'Nome' },
    { name: 'telefone', title: 'Celular do paciente' },
    { name: 'idade', title: 'Idade' },
    { name: 'cpf', title: 'CPF' },
    
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
  const [isModalPacienteOpen, setIsModalPacienteOpen] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  
  
  

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
          const mappedData = retorno.map((item) => {
            // Aqui criamos a URL do WhatsApp para cada paciente
            const whatsappUrl = `https://api.whatsapp.com/send?phone=55${item.telefone}&text=Ol%C3%A1,%20Paciente`;
            const idade = calcularIdade(item.dataNascimento);
            return {
              nome: item.nome,
              sexo: item.sexo,
              telefone: item.telefone,
              cpf: item.cpf,
              email: item.email,
              idade: idade + ' anos',
              actions: (
                <div>
                  <Tooltip title="Conversar com o paciente pelo WhatsApp">
                    <IconButton                
                      href={whatsappUrl}
                      target="_blank"
                      sx={{color: "#129909" }}
                    >
                      <WhatsAppIcon  sx={{color: "#129909" }}/>
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Mais Informações do paciente">
                    <IconButton color="primary" onClick={() => handleEdit(item)}>
                      <InfoIcon sx={{color:'Blue !important'}}/>
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Excluir paciente">
                    <IconButton onClick={() => handleDelete(item.id)}>
                      <DeleteIcon sx={{color:'red !important'}} />
                    </IconButton>
                  </Tooltip>
                </div>
              ),
            };
          });
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
    setEditingUser(item); 
    setIsModalPacienteOpen(true);
    navigate(`/app/paciente/detalhes/${item.id}`);
  };
  
  function calcularIdade(dataNascimento) {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  }

  const openModalPaciente = () => {
    setIsModalPacienteOpen(true);
  };
  
  const CustomSearchPanel = (props) => {
    return (
      <SearchPanel.Input
        {...props}
        placeholder="Pesquise pelo CPF" // Define o placeholder desejado
      />
    );
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
            toast.success("Registro excluído com sucesso!", {
              position: "bottom-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
            });
          } else {
            console.error(data.mensagem);
            toast.error("Houve uma falha na exclusão, Inative o Paciente!", {
              position: "bottom-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
            });
          }
        })
        .catch((error) => {
          console.error(error);
          toast.error("Houve uma falha na exclusão, Tente novamente!", {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
          });
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

  return (
    <Paper style={{ position: 'relative' }}>
      {isLoading ? (
        <div className="text-u" style={{ textAlign: 'center', padding: '100px' }}>
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
          <SearchPanel
            InputComponent={CustomSearchPanel} 
           />
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
      
 
    <Button color="success" aria-label="add" size='medium' onClick={openModalPaciente} sx={{position:'absolute', left:'1%',top:'7px',backgroundColor: "#50ae54",width:'240px',marginTop:'2px',marginBottom:'20px',color:'white', fontSize:'14px',
         '&:hover': {
            backgroundColor: "#408e43",
          }}}>
      <a
          href="#"
          onClick={openModalPaciente} // Apenas `openModalPaciente` sem `this`
          style={{ display: "none !important" }}
        ></a>
        {/* A condição para renderizar o ModalPaciente também deve ser atualizada */}
        {isModalPacienteOpen && (
          <ModalPaciente open={isModalPacienteOpen} onClose={() => setIsModalPacienteOpen(false)} sx={{color:'black'}}/>
        )}
    </Button>
    
      
    </Paper >
   
  );
}

export default Pacientes;
