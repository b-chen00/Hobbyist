import React, { useState, useEffect } from "react";
import {useAuth} from '../AuthContext';

const Profile = () => {
    const [username, setUsername] = useState("");
    const [posts, setPosts] = useState([]);
    const [isBusy, setBusy] = useState(true);
    const {auth, setAuth} = useAuth();
    const [postsChanged, setPostsChanged] = useState(false);

    const handleDelete = (postId) => {
        //e.preventDefault();
        fetch(process.env.REACT_APP_BASE_API_URL + '/api/delete', {
            method: "POST",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "postId": postId
            })
        })
        .then((response) => response.json())
        .then((result) => {
            setPostsChanged(true)
            while(posts.length > 0) {
                posts.pop();
            }
            for (let i = 0; i < result.posts.length; i++){
                posts.push(result.posts[i]);
            }
        });
    };

    useEffect(() => {
        setPostsChanged(false);
        setBusy(true);
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser) {
            setUsername(loggedInUser);
            setAuth(true)
        }
        console.log(loggedInUser);
        console.log(username);
        fetch(process.env.REACT_APP_BASE_API_URL + '/api/myPosts', {
            method: "POST",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "username": loggedInUser
            })
        })
        .then((response) => response.json())
        .then((result) => {
            if (result && result.posts){
                console.log(result);
                while(posts.length > 0) {
                    posts.pop();
                }
                for (let i = 0; i < result.posts.length; i++){
                    posts.push(result.posts[i]);
                }
                console.log(posts)
                setBusy(false);
            }
        });

    }, [username, posts, postsChanged]);

    return (
        <div>
            <div class="h1" style={{color: '#201e1f'}}><center>Your Posts</center></div>
            {posts && posts.map(p => (
                <div class="card mt-5 shadow p-3 mb-5" style={{borderRadius: '2em', boxShadow: '0 5px 10px rgba(0,0,0,.2)', backgroundColor: '#C3DBC5'}}>

                <h5 class="card-header text-center bg-transparent">{p.category} <button type="button" class="btn-close float-end" aria-label="Close" onClick={() => handleDelete(p._id)}></button></h5>

                <div class="card-body">
                <h3 class="card-title text-center">{p.title}</h3>
                <h6 class="card-title text-center">{p.user.name}</h6>
                <p class="card-text text-center">{p.content}</p>
                </div>
                <div class="card-footer text-muted pull-right text-end bg-transparent">
                    {p.createdAt}
                </div>
                </div>
            ))}
        </div>
    );
};

export default Profile;
