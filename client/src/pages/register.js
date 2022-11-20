import React, { useState, useRef } from "react";
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
    //const navigate = useNavigate();
    const form = useRef();
    const checkBtn = useRef();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [successful, setSuccessful] = useState(false);
    const [message, setMessage] = useState("");

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
            fetch('http://localhost:8080/api/register', {
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
                if (result.message !== "Registered"){
                    console.log("NOT REGISTERED "+ result.message );
                    setMessage(result.message);
                    setSuccessful(false);
                }
                else{
                    setMessage(result.message);
                    setSuccessful(true);
                    console.log("redirect");
                }
            });
        }
    };

    return (
        <div className="col-md-12">
            <div className="card card-container">
                <Form onSubmit={handleRegister} ref={form}>
                    {successful && (
                        <div>
                            {username && <Navigate to="/login" />}
                        </div>
                    )}
                    {!successful && (
                    <div>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <Input
                            type="text"
                            className="form-control"
                            name="username"
                            value={username}
                            validations={[required, vusername]}
                            onChange={onChangeUsername}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <Input
                            type="password"
                            className="form-control"
                            name="password"
                            value={password}
                            validations={[required, vpassword]}
                            onChange={onChangePassword}
                            />
                        </div>

                        <div className="form-group">
                            <button className="btn btn-primary btn-block">Sign Up</button>
                        </div>
                    </div>
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
