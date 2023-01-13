import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import {useAuth} from '../AuthContext';
import cn from "classnames";
import hand from './hand.svg'
import Post from '../components/Post'
import './styles.css';

const particleList = Array.from(Array(10));

const All = () => {
    const [posts, setPosts] = useState([]);
    const [isBusy, setBusy] = useState(true);
    const {user, setUser} = useAuth();
    const {auth} = useAuth();
    const [likeChanged, setLikeChanged] = useState(false);
    const [unlikeChanged, setUnlikeChanged] = useState(false);
    const [clicked, setClicked] = useState(false);


    const handleLike = (postId, purpose) => {
        console.log(posts);
        console.log(postId);
        console.log(user);
        if (purpose === 'like'){
            fetch(process.env.REACT_APP_BASE_API_URL + '/api/like', {
                method: "POST",
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "username": user,
                    "postId": postId
                })
            })
            .then((response) => response.json())
            .then((result) => {
                setLikeChanged(true);
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
                });
            });
        }
        else {
            fetch(process.env.REACT_APP_BASE_API_URL + '/api/unlike', {
                method: "POST",
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "username": user,
                    "postId": postId
                })
            })
            .then((response) => response.json())
            .then((result) => {
                setUnlikeChanged(true);
                fetch(process.env.REACT_APP_BASE_API_URL + '/api/all', {
                    method: "GET",
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then((response) => response.json())
                .then((result) => {
                    posts.map(p => {
                        posts.pop();
                    });
                    result.posts.map(p => {
                        posts.push(p);
                    });
                });
            });
        }
    };

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

    }, [posts, user, likeChanged, unlikeChanged, auth]);


    return (
        <div>
            <div class="h1" style={{color: 'white'}}><center>All Posts</center></div>
            {posts.map(p => (
                <Post title={p.title} category={p.category} title={p.title} user={user} content={p.content} image={p.image} _id={p._id} likes={p.likes} createdAt={p.createdAt} hl={handleLike} au={auth}/>
            ))}
        </div>
    );
};

export default All;
