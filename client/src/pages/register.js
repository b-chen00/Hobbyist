import React, { useState, useEffect, useRef } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import {Link, Routes, Route, Navigate} from 'react-router-dom';


const required = (value) => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
};


const vusername = (value) => {
    if (value.length < 3 || value.length > 20) {
        return (
            <div className="alert alert-danger" role="alert">
                The username must be between 3 and 20 characters.
            </div>
        );
    }
};

const vpassword = (value) => {
    if (value.length < 5 || value.length > 40) {
        return (
            <div className="alert alert-danger" role="alert">
                The password must be between 5 and 40 characters.
            </div>
        );
    }
};

const Register = () => {
    const form = useRef();
    const checkBtn = useRef();

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

    const handleRegister = (e) => {
        e.preventDefault();

        setMessage("");
        setSuccessful(false);

        form.current.validateAll();

        if (checkBtn.current.context._errors.length === 0) {
            fetch(process.env.REACT_APP_BASE_API_URL + '/api/register', {
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
                if (result.message !== "Registered"){
                    setMessage(result.message);
                    setSuccessful(false);
                }
                else{
                    setMessage(result.message);
                    setSuccessful(true);
                }
            });
        }
    };

    return (
        <div className="h-50 d-flex align-items-center justify-content-center">
            <div className="card card-container col-md-6 mx-auto" style={{backgroundColor: '#C0E0DE'}}>
                <h3 class="banner mt-3 text-center">
                    Register
                </h3>
                <Form onSubmit={handleRegister} ref={form}>
                    {successful && (
                        <div>
                            {username && <Navigate to="/login" />}
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
                            validations={[required, vusername]}
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
                            validations={[required, vpassword]}
                            onChange={onChangePassword}
                            />
                        </div>

                        <div className="form-group">
                            <button className="btn btn-outline-success btn-block mt-3 mb-4">Sign Up</button>
                        </div>
                    </center>
                    )}

                    {message && (
                    <div className="form-group">
                        <div
                            className={ successful ? "alert alert-success" : "alert alert-danger" }
                            role="alert"
                            >
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

export default Register;
