import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import {useAuth} from '../AuthContext';
import cn from "classnames";
import hand from './hand.svg'
import './styles.css';

const particleList = Array.from(Array(10));

const All = () => {
    const [username, setUsername] = useState("");
    const [posts, setPosts] = useState([]);
    const [isBusy, setBusy] = useState(true);
    const {auth} = useAuth();
    const [likeChanged, setLikeChanged] = useState(false);
    const [unlikeChanged, setUnlikeChanged] = useState(false);
    const [clicked, setClicked] = useState(false);


    const handleLike = (postId, purpose) => {
        if (purpose === 'like'){
            fetch(process.env.REACT_APP_BASE_API_URL + '/api/like', {
                method: "POST",
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "username": username,
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
                    "username": username,
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
        setBusy(true);
        setLikeChanged(false);
        setUnlikeChanged(false);
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
        });

    }, [posts, username, likeChanged, unlikeChanged, auth]);


    return (
        <div>
            <div class="h1" style={{color: '#201e1f'}}><center>All Posts</center></div>
            {posts.map(p => (


                <div class="card mt-5 shadow p-3 mb-5" style={{borderRadius: '2em', boxShadow: '0 5px 10px rgba(0,0,0,.2)', backgroundColor: '#C3DBC5'}}>
                <h5 class="card-header text-center bg-transparent">{p.category}</h5>
                <div class="card-body">
                <h3 class="card-title text-center">{p.title}

                </h3>
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
                    {p.likes.length}
                    {auth && p.likes.filter(e => e.name === username).length === 0 && (<button
                          onClick={() => handleLike(p._id, 'like')}
                          class='btn btn-secondary mx-2'
                        >
                            <img src={hand} class="img-responsive"/>
                        </button>
                    )}

                    {auth && p.likes.filter(e => e.name === username).length > 0 && (<button
                          onClick={() => handleLike(p._id, 'unlike')}
                          class='btn btn-success mx-2'
                        >
                            <img src={hand} class="img-responsive"/>
                        </button>
                    )}
                    {p.createdAt}
                </div>
                </div>
            ))}
        </div>
    );
};

export default All;
