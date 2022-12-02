import React, { useState, useEffect } from "react";
import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import './App.css';
import All from './pages';
import Create from './pages/create';
import Register from './pages/register';
import Login from './pages/login';
import Profile from './pages/profile';
import Post from './pages/post'
import {useAuth} from './AuthContext';

function App() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const {auth, setAuth} = useAuth();

    useEffect(() => {
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser) {
            setUsername(loggedInUser);
            setAuth(true)
        }
     }, []);

    const logOut = (e) => {
        e.preventDefault();
        console.log("CALLED")
        setUsername("");
        setAuth(false);
        localStorage.clear();
        fetch('http://ec2-18-222-31-37.us-east-2.compute.amazonaws.com:8080/api/logout', {
            method: "GET",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        navigate('all');
    };


    return (
        <div style={{backgroundColor: 'white', height: '100%'}}>
            <nav className="navbar navbar-expand-lg navbar-dark row" style={{backgroundColor: '#54577C'}}>
                <div class="col">
                </div>
                <div class="col">
                    <ul className="navbar-nav mr-auto justify-content-center">
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
                    <div className="col">
                        <div className="navbar-nav ml-auto float-end">
                            <li className="nav-item h4">
                                <a href="/all" className="nav-link" onClick={logOut}>
                                    Log Out
                                </a>
                            </li>
                        </div>
                    </div>
                ) : (
                    <div className="col">
                        <div className="navbar-nav ml-auto float-end">
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
