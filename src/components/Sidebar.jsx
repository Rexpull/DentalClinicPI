import React, { useState, useEffect } from "react";
import "../App.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faGear,faCalendar} from '@fortawesome/free-solid-svg-icons';
import {
  FaBars,
  FaCommentAlt,
  FaRegChartBar,
  FaShoppingBag,
  FaTh,
  FaThList,
  FaUserAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import {
  Button,
  Modal,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";
import Typography from "@mui/material/Typography";

const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("Fernando");
  const [userNome, setUserNome] = useState("Fernando");
  const [userPhoneNumber, setUserPhoneNumber] = useState("");
  const [userProfileUrl] = useState(
    "https://media.licdn.com/dms/image/C4D03AQE6zvgxoHCVOg/profile-displayphoto-shrink_800_800/0/1565044455036?e=2147483647&v=beta&t=EAGSrP_uElB4FwM2CaN8xs2RgSxtclowjL6QY4G84Fo"
  );
  const [perfilModalOpen, setPerfilModalOpen] = useState(false);
  const [isPhoneNumberFocused, setIsPhoneNumberFocused] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  const setDarkMode = () => {
    document.querySelector("body").setAttribute("data-theme", "dark");
    localStorage.setItem("selectedTheme", "dark");
  };

  const setLightMode = () => {
    document.querySelector("body").setAttribute("data-theme", "light");
    localStorage.setItem("selectedTheme", "light");
  };

  const selectedTheme = localStorage.getItem("selectedTheme");

  if (selectedTheme === "dark") {
    setDarkMode();
  }

  const toggleTheme = (e) => {
    if (e.target.checked) setDarkMode();
    else setLightMode();
  };

  const menuItem = [
    {
      path: "/app/dashboard",
      name: "Dashboard",
      icon: <FaTh />,
    },
    {
        path: "/app/agenda",
        name: "Agenda",
        icon: <FontAwesomeIcon icon={faCalendar} />,
      },
  
    {
      path: "/app/financeiro",
      name: "Financeiro",
      icon: <FaRegChartBar />,
    },
    {
        path: "/app/paciente",
        name: "Paciente",
        icon: <FaUserAlt />,
      },
    {
      path: "/app/Ajustes",
      name: "Ajustes",
      icon: <FontAwesomeIcon icon={faGear} />,
    },
   
  ];

  const handlePerfilModalOpen = () => {
    setPerfilModalOpen(true);
  };

  const handlePerfilModalClose = () => {
    setPerfilModalOpen(false);
  };

  const handlePerfilModalSave = () => {
    setUserName(userNome);
    // Adicione lógica para salvar o CPF, se necessário
    handlePerfilModalClose();
  };

  useEffect(() => {
    const formatPhoneNumber = (inputNumber) => {
      let formattedNumber = inputNumber.replace(/\D/g, "");

      // Adiciona parênteses, hífen e limita para 11 dígitos
      if (isPhoneNumberFocused) {
        if (formattedNumber.length <= 2) {
          formattedNumber = `(${formattedNumber}`;
        } else if (formattedNumber.length <= 7) {
          formattedNumber = `(${formattedNumber.slice(
            0,
            2
          )}) ${formattedNumber.slice(2)}`;
        } else {
          formattedNumber = `(${formattedNumber.slice(
            0,
            2
          )}) ${formattedNumber.slice(2, 7)}-${formattedNumber.slice(7)}`;
        }
      }

      // Limita para 14 dígitos (11 caracteres formatados)
      formattedNumber = formattedNumber.slice(0, 15);

      return formattedNumber;
    };

    setUserPhoneNumber(formatPhoneNumber(userPhoneNumber));
  }, [userPhoneNumber, isPhoneNumberFocused]);

  return (
    <div className="container">
      <div style={{ width: isOpen ? "300px" : "50px" }} className="sidebar">
        <div className="top_section">
          <div
            className="dark_mode"
            style={{ display: isOpen ? "block" : "none" }}
          >
            <input
              className="dark_mode_input"
              type="checkbox"
              id="darkmode-toggle"
              onChange={toggleTheme}
              defaultChecked={selectedTheme === "dark"}
            />
            <label
              className="dark_mode_label"
              htmlFor="darkmode-toggle"
            ></label>
          </div>
          <div
            style={{ marginLeft: isOpen ? "135px" : "0px" }}
            className="bars"
          >
            <FaBars onClick={toggle} />
          </div>
        </div>
        {menuItem.map((item, index) => (
          <NavLink
            to={item.path}
            key={index}
            className="link"
            activeClassName="active"
            style={{ alignItems: "center" }}
          >
            <div className="icon">{item.icon}</div>
            <div
              style={{ display: isOpen ? "block" : "none" }}
              className="link_text"
            >
              {item.name}
            </div>
          </NavLink>
        ))}
        <div className={`user-profile ${isOpen ? "open" : "closed"}`}>
          <img
            src={userProfileUrl}
            alt="User Profile"
            className="profile-image"
          />
          <p className="user-name">{userName}</p>
          <p style={{ fontSize: "17px" }}>Dentista</p>
          <div>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: "#dadada",
                  color: "black",
                  maxWidth: "200px",
                }}
                onClick={handlePerfilModalOpen}
              >
                Minha Conta
              </Button>
            </div>

            
            <Modal
              open={perfilModalOpen}
              onClose={handlePerfilModalClose}
              aria-labelledby="modal-title"
              aria-describedby="modal-description"
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 800,
                  height: 720,
                  borderRadius: 1,
                  bgcolor: "background.paper",
                  boxShadow: 24,
                  p: 2,
                  
                }}
              >
                <div style={{ display: "flex", alignItems: "center",marginTop:'5px' }}>
                  <div style={{ marginRight: "20px" }}>
                    <img
                      src={userProfileUrl}
                      alt="User Profile"
                      className="profile-image"
                      style={{
                        width: "110px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        marginBottom: "60px",
                        width: "100%",
                      }}
                    >
                      <TextField
                        label="Nome *"
                        fullWidth
                        size="small"
                        style={{ width: "100%", marginRight: "6px" }}
                        value={userNome}
                        onChange={(e) => setUserNome(e.target.value)}
                      />
                      <FormControl
                        fullWidth
                        size="small"
                        style={{ width: "40%" }}
                      >
                        <InputLabel id="sexo-label">Sexo</InputLabel>
                        <Select labelId="sexo-label" id="sexo" label="Sexo">
                          <MenuItem value="masculino">Masculino</MenuItem>
                          <MenuItem value="feminino">Feminino</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        marginBottom: "10px",
                        width: "100%",
                        marginTop: "-35px",
                      }}
                    >
                      <TextField
                        label="CPF"
                        fullWidth
                        size="small"
                        style={{ width: "40%", marginRight: "6px" }}
                      />
                      <TextField
                        label="CRO"
                        fullWidth
                        size="small"
                        style={{ width: "40%", marginRight: "6px" }}
                      />
                    </div>
                  </div>
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <Typography
                    variant="h6"
                    component="div"
                    style={{
                      marginTop: "10px",
                      marginBottom: "10px",
                      font: "700 19px/28px Roboto,Helvetica Neue,sans-serif",
                    }}
                  >
                    Contato
                  </Typography>
                  <div
                    style={{
                      display: "flex",
                      marginBottom: "20px",
                      width: "100%",
                    }}
                  >
                    <TextField
                      label="E-mail *"
                      fullWidth
                      size="small"
                      style={{
                        width: "100%",
                        marginRight: "6px",
                        marginBottom: "8px",
                      }}
                    />
                    
                    <TextField
                      label="Celular"
                      fullWidth
                      size="small"
                      style={{ width: "40%", marginBottom: "8px" }}
                      value={userPhoneNumber}
                      onChange={(e) => setUserPhoneNumber(e.target.value)}
                      onFocus={() => setIsPhoneNumberFocused(true)}
                      onBlur={() => setIsPhoneNumberFocused(false)}
                    />
                  </div>
                  <div style={{display:'flex',alignItems:'center',marginBottom:'15px'}}>

                  <Typography
                    variant="h6"
                    component="div"
                    style={{ 
                        
                      font: "700 19px/28px Roboto,Helvetica Neue,sans-serif",
                    }}
                  >Senha:
                  </Typography>
                  
                    <Button
                      color="primary"
                      variant="text"
                      size="small"
                      style={{
                        color: "0404e2",
                        fontWeight:'600',
                        marginLeft: "10px",
                      }}
                    >
                      Alterar Senha
                    </Button>
                  </div>
                  

                  <Typography
                    variant="h6"
                    component="div"
                    style={{
                   
                      font: "700 19px/28px Roboto,Helvetica Neue,sans-serif",
                    }}
                  >Endereço
                  </Typography>
                  <div
                    style={{
                      display: "flex",
                      marginBottom: "5px",
                      width: "100%",
                    }}
                  >
                    <TextField
                      label="CEP"
                      fullWidth
                      size="small"
                      style={{
                        width: "30%",
                        marginRight: "6px",
                        marginBottom: "12px",
                        marginTop: "18px",
                      }}
                    />
                    <TextField
                      label="Rua"
                      fullWidth
                      size="small"
                      style={{
                        width: "40%",
                        marginRight: "6px",
                        marginBottom: "12px",
                        marginTop: "18px",
                      }}
                    />
                    <TextField
                      label="Número"
                      fullWidth
                      size="small"
                      style={{
                        width: "10%",
                        marginRight: "6px",
                        marginBottom: "12px",
                        marginTop: "18px",
                      }}
                    />
                    <TextField
                      label="Complemento"
                      fullWidth
                      size="small"
                      style={{
                        width: "20%",
                        marginBottom: "12px",
                        marginTop: "18px",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      marginBottom: "20px",
                      width: "100%",
                    }}
                  >
                    <TextField
                      label="Bairro"
                      fullWidth
                      size="small"
                      style={{
                        width: "30%",
                        marginRight: "6px",
                        marginBottom: "4px",
                        marginTop: "18px",
                      }}
                    />
                    <TextField
                      label="Cidade"
                      fullWidth
                      size="small"
                      style={{
                        width: "40%",
                        marginRight: "6px",
                        marginTop: "18px",
                      }}
                    />
                    <FormControl
                      fullWidth
                      size="small"
                      style={{ width: "30%", marginTop: "18px" }}
                    >
                      <InputLabel id="estado-label">Estado</InputLabel>
                      <Select labelId="estado-label" id="estado" label="Estado">
                        <MenuItem value="AC">Acre (AC)</MenuItem>
                        <MenuItem value="AL">Alagoas (AL)</MenuItem>
                        <MenuItem value="AP">Amapá (AP)</MenuItem>
                        <MenuItem value="AM">Amazonas (AM)</MenuItem>
                        <MenuItem value="BA">Bahia (BA)</MenuItem>
                        <MenuItem value="CE">Ceará (CE)</MenuItem>
                        <MenuItem value="DF">Distrito Federal (DF)</MenuItem>
                        <MenuItem value="ES">Espírito Santo (ES)</MenuItem>
                        <MenuItem value="GO">Goiás (GO)</MenuItem>
                        <MenuItem value="MA">Maranhão (MA)</MenuItem>
                        <MenuItem value="MT">Mato Grosso (MT)</MenuItem>
                        <MenuItem value="MS">Mato Grosso do Sul (MS)</MenuItem>
                        <MenuItem value="MG">Minas Gerais (MG)</MenuItem>
                        <MenuItem value="PA">Pará (PA)</MenuItem>
                        <MenuItem value="PB">Paraíba (PB)</MenuItem>
                        <MenuItem value="PR">Paraná (PR)</MenuItem>
                        <MenuItem value="PE">Pernambuco (PE)</MenuItem>
                        <MenuItem value="PI">Piauí (PI)</MenuItem>
                        <MenuItem value="RJ">Rio de Janeiro (RJ)</MenuItem>
                        <MenuItem value="RN">Rio Grande do Norte (RN)</MenuItem>
                        <MenuItem value="RS">Rio Grande do Sul (RS)</MenuItem>
                        <MenuItem value="RO">Rondônia (RO)</MenuItem>
                        <MenuItem value="RR">Roraima (RR)</MenuItem>
                        <MenuItem value="SC">Santa Catarina (SC)</MenuItem>
                        <MenuItem value="SP">São Paulo (SP)</MenuItem>
                        <MenuItem value="SE">Sergipe (SE)</MenuItem>
                        <MenuItem value="TO">Tocantins (TO)</MenuItem>
                      </Select>
                    </FormControl>
                  </div>

                  <Typography
                    variant="h6"
                    component="div"
                    style={{
                      marginTop: "10px",
                      marginBottom: "10px",
                      font: "700 19px/28px Roboto,Helvetica Neue,sans-serif",
                    }}
                  >Dados 
                  </Typography>
                  <p style={{color:'#0000008', fontSize:'16px'}}> Clínica</p>
                  <p
                    style={{
                      marginBottom: "20px",
                      marginTop: "-24px",
                      textAlign: "right",
                      marginRight: "200px",
                      fontSize:'16px'
                    }}
                  >
                    Perfil
                  </p>
                  <hr
                    style={{
                      margin: "10px 0",
                      border: "0",
                      borderTop: "1px solid #ccc",
                    }}
                  />
                  <p style={{ color: "black", fontSize:'16px' }}>
                    DentalClinic
                  </p>
                  <p
                    style={{
                      marginBottom: "12px",
                      marginTop: "-24px",
                      textAlign: "right",
                      marginRight: "175px",
                     fontSize:'16px',
                     color: "black",
                    }}
                  >
                    Dentista
                  </p>
                  <hr
                    style={{
                      margin: "1px ",
                      border: "0",
                      borderTop: "1px solid #ccc",
                    }}
                  />
                </div>
                <div
                  style={{
                    marginTop: "6px",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    variant="contained"
                    sx={{backgroundColor:'#50ae54'}}
                    onClick={handlePerfilModalSave}
                    size="small"
                  >
                    Salvar
                  </Button>
                </div>
              </Box>
            </Modal>

            <div
              style={{
                width: "275px",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button
                variant="text"
                className="logout-button"
                sx={{ display: "flex", justifyContent: "flex-end", gap: "5px" }}
              >
                Logout
                <FaSignOutAlt className="logout-icon" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <main>{children}</main>
    </div>
  );
};

export default Sidebar;
