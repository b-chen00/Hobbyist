import React, { useState, useEffect, useRef } from "react";
import Form from "react-validation/build/form";
import CheckButton from "react-validation/build/button";

const required = (value) => {
    if (!value) {
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
             fetch('http://ec2-18-222-31-37.us-east-2.compute.amazonaws.com:8080/api/create', {
                 method: "POST",
                 mode: 'cors',
                 headers: {
                     'Content-Type': 'application/json'
                 },
                 body: JSON.stringify({
                     "describe": title,
                     "title": description,
                     "category": category,
                     "username": username
                 })
             })
             .then((response) => response.json())
             .then((result) => {
                 console.log(result);
                 if (result.message !== "Created"){
                     setSuccessful(false);
                 }
                 else{
                     setSuccessful(true);
                 }
                 setMessage(result.message);
             });
         }
     };

    return (
    <div>
        <h2>Add New Post</h2>
        <Form onSubmit={handleCreate} ref={form}>
            <div>
                <label htmlFor="title">Title:</label>
                <input type="text" id="title" name="title"
                validations={[required]}
                onChange={onChangeTitle}/>
            </div>
            <div>
                <label htmlFor="title">Description:</label>
                <input type="text" id="describe" name="describe"
                validations={[required]}
                onChange={onChangeDescription}/>
            </div>
            <div>
                <label htmlFor="title">Category:</label>
                <input type="text" id="category" name="category"
                validations={[required]}
                onChange={onChangeCategory}/>
            </div>
            <input type="submit" value="Create"/>

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
    );
};

export default Create;
