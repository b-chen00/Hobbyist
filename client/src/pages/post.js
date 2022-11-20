import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';

const Profile = () => {
    const [username, setUsername] = useState("");
    const [post, setPost] = useState(null);
    const [isBusy, setBusy] = useState(true);

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
            setPost(result.post);
            setBusy(false);
            console.log(result);
        });

    }, []);

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
            {username && (
                <Form onSubmit={handleRegister} ref={form}>
                    <div>
                        <div className="form-group">
                            <label htmlFor="comment">Comment</label>
                            <Input
                            type="text"
                            className="form-control"
                            name="username"
                            value={username}
                            validations={[required]}
                            onChange={onChangeComment}
                            />
                        </div>

                        <div className="form-group">
                            <button className="btn btn-primary btn-block">Sign Up</button>
                        </div>
                    </div>

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
            )}
        </div>
    );
};

export default Profile;
