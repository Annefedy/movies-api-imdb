import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login.js";
import Navbar from "./components/Navbar/Navbar";
import Signup from "./pages/Signup/Signup";
import Home from "./pages/Home/Home";
import Watchlist from "./pages/Watchlist/Watchlist";
import Profile from "./pages/Profile/Profile";
import MovieItem from "./pages/MovieItem/MovieItem";
import Logout from "./components/Logout/Logout";
import SearchResult from "./pages/SearchResult/SearchResult";
import SendResetEmail from "./pages/SendResetEmail/SendResetEmail";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import keys from "../src/config/keys";
import "./App.css";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  async function handleAuthentication() {
    await fetch("http://localhost:7070/api/users/isloggedin", {
      credentials: "include",
      headers: { 
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.ok) {
        setIsAuthenticated(true);
      }
    });
  }

  useEffect(() => {
    handleAuthentication();
  }, [isAuthenticated]);
  
  const CustomWrapper = ({ isAuthenticated, render: Component, ...props}) =>{
    isAuthenticated ? (
      <Component {...props} />
    ) : (
      <Navigate
      to="/login"
      replace

      //state={{ location }}
    />
    )
  }

  const PrivateRoute = ({ render: Component, ...rest }) => {
    <Route  path = "*"
    element={<CustomWrapper isAuthenticated={isAuthenticated}/> }
    />
  }
  return (
    <Router>
      <div className="App">
        <header>
          <Navbar isAuthenticated={isAuthenticated} />
        </header>
        <main>
          <Routes>
            <Route exact element={<PrivateRoute/>} path="/" render={() => <Home keys={keys} />} />
        
            <Route
              path="/profile"
              element={<PrivateRoute/>}
              render={() => (
                <Profile keys={keys} setIsAuthenticated={setIsAuthenticated} />
              )}
            />
            <Route
              path="/watchlist"
              render={() => <Watchlist keys={keys} />}
            />
            <Route
              path="/movie/:id"
              render={(props) => (
                <MovieItem
                  {...props}
                  keys={keys}
                  isAuthenticated={isAuthenticated}
                />
              )}
            />
            <Route
              path="/search/:query"
              render={(props) => <SearchResult {...props} keys={keys} />}
            />
            <Route
              path="/login"
              render={() => <Login setIsAuthenticated={setIsAuthenticated} />}
            />
            
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgotpassword" element={<SendResetEmail/>} />
            <Route path="/passwordreset/:id/:link" element={<ResetPassword/>} />
            <Route
              path="/logout"
              render={() => <Logout setIsAuthenticated={setIsAuthenticated} />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
