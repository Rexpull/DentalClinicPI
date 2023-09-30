import React, { useState, useEffect } from 'react';
import Logo from "../style/img/Logo.png";
import financas from "../style/img/finance.png";
import Dente1 from "../style/img/Dentao.png";
import Dente2 from "../style/img/Dente.png";
import Dente3 from "../style/img/Dentinho.png";
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
      if (email === "quintalbar@gmail.com" && password === "quintal1234") {
        window.location.href = "/app/Inicio";
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
      <div className="area">
        
        <ul className="circles">
          <li className="dente dente1"><img src={Dente1} alt="Dente 1" /></li>
          <li className="dente dente2"><img src={Dente2} alt="Dente 2" /></li>
          <li className="dente dente3"><img src={Dente3} alt="Dente 3" /></li>
          <li className="dente dente1"><img src={Dente1} alt="Dente 1" /></li>
          <li className="dente dente2"><img src={Dente2} alt="Dente 2" /></li>
          <li className="dente dente3"><img src={Dente3} alt="Dente 3" /></li>
          <li className="dente dente1"><img src={Dente1} alt="Dente 1" /></li>
          <li className="dente dente2"><img src={Dente2} alt="Dente 2" /></li>
          <li className="dente dente3"><img src={Dente3} alt="Dente 3" /></li>
        </ul>
      </div>
      <div className="container-login">
        <div className="subContainer">
           <img className="logoStonks" src={Logo} alt="LOGO stonks" /> 
          <img className="imageFinanca" src={financas} alt="LOGO stonks" />
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
