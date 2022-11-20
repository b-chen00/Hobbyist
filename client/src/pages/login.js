import React, { useState, useRef } from "react";
import { Navigate } from 'react-router-dom';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";


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

    const handleLogin = (e) => {
        e.preventDefault();

        form.current.validateAll();

        if (checkBtn.current.context._errors.length === 0){
            fetch('http://localhost:8080/api/login', {
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
                    console.log("all");
                }
            });
        }
        else {
            //setLoading(false);
        }
    };

    return (
        <div className="col-md-12">
            <div className="card card-container">
                <Form onSubmit={handleLogin} ref={form}>
                    {successful && (
                        <div>
                            {username && <Navigate to="/all" />}
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
                                validations={[required]}
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
                                validations={[required]}
                                onChange={onChangePassword}
                                />
                            </div>
                            <div className="form-group">
                                <button className="btn btn-primary btn-block">Login</button>
                            </div>
                        </div>
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
