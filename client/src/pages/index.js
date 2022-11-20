import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";

const All = () => {
    const [username, setUsername] = useState("");
    const [posts, setPosts] = useState([]);
    const [isBusy, setBusy] = useState(true);

    useEffect(() => {
        setBusy(true);
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser) {
            setUsername(loggedInUser);
        }

        fetch('http://localhost:8080/api/all', {
            method: "GET",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((response) => response.json())
        .then((result) => {
            for (let i = 0; i < result.posts.length; i++){
                posts.push(result.posts[i]);
            }
            setBusy(false);
            console.log(posts);
        });

     }, []);

     console.log(username);

    return (
        <div>
            <h1>This is the all page</h1>
            {posts.map(p => (
                <div>
                    <p>
                    <Link to ={`/post/${p._id}`}>
                    {p.title}
                    </Link>
                    </p>
                    <p>{p.category}</p>
                    <p>Created by {p.user.name} on {p.createdAt}</p>
                    <p>{p.content}</p>
                </div>
            ))}
        </div>
    );
};

export default All;
