

import React, { useState, useEffect } from 'react';
import Logo from "../style/img/Clinic-removebg-preview.png";
import financas from "../style/img/finance.png";
import "../style/css/login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isEmptyFields, setIsEmptyFields] = useState(false);

  const validateFields = () => {
    if (email === "" || password === "") {
      setIsEmptyFields(true);
      return false;
    }
    return true;
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (validateFields()) {
      if (email === "dente@gmail.com" && password === "dente") {
        window.location.href = "/app/dashboard";
      } else {
        setError("Email ou senha incorretos.");
      }
    }
  };

  useEffect(() => {
    setIsEmptyFields(false);
  }, [email, password]);

  return (
    <div className="container2">
      <div class="stars" ></div>
      <div class="stars2" ></div>
      
      


      <div className="container-login">
        <div className="subContainer">
           <img className="logo" src={Logo} alt="LOGO" /> 
          <img className="imageFinanca" src={financas} alt="LOGO" />
        </div>
        <div className="wrap-login">
          <form className="login-form" onSubmit={handleLogin}>
            <span className="login-form-title">
              <h1 className="conectText">Conecte-se</h1>
              <p className="conectText-subtitle">
                Que bom te ver por aqui, seja bem-vindo!
              </p>
            </span>

            <div className="wrap-input">
              <input
                className={email !== "" ? "has-val input" : "input"}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <span className="focus-input" data-placeholder="Email"></span>
            </div>

            <div className="wrap-input">
              <input
                className={password !== "" ? "has-val input" : "input"}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="focus-input" data-placeholder="Senha"></span>
            </div>

            {isEmptyFields && (
              <div className="error">Por favor, preencha todos os campos.</div>
            )}
            {error && <div className="error">{error}</div>}

            <div className="button">
              <button type="submit" className="button1">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login; 

