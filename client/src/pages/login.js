import React, { useState, useRef, useEffect } from "react";
import { Navigate } from 'react-router-dom';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import {useAuth} from '../AuthContext';

const required = (value) => {
    if (!value){
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
};

const Login = () => {
    const form = useRef();
    const checkBtn = useRef();
    const { setAuth } = useAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [successful, setSuccessful] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser) {
            setUsername(loggedInUser);
        }
     }, []);

    const onChangeUsername = (e) => {
        const username = e.target.value;
        setUsername(username);
    };

    const onChangePassword = (e) => {
        const password = e.target.value;
        setPassword(password);
    };

    const handleLogin = (e) => {
        e.preventDefault();

        form.current.validateAll();

        if (checkBtn.current.context._errors.length === 0){
            fetch(process.env.REACT_APP_BASE_API_URL + '/api/login', {
                method: "POST",
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "username": username,
                    "password": password
                })
            })
            .then((response) => response.json())
            .then((result) => {
                console.log(result);
                if (result.message !== "Logged in"){
                    console.log("Invalid login: "+ result.message );
                    setMessage(result.message);
                    setSuccessful(false);
                }
                else{
                    setMessage(result.message);
                    setSuccessful(true);
                    setAuth(true);
                    localStorage.setItem('user', username);
                    console.log("all");
                }
            });
        }
        else {
            //setLoading(false);
        }
    };

    return (
        <div className="h-50 d-flex align-items-center justify-content-center">
            <div className="card card-container col-md-6 mx-auto" style={{backgroundColor: '#C0E0DE'}}>
                <h3 class="banner mt-3 text-center">
                    Login
                </h3>
                <Form onSubmit={handleLogin} ref={form}>
                    {successful && (
                        <div>
                            {username && <Navigate to="/all" />}
                        </div>
                    )}
                    {!successful && (
                        <center>
                            <div className="form-group col-md-6">
                                <label htmlFor="username">Username</label>
                                <Input
                                type="text"
                                className="form-control col-xs-12 col-xs-offset-0 col-sm-6 col-sm-offset-3 mb-3"
                                name="username"
                                value={username}
                                validations={[required]}
                                onChange={onChangeUsername}
                                />
                            </div>

                            <div className="form-group col-md-6">
                                <label htmlFor="password">Password</label>
                                <Input
                                type="password"
                                className="form-control col-xs-12 col-xs-offset-0 col-sm-6 col-sm-offset-3 mb-3"
                                name="password"
                                value={password}
                                validations={[required]}
                                onChange={onChangePassword}
                                />
                            </div>
                            <div className="form-group">
                                <button className="btn btn-outline-success btn-block mt-3 mb-4">Login</button>
                            </div>
                        </center>
                    )}

                    {message && (
                        <div className="form-group">
                            <div className="alert alert-danger" role="alert">
                            {message}
                            </div>
                        </div>
                    )}
                    <CheckButton style={{ display: "none" }} ref={checkBtn} />
                </Form>
            </div>
        </div>
    );
};

export default Login;
