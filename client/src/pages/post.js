import React, { useState, useRef , useEffect } from "react";
import { useParams, Navigate } from 'react-router-dom';
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


const Post = () => {
    const [username, setUsername] = useState(localStorage.getItem("user"));
    const [post, setPost] = useState(null);
    const [comment, setComment] = useState("");
    const [isBusy, setBusy] = useState(true);
    const [message, setMessage] = useState("");
    const [successful, setSuccessful] = useState(false);
    const {auth} = useAuth();
    const form = useRef();
    const checkBtn = useRef();

    const { id } = useParams();

    useEffect(() => {
        setBusy(true);
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser) {
            setUsername(loggedInUser);
        }

        fetch(process.env.REACT_APP_BASE_API_URL + '/api/post', {
            method: "POST",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "PostId": id
            })
        })
        .then((response) => response.json())
        .then((result) => {
            setPost(result.post);
            setBusy(false);
        });

    }, []);

    const onChangeComment = (e) => {
        setComment(e.target.value);
    };

    const handleComment = (e) => {
        e.preventDefault();

        form.current.validateAll();

        if (checkBtn.current.context._errors.length === 0){
            fetch(process.env.REACT_APP_BASE_API_URL + '/api/createComment', {
                method: "POST",
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "username": username,
                    "comment": comment,
                    "postID": id
                })
            })
            .then((response) => response.json())
            .then((result) => {
                if (result.message !== "Created"){
                    setMessage(result.message);
                    setSuccessful(false);
                }
                else{
                    setMessage(result.message);
                    fetch(process.env.REACT_APP_BASE_API_URL + '/api/post', {
                        method: "POST",
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            "PostId": id
                        })
                    })
                    .then((response) => response.json())
                    .then((result) => {
                        setPost(result.post);
                        setBusy(false);
                    });
                    setSuccessful(true);
                }
            });
        }
        else {
            //setLoading(false);
        }
    };

    return (
        <div>
            {post && (
                <div class="card mt-5 shadow p-3 mb-5 rounded" style={{borderRadius: '2em', boxShadow: '0 5px 10px rgba(0,0,0,.2)', backgroundColor: '#C3DBC5'}}>

                <h5 class="card-header text-center bg-transparent">{post.category}</h5>

                <div class="card-body">
                <h3 class="card-title text-center">{post.title}

                </h3>
                <h6 class="card-title text-center">{post.user.name}</h6>
                <p class="card-text text-center">{post.content}</p>
                </div>
                </div>
            )}
            {auth && (
                <Form onSubmit={handleComment} ref={form} className="form-inline">
                    <div className='h2 d-inline-block'><label htmlFor="comment">{username}</label></div>
                    <div className="form-group col-md-8 d-inline-block">
                        <Input
                        type="text"
                        className="form-control col-xs-12 col-xs-offset-0 col-sm-6 col-sm-offset-3 mx-3"
                        name="comment"
                        validations={[required]}
                        onChange={onChangeComment}
                        />
                    </div>

                    <div className="form-group d-inline-block">
                        <button className="btn btn-success btn-block mx-5">Submit</button>
                    </div>
                    <CheckButton style={{ display: "none" }} ref={checkBtn} />
                </Form>
            )}
            {(comment || post) && (post.comments.map(c => (

                <div class="card mt-5 shadow p-3 mb-5 rounded" style={{backgroundColor: 'white'}}>
                    <div class="card-body">
                        <p class="card-text">{c.user.name}: {c.content}</p>
                    </div>
                </div>
            )))}

        </div>
    );
};

export default Post;
