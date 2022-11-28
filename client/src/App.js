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
import Post from './pages/post'
import {useAuth} from './AuthContext';

function App() {
    const [username, setUsername] = useState("");
    const {auth} = useAuth();

    useEffect(() => {
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser) {
            setUsername(loggedInUser);
        }
     }, []);

    const logOut = () => {
        setUsername("");
        useAuth.setAuth(false);
        localStorage.clear();
        fetch('http://ec2-18-222-31-37.us-east-2.compute.amazonaws.com:8080/api/logout', {
            method: "GET",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        })
    };


    return (
        <div style={{backgroundColor: 'white', height: '100%'}}>
          <nav className="navbar navbar-expand-lg navbar-dark" style={{backgroundColor: '#54577C'}}>
            <div class="mx-auto order-0">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item h4">
                <Link to={"/all"} className="nav-link">
                  All
                </Link>
              </li>
              {auth && (
                <li className="nav-item h4">
                  <Link to={"/create"} className="nav-link">
                    Create
                  </Link>
                </li>
              )}
              {auth && (
                <li className="nav-item h4">
                  <Link to={"/profile"} className="nav-link">
                    Profile
                  </Link>
                </li>
              )}
            </ul>
            </div>
            {auth ? (
              <div className="navbar-nav ml-auto">
                <li className="nav-item h4">
                  <a href="/all" className="nav-link" onClick={logOut}>
                    Log Out
                  </a>
                </li>
              </div>
            ) : (
              <div className="navbar-nav ml-auto">
                <li className="nav-item h4">
                  <Link to={"/login"} className="nav-link">
                    Login
                  </Link>
                </li>

                <li className="nav-item h4">
                  <Link to={"/register"} className="nav-link">
                    Sign Up
                  </Link>
                </li>
              </div>
            )}
          </nav>

          <div className="container mt-3 h-100">
            <Routes>
              <Route path="/" element={<All/>} />
              <Route path="/all" element={<All/>} />
              <Route path="/login" element={<Login/>} />
              <Route path="/register" element={<Register/>} />
              <Route path="/create" element={<Create/>} />
              <Route path="/profile" element={<Profile/>} />
              <Route path="/post/:id" element={<Post/>} />
            </Routes>
          </div>
        </div>
    );
}

export default App;
