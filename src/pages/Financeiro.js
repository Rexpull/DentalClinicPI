import React from 'react';
import { Tabs, Tab, Button, Menu, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import SouthWestIcon from '@mui/icons-material/SouthWest';
import LinearProgress from '@mui/material/LinearProgress';
import RemoveIcon from '@mui/icons-material/Remove';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import '../style/css/financeiro.css';

const FinancePage = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Tabs value={0} /* value controlado pelo estado */>
        <Tab label="Fluxo de Caixa" />
        <Tab label="Comissões" />

      </Tabs>

    <div style={{display:'flex',justifyContent:'flex-end'}}>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
        variant="contained"
        color="primary"
        sx={{ backgroundColor: "#50ae54",width:'170px',marginTop:'2px',marginBottom:'20px',color:'white',
         '&:hover': {
            backgroundColor: "#408e43",
          }}}
        startIcon={<AddIcon sx={{color:'white'}}/>}
        endIcon={<ArrowDropDownIcon sx={{color:'white'}}/>}
        >
        Adicionar
        </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={{width:'200px'}}
      >
        <MenuItem sx={{width:'190px',fontSize:'16px'}} onClick={handleClose}><NorthEastIcon sx={{color:'red', mr:2}}/>Despesa</MenuItem>
        <MenuItem sx={{width:'190px',fontSize:'16px'}} onClick={handleClose}><SouthWestIcon sx={{color:'green', mr:2}}/>Receita</MenuItem>
      </Menu>

        </div>
      {/* Outros componentes, como filtros e totalizadores */}
    <Paper sx={{minHeight:'79vh'}}>
        <Box sx={{display: 'block',paddingTop: '16px!important'}}>
          <div style={{placeContent: 'center',alignItems: 'center', flexFlow: 'wrap',boxSizing: 'border-box',display: 'flex'}}>
            <div style={{flexDirection: 'column',boxSizing: 'border-box',display: 'flex',marginRight: '8px',minWidth: '180px',marginBottom: '5px'}}>
                <div style={{flexdirection: 'row',boxSizing: 'border-box',display: 'flex', placeContent: 'center flex-start',alignitems: 'center'}}>
                    <Typography sx={{marginRight:'8px',  font: '400 12px/20px Roboto,Helvetica Neue,sans-serif',letterSpacing: 'normal',color:'#a9a9a9'}}>Receitas</Typography>
                    <SouthWestIcon sx={{color:'#5fa65d',height: '18px', width: '18px'}}/>
                </div>
                <div style={{flexdirection: 'row',boxSizing: 'border-box',display: 'flex', placeContent: 'center flex-start',alignitems: 'center'}}>
                    <Typography sx={{marginRight: '8px', flex: '1 1 0%', boxSizing: 'border-box', color:'#5fa65d'}}>R$ 0,00</Typography>
                    <Typography sx={{ color: '#a9a9a9',font: '400 12px/20px Roboto,Helvetica Neue,sans-serif', letterSpacing: 'normal'}}> A receber: R$ 0,00 </Typography>
                </div>
                <div style={{flexDirection: 'column',boxSizing: 'border-box',display: 'flex',placeContent: 'flex-end',alignItems: 'flex-end'}}>
                    <LinearProgress variant="determinate" color='success' value={0} sx={{display: 'block',height: '4px',overflow: 'hidden',position: 'relative',transition: 'opacity 250ms linear',width: '100%'}}/>
                    <Typography sx={{    font: '400 12px/20px Roboto,Helvetica Neue,sans-serif',letterSpacing: 'normal', color:'#a9a9a9'}}>Total Previsto R$ 0,00</Typography>
                </div>
            </div>
            <div style={{marginRight:'8px'}}>
                <RemoveIcon/>
            </div>
            <div style={{flexDirection: 'column',boxSizing: 'border-box',display: 'flex',marginRight: '8px',minWidth: '180px',marginBottom: '5px'}}>
                <div style={{flexdirection: 'row',boxSizing: 'border-box',display: 'flex', placeContent: 'center flex-start',alignitems: 'center'}}>
                    <Typography sx={{marginRight:'8px',  font: '400 12px/20px Roboto,Helvetica Neue,sans-serif',letterSpacing: 'normal',color:'#a9a9a9'}}>Despesas</Typography>
                    <NorthEastIcon sx={{color:'#d0021b',height: '18px', width: '18px'}}/>
                </div>
                <div style={{flexdirection: 'row',boxSizing: 'border-box',display: 'flex', placeContent: 'center flex-start',alignitems: 'center'}}>
                    <Typography sx={{marginRight: '8px', flex: '1 1 0%', boxSizing: 'border-box', color:'#d0021b'}}>R$ 0,00</Typography>
                    <Typography sx={{ color: '#a9a9a9',font: '400 12px/20px Roboto,Helvetica Neue,sans-serif', letterSpacing: 'normal'}}> A pagar: R$ 0,00 </Typography>
                </div>
                <div style={{flexDirection: 'column',boxSizing: 'border-box',display: 'flex',placeContent: 'flex-end',alignItems: 'flex-end'}}>
                    <LinearProgress variant="determinate" color='error' value={0} sx={{display: 'block',height: '4px',overflow: 'hidden',position: 'relative',transition: 'opacity 250ms linear',width: '100%'}}/>
                    <Typography sx={{    font: '400 12px/20px Roboto,Helvetica Neue,sans-serif',letterSpacing: 'normal', color:'#a9a9a9'}}>Total Previsto R$ 0,00</Typography>
                </div>
            </div>
            <div style={{marginRight:'8px'}}>
                <DragHandleIcon/>
            </div>
            <div style={{flexDirection: 'column',boxSizing: 'border-box',display: 'flex',minWidth: '180px',marginBottom: '5px'}}>
                <div style={{flexdirection: 'row',boxSizing: 'border-box',display: 'flex', placeContent: 'center flex-start',alignitems: 'center'}}>
                    <Typography sx={{marginRight:'8px',  font: '400 12px/20px Roboto,Helvetica Neue,sans-serif',letterSpacing: 'normal',color:'#a9a9a9'}}>Saldo</Typography>
                </div>
                <div style={{flexdirection: 'row',boxSizing: 'border-box',display: 'flex', placeContent: 'center flex-start',alignitems: 'center'}}>
                    <Typography sx={{marginRight: '8px', flex: '1 1 0%', boxSizing: 'border-box', color:'#4f89ae'}}>R$ 0,00</Typography>
                    
                </div>
                <div style={{flexDirection: 'column',boxSizing: 'border-box',display: 'flex',placeContent: 'flex-end',alignItems: 'flex-end'}}>
                    <LinearProgress variant="determinate" color='primary' value={0} sx={{display: 'block',height: '4px',overflow: 'hidden',position: 'relative',transition: 'opacity 250ms linear',width: '100%'}}/>
                    <Typography sx={{    font: '400 12px/20px Roboto,Helvetica Neue,sans-serif',letterSpacing: 'normal', color:'#a9a9a9'}}>Total Previsto R$ 0,00</Typography>
                </div>
            </div>
          </div>
        </Box>
      <TableContainer >
        <Table aria-label="simple table">
          <TableHead sx={{marginRight:'5px',paddingLeft:'5px'}}>
            <TableRow >
              <TableCell ml={40} width={100} align="right"> Data</TableCell>
              <TableCell ml={40}>Nome</TableCell>
              <TableCell align="right">Valor</TableCell>
              <TableCell align="right"></TableCell> 

            </TableRow>
          </TableHead>
          <TableBody >
                <TableCell>
                    <Box>
                        <Typography></Typography>
                    </Box>
                </TableCell>
                <TableCell>
                    <Box sx={{display:'flex', justifyContent:'center', alignItems:'center',flexDirection:'column',marginLeft:'50px',paddingLeft:'50px',marginBottom:'110px',marginTop:'50px'}}>
                        <LocalAtmIcon sx={{width:'170px',height:'170px',color:'#d2d2d2'}}/>
                        <Typography sx={{fontSize:'21px'}}>Sem resultados para o período</Typography>
                        <Typography sx={{fontSize:'16px'}}>Tente alterar os filtros</Typography>
                    </Box>
                </TableCell>
                <TableCell>
                    <Box>
                        <Typography></Typography>
                    </Box>
                </TableCell>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
    </div>
  );
};

export default FinancePage;
