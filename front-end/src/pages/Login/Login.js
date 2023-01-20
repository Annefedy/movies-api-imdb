import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Login.css";

export default function Login({ setIsAuthenticated }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();

  function login() {
    fetch("http://localhost:7070/api/users/login", {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((res) => {
        if (res.ok) {
          setIsAuthenticated(true);
          history.push("/");
        } else {
          throw res;
        }
      })
      .catch((error) => {
        error.json().then((body) => {
          setError(body.response);
        });
      });
  }

  return (
    <div className="Login">
      <div className="loginSection">
        <h1>Iniciar sessão</h1>
        <div className="container">
          <form className="LoginForm">
            <input
              type="text"
              name="username"
              placeholder="nome do usuário"
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              name="password"
              placeholder="Palavra-passe"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" onClick={login}>
            Iniciar
            </button>
          </form>
          <div className="forgot">
            <p>
            Não sabes a tua palavra-passe? Recuperar
              <Link to="/forgotpassword">
                {" "}
                <span>aqui</span>
              </Link>
            </p>
          </div>
        </div>
        {error ? <p className="error">{error}</p> : ""}
      </div>
    </div>
  );
}
