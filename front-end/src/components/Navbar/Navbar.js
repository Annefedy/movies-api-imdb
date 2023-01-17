import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ isAuthenticated }) {
  return (
    <div className={isAuthenticated ? "Navbar auth" : "Navbar"}>
      <nav>
        <ul>
          <li>
            <h3>Movies IMDB</h3>
          </li>
          <li>
            <NavLink exact to="/" className="selected">
              Home
            </NavLink>
          </li>

          {isAuthenticated ? (
            <>
              <li>
                <NavLink to="/profile" className="selected">
                  Profile
                </NavLink>
              </li>
              <li>
                <NavLink to="/watchlist" className="selected">
                  Watchlist
                </NavLink>
              </li>
              <li>
                <NavLink to="/logout" className="selected">
                  Log out
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/login" className="selected">
                  Log in
                </NavLink>
              </li>
              <li>
                <NavLink to="/signup" className="selected">
                  Sign up
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
}
