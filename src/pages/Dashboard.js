import React, { useState,useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { IconName, MdAttachMoney } from "react-icons/md";
import { faClipboardList, faUserPlus, faDollarSign } from '@fortawesome/free-solid-svg-icons';

import { Cell, PieChart, Pie, ComposedChart, Bar, BarChart, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCaretDown, faCaretUp ,faChartLine, faFolderOpen, faThumbsUp, faCalendarDays} from '@fortawesome/free-solid-svg-icons';


import '../style/css/dashboard.css';

const Dashboard = () => {
  const [totalPatients, setTotalPatients] = useState(0); 


 


  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];



  const data1 = [
    {
      dia: 'Dom',
      valor: 20,
    },
    {
      dia: 'Seg',
      valor: 1,
    },
    {
      dia: 'Ter',
      valor: 1,
    },
    {
      dia: 'Qua',
      valor: 1,
    },
    {
      dia: 'Qui',
      valor: 1,
    },
    {
      dia: 'Sex',
      valor: 1,
    },
    {
      dia: 'Sab',
      valor: 1,
    },
  ];

  const data2 = [
    {
      dia: 'Dom',
      valor: 20,
    },
    {
      dia: 'Seg',
      valor: 1,
    },
    {
      dia: 'Ter',
      valor: 14,
    },
    {
      dia: 'Qua',
      valor: 10,
    },
    {
      dia: 'Qui',
      valor: 1,
    },
    {
      dia: 'Sex',
      valor: 2,
    },
    {
      dia: 'Sab',
      valor: 1,
    },
  ];

 const data3 = [
    {
      name: 'Jan',
      CP: 19,
      CR: 13,
    },
    {
      name: 'Fev',
      CP: 18,
      CR: 16,
    },
    {
      name: 'Mar',
      CP: 6,
      CR: 2,
    },
    {
      name: 'Abr',
      CP: 10,
      CR: 8,
    },
    {
      name: 'Maio',
      CP: 23,
      CR: 23,
    },
    {
      name: 'Jun',
      CP: 21,
      CR: 1,
    },
    {
      name: 'Jul',
      CP: 7,
      CR: 23,
    },
    {
      name: 'Ago',
      CP: 5,
      CR: 13,
    },
    {
      name: 'Set',
      CP: 5,
      CR: 12,
    },
    {
      name: 'Out',
      CP: 3,
      CR: 22,
    },
    {
      name: 'Nov',
      CP: 20,
      CR: 2,
    },
    {
      name: 'Dez',
      CP: 20,
      CR: 10,
    },
  ];


  const data4 = [
    {
      name: 'Janeiro',
      Despesa: 19,
      Receita: 13,
    },
    {
      name: 'Feverei',
      Despesa: 18,
      Receita: 16,
    },
    {
      name: 'Março',
      Despesa: 6,
      Receita: 2,
    },
    {
      name: 'Abril',
      Despesa: 10,
      Receita: 8,
    },
    {
      name: 'Maio',
      Despesa: 23,
      Receita: 23,
    },
    {
      name: 'Junho',
      Despesa: 21,
      Receita: 1,
    },
    {
      name: 'Julho',
      Despesa: 7,
      Receita: 23,
    },
    {
      name: 'Agosto',
      Despesa: 5,
      Receita: 13,
    },
    {
      name: 'Setemb',
      Despesa: 5,
      Receita: 12,
    },
    {
      name: 'Outubro',
      Despesa: 3,
      Receita: 22,
    },
    {
      name: 'Novemb',
      Despesa: 20,
      Receita: 2,
    },
    {
      name: 'Dezemb',
      Despesa: 20,
      Receita: 10,
    },
  ];


 
  useEffect(() => {
    // Fazer a chamada à API para obter a quantidade de pacientes
    fetch('https://clinicapi-api.azurewebsites.net/Paciente/ListarPacientes')
      .then((response) => response.json())
      .then((data) => {
        console.log(data.retorno.length); // Acesse a propriedade "retorno"
        setTotalPatients(data.retorno.length); // Acesse a propriedade "retorno"
      })
      .catch((error) => {
        console.error('Erro ao obter a quantidade de pacientes:', error);
      });
  }, []);


 
  
   
  // Calcula a soma de todos os valores em data1
  const totalPayments = data1.reduce((total, item) => total + item.valor, 0);
  const totalReceives = data2.reduce((total, item) => total + item.valor, 0);


  


  

  return (

    <Box >
      <div className='header'>
        <div className='Infos'>
          <div className='infoAtraso'>
            <FontAwesomeIcon icon={faDollarSign} className='iconsTop' style={{ color: '#bc201b', marginRight: '3px' }} />
            <div className='subInfo'>
              <div style={{ display: 'flex', gap: '35px', alignItems: 'center' }}>
                <h3 className='valorAtraso'>R$ 0,00</h3>
                <a href='http://localhost:3000/app/financeiro' style={{ color: '#1976d2', fontWeight: '600' }}>VER</a>
              </div>
              <p className='debitos'>Débitos em Atraso</p>
            </div>
          </div>
        </div>
        <div className='Infos'>
          <div className='infoAtraso'>
            <FontAwesomeIcon icon={faClipboardList} className='iconsTop' style={{ color: 'rgb(255, 190, 0)', marginRight: '9px' }} />
            <div className='subInfo'>
              <div style={{ display: 'flex', gap: '35px', alignItems: 'center' }}>
                <h3 className='valorOrcamento'>R$ 0,00</h3>
                <a link='#' style={{ color: '#1976d2', fontWeight: '600' }}>VER</a>
              </div>
              <p className='debitos'>Tratamentos em Aberto</p>
            </div>
          </div>
        </div>
        <div className='Infos'>
          <div className='infoAtraso'>
            <FontAwesomeIcon icon={faUserPlus} className='iconsTop' style={{ color: 'green', marginRight: '9px' }} />

            <div className='subInfo'>
              <div style={{ display: 'flex', gap: '35px', alignItems: 'center' }}>
                <h3 className='valorPaciente'>{totalPatients}</h3>
                <a href='http://localhost:3000/app/paciente' style={{ color: '#1976d2', fontWeight: '600' }}>VER</a>
              </div>
              <p className='debitos'>Pacientes cadastrados</p>
            </div>
          </div>
        </div>
      </div>
 

     
      <Box className='mainHomeRightbar'>
      <div>
        <div className='ItemContainer'>
          <div className='ItemContainer1'>
            <div className='subitemContainer'>

              <div className='subitemContainer-up'>
                <p className='taskProgress'>Custos </p>
                <span className='box-pagar-semanal'>Semanal</span> 
              </div>
              <div className='subitemContainer-down'>
                <div className='subitemContainer-down-child'>
                  <p className='taskCounter'><FontAwesomeIcon style={{color:'red'}} icon={faCaretDown} /> R${totalPayments.toFixed(2)} </p>
                  <p className='currentmonth1'>Custos desta semana</p>
                </div>
                <div className='barchartContainer'>
                <BarChart width={265} height={130} data={data1} 
                  margin={{ right: 3, bottom: -14, top: 6 }}>
                    <Tooltip label={({ payload }) => payload[0]?.payload.dia} />
                    <Bar dataKey="valor" fill="orange" />
                    <XAxis dataKey="dia" height={14} />
                  </BarChart>
                </div>
              </div>
            </div>
          </div>
          <div className='ItemContainer1'>
            <div className='subitemContainer'>
              <div className='subitemContainer-up'>
                <p className='taskProgress'>Recebimentos <small>(em aberto)</small></p>
                <span className='box-pagar-semanal'>Semanal</span>
              </div>
              <div className='subitemContainer-down'>
                <div className='subitemContainer-down-child'>
                  <p className='taskCounter'><FontAwesomeIcon style={{color:'green'}} icon={faCaretUp} /> R${totalReceives.toFixed(2)}</p>
                  <p className='currentmonth1'>Recebimentos desta semana</p>
                </div>
                <div className='barchartContainer'>
                  <BarChart width={265} height={130} data={data2} 
                  margin={{ right: 3, bottom: -14, top: 6 }}>
                    <Tooltip label={({ payload }) => payload[0]?.payload.dia} />
                    <Bar dataKey="valor" fill="#82ca9d" />
                    <XAxis dataKey="dia" height={14} />
                  </BarChart>
                </div>
              </div>
            </div>
          </div>
          <div className='ItemContainer1'>
            <div className='subitemContainer'>
              <div className='subitemContainer-up'>
                <p className='taskProgress'>Liquidados <small>(já recebidos ou pagos)</small></p>
                <span className='box-pagar-mensal'>Mensal</span>
              </div>
              <div className='subitemContainer-down'>
                <div className='barchartContainer2'>
                  <LineChart width={435} height={130} data={data3}
                    margin={{ top: 5, right:20, left:20, bottom: 4 }}>
                    <Tooltip />
                    <Line type="monotone" dataKey="CP" stroke="orange" />
                    <Line type="monotone" dataKey="CR" stroke="#82ca9d" />
                    <XAxis dataKey="name" />
                  </LineChart>
                </div>
              </div>
            </div>
          </div>



          <div className='MiddleTaskChart'>
            <div className='subitemContainer-up'>
                <p className='taskProgress'>Registro anual <small>(Receitas x Despesas)</small></p>
                <span className='box-pagar-anual'>Anual</span>
              </div>
              <div className='chartDirection'>
                <ComposedChart width={1350 } height={190} data={data4} margin={{ top: 10, right: 5, left: 5, bottom: 10 }}>
                
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <CartesianGrid stroke="#f5f5f5" />
                  
                  <Bar dataKey="Receita" barSize={20} fill="#82ca9d" />
                  <Line type="monotone" dataKey="Despesa" stroke="orange" />
                </ComposedChart>
              </div>
          </div>


      
        </div>
      </div>
    </Box>
    </Box>
  );
};

export default Dashboard;
