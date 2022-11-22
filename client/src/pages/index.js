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
            while(posts.length > 0) {
                posts.pop();
            }
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
                <div class="card mt-5 shadow p-3 mb-5 bg-white rounded">

                <h5 class="card-header text-center bg-transparent">{p.category}</h5>

                <div class="card-body">
                <h3 class="card-title text-center">{p.title}</h3>
                <h6 class="card-title text-center">{p.user.name}</h6>
                <p class="card-text text-center">{p.content}</p>
                <p class="card-text text-center">
                <Link to ={`/post/${p._id}`}>
                    <input type="button" value="Comment" class="btn btn-outline-primary"/>
                </Link>
                </p>
                </div>
                <div class="card-footer text-muted pull-right text-end bg-transparent">
                    {p.createdAt}
                </div>
                </div>
            ))}
        </div>
    );
};

export default All;
