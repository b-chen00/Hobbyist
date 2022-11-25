import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import {useAuth} from '../AuthContext';

const All = () => {
    const [username, setUsername] = useState("");
    const [posts, setPosts] = useState([]);
    const [isBusy, setBusy] = useState(true);
    const {auth} = useAuth();

    useEffect(() => {
        setBusy(true);
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser) {
            setUsername(loggedInUser);
        }

        fetch(process.env.REACT_APP_BASE_API_URL + '/api/all', {
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

    }, [username]);


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
                {auth && (<Link to ={`/post/${p._id}`}>
                        <input type="button" value="Comment" class="btn btn-outline-primary"/>
                    </Link>
                )}
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
