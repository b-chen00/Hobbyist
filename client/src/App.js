import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
//import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
//import Navbar from './components/Navbar';
// import { BrowserRouter as Router, Routes, Route}
//     from 'react-router-dom';
import All from './pages';
import Create from './pages/create';
import Register from './pages/register';
import Login from './pages/login';
import Profile from './pages/profile';


function App() {
    const [currentUser, setCurrentUser] = useState(undefined);

    const logOut = () => {
        //AuthService.logout();
    };

    return (
        <div>
          <nav className="navbar navbar-expand navbar-dark bg-dark">
            <Link to={"/"} className="navbar-brand">
              Link to /
            </Link>
            <div className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link to={"/home"} className="nav-link">
                  Home
                </Link>
              </li>

              {currentUser && (
                <li className="nav-item">
                  <Link to={"/user"} className="nav-link">
                    User
                  </Link>
                </li>
              )}
            </div>

            {currentUser ? (
              <div className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link to={"/profile"} className="nav-link">
                    {currentUser.username}
                  </Link>
                </li>
                <li className="nav-item">
                  <a href="/login" className="nav-link" onClick={logOut}>
                    LogOut
                  </a>
                </li>
              </div>
            ) : (
              <div className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link to={"/login"} className="nav-link">
                    Login
                  </Link>
                </li>

                <li className="nav-item">
                  <Link to={"/register"} className="nav-link">
                    Sign Up
                  </Link>
                </li>
              </div>
            )}
          </nav>

          <div className="container mt-3">
            <Routes>
              <Route path="/" element={<All/>} />
              <Route path="/all" element={<All/>} />
              <Route path="/login" element={<Login/>} />
              <Route path="/register" element={<Register/>} />
              <Route path="/profile" element={<Profile/>} />
            </Routes>
          </div>
        </div>
    );
}

export default App;
