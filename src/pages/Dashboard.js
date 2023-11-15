import React, { useState } from 'react';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { BarChart, Bar, ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Scatter, ResponsiveContainer, LineChart } from 'recharts';
import { IconName, MdAttachMoney } from "react-icons/md";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faClipboardList, faUserPlus,faDollarSign } from '@fortawesome/free-solid-svg-icons';
import {
  FaBars,
  FaCommentAlt,
  FaRegChartBar,
  FaShoppingBag,
  FaTh, FaThList, FaUserAlt
} from 'react-icons/fa';
import { BiSpreadsheet } from 'react-icons/bi';

import '../style/css/dashboard.css';

const Dashboard = () => {
  const data = [
    {
      name: 'Page A',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Page C',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: 'Page D',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: 'Page E',
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: 'Page F',
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: 'Page G',
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  const data2 = [
    { index: 10000, red: 1000, blue: 790 },
    { index: 1666, red: 182, blue: 42 },
    { index: 625, red: 56, blue: 11 },
    // Calculation of line of best fit is not included in this demo
    { index: 300, redLine: 0 },
    { index: 10000, redLine: 1522 },
    { index: 600, blueLine: 0 },
    { index: 10000, blueLine: 678 },
  ];

  const data3 = [
    {
      name: 'Page A',
      uv: 590,
      pv: 800,
      amt: 1400,
    },
    {
      name: 'Page B',
      uv: 868,
      pv: 967,
      amt: 1506,
    },
    {
      name: 'Page C',
      uv: 1397,
      pv: 1098,
      amt: 989,
    },
    {
      name: 'Page D',
      uv: 1480,
      pv: 1200,
      amt: 1228,
    },
    {
      name: 'Page E',
      uv: 1520,
      pv: 1108,
      amt: 1100,
    },
    {
      name: 'Page F',
      uv: 1400,
      pv: 680,
      amt: 1700,
    },
    {
      name: 'Page G',
      uv: 1400,
      pv: 680,
      amt: 1700,
    }, {
      name: 'Page H',
      uv: 1250,
      pv: 680,
      amt: 1700,
    }, {
      name: 'Page I',
      uv: 1400,
      pv: 680,
      amt: 1700,
    }, {
      name: 'Page J',
      uv: 1200,
      pv: 680,
      amt: 1700,
    }, {
      name: 'Page K',
      uv: 1800,
      pv: 880,
      amt: 1700,
    },
  ];


  const getIntroOfPage = (label) => {
    if (label === 'Page A') {
      return "Page A is about men's clothing";
    }
    if (label === 'Page B') {
      return "Page B is about women's dress";
    }
    if (label === 'Page C') {
      return "Page C is about women's bag";
    }
    if (label === 'Page D') {
      return 'Page D is about household goods';
    }
    if (label === 'Page E') {
      return 'Page E is about food';
    }
    if (label === 'Page F') {
      return 'Page F is about baby food';
    }
    return '';
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`${label} : ${payload[0].value}`}</p>
          <p className="intro">{getIntroOfPage(label)}</p>
          <p className="desc">Anything you want can be displayed here.</p>
        </div>
      );
    }

    return null;
  };

  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (

    <TabContext value={value}>
      <div className='header'>
        <div className='Infos'>
          <div className='infoAtraso'>
          <FontAwesomeIcon icon={faDollarSign} className='iconsTop' style={{color:'#bc201b' ,marginRight:'3px'}} />
            <div className='subInfo'>
            <div style={{display:'flex', gap:'35px',alignItems:'center'}}>
                <h3 className='valor'>R$0,00</h3>
                <a link='#' style={{color:'#1976d2', fontWeight:'600'}}>VER</a>
              </div>
              <p className='debitos'>Débitos em Atraso</p>
            </div>
          </div>
        </div>
        <div className='Infos'>
          <div className='infoAtraso'>
            <FontAwesomeIcon icon={faClipboardList}  className='iconsTop' style={{color: 'rgb(255, 190, 0)',marginRight:'9px'}}/>
            <div className='subInfo'>
              <div style={{display:'flex', gap:'35px',alignItems:'center'}}>
                <h3 className='valor'>R$0,00</h3>
                <a link='#' style={{color:'#1976d2', fontWeight:'600'}}>VER</a>
              </div>
              <p className='debitos'>Orçamentos em aberto e reprovados</p>
            </div>
          </div>
        </div>
        <div className='Infos'>
          <div className='infoAtraso'>
           <FontAwesomeIcon icon={faUserPlus} className='iconsTop' style={{color: 'green',marginRight:'9px'}} />
           
            <div className='subInfo'>
              <div style={{display:'flex', gap:'35px',alignItems:'center'}}>
                <h3 className='valor'>0,00</h3>
                <a href='http://localhost:3000/app/paciente' style={{color:'#1976d2', fontWeight:'600'}}>VER</a>
              </div>
              <p className='debitos'>Pacientes cadastrados</p>
            </div>
          </div>
        </div>
      </div>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <TabList onChange={handleChange} >
          <Tab label="Tarefas" value="1" />
          <Tab label="Performance" value="2" />
          <Tab label="Ortodontia" value="3" />
          
        </TabList>
      </Box>
      
      <TabPanel value="1">
       
      </TabPanel>

      <TabPanel value="2">Item Two</TabPanel>
      <TabPanel value="3"> 
      <div className='posGrafic'>
          <div className='container1'>
            <div className='grafico1'>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={data}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="pv" stroke="#ca5520" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="uv" stroke="#04900b" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className='container1'>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                width={500}
                height={400}
                data={data2}
                margin={{
                  top: 20,
                  right: 80,
                  bottom: 20,
                  left: 20,
                }}
              >
                <CartesianGrid stroke="#f5f5f5" />
                <Tooltip />
                <Legend />

                <XAxis dataKey="index" type="number" label={{ value: 'Index', position: 'insideBottomRight', offset: 0 }} />
                <YAxis unit="ms" type="number" label={{ value: 'Time', angle: -90, position: 'insideLeft' }} />
                <Scatter name="red" dataKey="red" fill="red" />
                <Scatter name="blue" dataKey="blue" fill="blue" />
                <Line dataKey="blueLine" stroke="blue" dot={false} activeDot={false} legendType="none" />
                <Line dataKey="redLine" stroke="red" dot={false} activeDot={false} legendType="none" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

        </div>
        <div className='posGrafic2'>
          <div className='container2'>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                width={500}
                height={400}
                data={data3}
                margin={{
                  top: 20,
                  right: 20,
                  bottom: 20,
                  left: 20,
                }}
              >
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis dataKey="name" scale="band" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="uv" barSize={20} fill="#413ea0" />
                <Line type="monotone" dataKey="uv" stroke="#ff7300" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

        </div></TabPanel>
    </TabContext>
  );
};

export default Dashboard;
