import React, { useState, useRef , useEffect } from "react";
import { useParams } from 'react-router-dom';
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
    const [username, setUsername] = useState("");
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

        fetch('http://localhost:8080/api/post', {
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
            //setPost(result.post);
            //post = result.post;
            setPost(result.post);
            setBusy(false);
            //onsole.log(result.post);
            //console.log(post);
        });

    }, []);

    const onChangeComment = (e) => {
        setComment(e.target.value);
    };

    const handleComment = (e) => {
        e.preventDefault();

        form.current.validateAll();

        if (checkBtn.current.context._errors.length === 0){
            fetch('http://localhost:8080/api/createComment', {
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
                //console.log(result);
                if (result.message !== "Created"){
                    setMessage(result.message);
                    setSuccessful(false);
                }
                else{
                    setMessage(result.message);
                    //post.comments.unshift({user: localStorage.getItem("user"), content: comment});
                    fetch('http://localhost:8080/api/post', {
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
                        //setPost(result.post);
                        //post = result.post;
                        setPost(result.post);
                        setBusy(false);
                        console.log(result.post);
                        console.log(post);
                    });
                    console.log(post);
                    console.log(post.comments);
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
            <h1>Post</h1>
            {post && (
                <div>
                    <p>
                    {post.title}
                    </p>
                    <p>{post.category}</p>
                    <p>Created by {post.user.name} on {post.createdAt}</p>
                    <p>{post.content}</p>
                </div>
            )}
            {auth && (
                <Form onSubmit={handleComment} ref={form}>
                    <div>
                        <div className="form-group">
                            <label htmlFor="comment">Comment</label>
                            <Input
                            type="text"
                            className="form-control"
                            name="comment"
                            validations={[required]}
                            onChange={onChangeComment}
                            />
                        </div>

                        <div className="form-group">
                            <button className="btn btn-primary btn-block">Submit</button>
                        </div>
                    </div>
                    <CheckButton style={{ display: "none" }} ref={checkBtn} />
                </Form>
            )}
            Comments:
            {(comment || post) && (post.comments.map(c => (
                <div>
                    <p>{c.content} - {c.user.name}</p>
                </div>
            )))}

        </div>
    );
};

export default Post;
