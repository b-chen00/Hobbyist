import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import {useAuth} from '../AuthContext';
import cn from "classnames";
import hand from './hand.svg'
import Post from '../components/Post'
import './styles.css';

const All = () => {
    const [posts, setPosts] = useState([]);
    const [isBusy, setBusy] = useState(true);
    const {user, setUser} = useAuth();
    const {auth} = useAuth();

    useEffect(() => {
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser) {
            setUser(loggedInUser);
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
        });

    }, [posts, user, setUser, auth]);


    return (
        <div>
            <div className="h1" style={{color: 'white'}}><center>All Posts</center></div>
            {posts.map(p => (
                <Post title={p.title}
                    category={p.category}
                    title={p.title}
                    user={user}
                    content={p.content}
                    image={p.image}
                    _id={p._id}
                    likes={p.likes}
                    createdAt={p.createdAt}
                    posts={posts}
                    au={auth}/>
            ))}
        </div>
    );
};

export default All;
