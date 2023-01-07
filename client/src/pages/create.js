import React, { useState, useEffect, useRef } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import {useAuth} from '../AuthContext';
import { Navigate } from 'react-router-dom';
import AWS from 'aws-sdk';
import './styles.css';

const required = (value) => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
};

const S3_BUCKET = 'hobbyistbucket';
const REGION = 'us-east-1';

AWS.config.update({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY
})

const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET},
    region: REGION
})

const generateUUID = () => {
    let d = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c === 'x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}

const Create = () => {
    const [progress , setProgress] = useState(0);
    const [username, setUsername] = useState(localStorage.getItem("user"));
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState(null)
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

     const onChangeImage = (e) => {
         const c = e.target.files[0];
         setImage(c);
     };

     const handleCreate = (e) => {
         e.preventDefault();

         console.log(process.env.REACT_APP_AWS_ACCESS_KEY);

         form.current.validateAll();
         if (checkBtn.current.context._errors.length === 0) {
             const iurl = generateUUID();
             const params = {
                 ACL: 'public-read',
                 Body: image,
                 Bucket: S3_BUCKET,
                 Key: iurl
             };

             myBucket.putObject(params)
             .on('httpUploadProgress', (evt) => {
                 setProgress(Math.round((evt.loaded / evt.total) * 100))
             })
             .send((err) => {
                 if (err) console.log(err)
             })


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
                     "username": username,
                     "imageurl": 'https://hobbyistbucket.s3.us-east-1.amazonaws.com/' + iurl
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
                 setImage(null);
             });
         }
     };

     if (!username) return (
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
                    <div className="form-group col-md-6">
                        <label htmlFor="image">Image:</label>
                        <Input type="file" id="image" name="image"
                        className="form-control col-xs-12 col-xs-offset-0 col-sm-6 col-sm-offset-3 mb-3"
                        validations={[required]}
                        onChange={onChangeImage}/>
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
