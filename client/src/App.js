import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import './App.css';
import All from './pages';
import Create from './pages/create';
import Register from './pages/register';
import Login from './pages/login';
import Profile from './pages/profile';
import Post from './pages/post';
import Category from './pages/category';
import {useAuth} from './AuthContext';

function App() {
    const navigate = useNavigate();
    const {auth, setAuth} = useAuth();
    const {user, setUser} = useAuth();
    const [isBusy, setBusy] = useState(true);

    useEffect(() => {
        setBusy(!isBusy);
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser) {
            setUser(loggedInUser);
            setAuth(true)
        }
        setBusy(!isBusy);
    }, [user, auth]);

    const logOut = (e) => {
        e.preventDefault();
        setUser('');
        setAuth(false);
        localStorage.clear();
        fetch('process.env.REACT_APP_BASE_API_URL/api/logout', {
            method: "GET",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        navigate('all');
    };


    return (
        <div style={{}}>
            <nav className="navbar navbar-expand-lg navbar-dark row w-100 mx-0" style={{backgroundColor: '#201e1f'}}>
                <div className="col">
                </div>
                <div className="col">
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
                        {auth && (
                            <li className="nav-item h4">
                                <Link to={"/category"} className="nav-link">
                                    Category
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
                {auth ? (
                    <div className="col">
                        <div className="navbar-nav ml-auto float-end">
                            <div className="h4 my-auto" style={{color: "white"}}>{user}</div>
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

        <div className="container mt-3">
            <Routes>
                <Route path="/" element={<All/>} />
                <Route path="/all" element={<All/>} />
                <Route path="/login" element={<Login/>} />
                <Route path="/register" element={<Register/>} />
                <Route path="/create" element={<Create/>} />
                <Route path="/category" element={<Category/>} />
                <Route path="/profile" element={<Profile/>} />
                <Route path="/post/:id" element={<Post/>} />
            </Routes>
            </div>
        </div>
    );
}

export default App;
