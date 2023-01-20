import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./Signup.css";

export default function Signup() {
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [error, setError] = useState("");
  const history = useHistory();

  function register() {
    fetch("http://localhost:7070/api/users/register", {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
        confirm_password: confirmPassword,
      }),
    })
      .then((res) => {
        if (res.ok) {
          history.push("/login");
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
    <div className="Signup">
      <div className="signupSection">
        <h1>Criar nova conta</h1>
        <div className="container">
          <form>
            <input
              type="text"
              name="username"
              placeholder="nome do usuário"
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="email"
              name="email"
              placeholder="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              name="password"
              placeholder="palavra-passe"
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="confirme sua palavra-passe"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button type="button" onClick={register}>
            Inscreva-se
            </button>
          </form>
        </div>
        {error ? <p className="error">{error}</p> : ""}
      </div>
    </div>
  );
}
