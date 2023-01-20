import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ isAuthenticated }) {
  return (
    <div className={isAuthenticated ? "Navbar auth" : "Navbar"}>
      <nav>
        <ul>
          <li>
            <h3>Filmes IMDB</h3>
          </li>
          <li>
            <NavLink exact to="/" activeClassName="selected">
            pagina inicial
            </NavLink>
          </li>

          {isAuthenticated ? (
            <>
              <li>
                <NavLink to="/profile" activeClassName="selected">
                  Profil
                </NavLink>
              </li>
              <li>
                <NavLink to="/watchlist" activeClassName="selected">
                Lista de observação
                </NavLink>
              </li>
              <li>
                <NavLink to="/logout" activeClassName="selected">
                  Terminar sessão
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/login" activeClassName="selected">
                  Iniciar sessão
                </NavLink>
              </li>
              <li>
                <NavLink to="/signup" activeClassName="selected">
                  Criar nova conta
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
}
