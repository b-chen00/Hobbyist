import React, { useState, useEffect, useRef } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import {useAuth} from '../AuthContext';
import { Navigate } from 'react-router-dom';
import './styles.css';

const required = (value) => {
    if (!value || value !== "") {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
};


const Create = () => {
    const [username, setUsername] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [message, setMessage] = useState("");
    const [successful, setSuccessful] = useState(false);
    const form = useRef();
    const {auth} = useAuth();
    const checkBtn = useRef();

    useEffect(() => {
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser) {
            setUsername(loggedInUser);
        }
     }, []);

     const onChangeTitle = (e) => {
         const title = e.target.value;
         setTitle(title);
     };

     const onChangeDescription = (e) => {
         const d = e.target.value;
         setDescription(d);
     };

     const onChangeCategory = (e) => {
         const c = e.target.value;
         setCategory(c);
     };

     const handleCreate = (e) => {
         e.preventDefault();

         form.current.validateAll();
         if (checkBtn.current.context._errors.length === 0) {
             fetch(process.env.REACT_APP_BASE_API_URL + '/api/create', {
                 method: "POST",
                 mode: 'cors',
                 headers: {
                     'Content-Type': 'application/json'
                 },
                 body: JSON.stringify({
                     "describe": description,
                     "title": title,
                     "category": category,
                     "username": username
                 })
             })
             .then((response) => response.json())
             .then((result) => {
                 if (result.message !== "Created"){
                     setSuccessful(false);
                 }
                 else{
                     setSuccessful(true);
                 }
                 setMessage(result.message);
                 setTitle("");
                 setDescription("");
                 setCategory("");
             });
         }
     };

     if (!auth) return (
         <div>
             <Navigate to="/login" />
         </div>
     )

    return (
        <div className="h-75 d-flex align-items-center justify-content-center">
            <div className="col-md-6 mx-auto roundCard">
                <h3 class="banner mt-3 text-center">
                    Create a Post
                </h3>
                <Form onSubmit={handleCreate} ref={form}>
                    <center>
                    <div className="form-group col-md-6">
                        <label htmlFor="title">Title:</label>
                        <Input type="text" id="title" name="title" value={title}
                        className="form-control col-xs-12 col-xs-offset-0 col-sm-6 col-sm-offset-3 mb-3"
                        validations={[required]}
                        onChange={onChangeTitle}/>
                    </div>
                    <div className="form-group col-md-10">
                        <label htmlFor="describe">Description:</label>
                        <textarea rows="10" id="describe" name="describe" value={description}
                        className="form-control col-xs-12 col-xs-offset-0 col-sm-6 col-sm-offset-3 mb-3"
                        validations={[required]}
                        onChange={onChangeDescription}/>
                    </div>
                    <div className="form-group col-md-6">
                        <label htmlFor="category">Category:</label>
                        <Input type="text" id="category" name="category" value={category}
                        className="form-control col-xs-12 col-xs-offset-0 col-sm-6 col-sm-offset-3 mb-3"
                        validations={[required]}
                        onChange={onChangeCategory}/>
                    </div>
                    <input type="submit" class="btn btn-outline-success btn-block mt-3 mb-4" value="Create"/>

                    {message && (
                    <div className="form-group col-md-6">
                        <div
                            className={ successful ? "alert alert-success" : "alert alert-danger" }
                            role="alert"
                            >
                            {message}
                        </div>
                    </div>
                    )}
                    <CheckButton style={{ display: "none" }} ref={checkBtn} />
                    </center>
                </Form>
            </div>
        </div>
    );
};

export default Create;
