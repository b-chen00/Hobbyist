import React, { useState, useEffect } from "react";
import {useAuth} from '../AuthContext';

const Profile = () => {
    const [username, setUsername] = useState("");
    const [posts, setPosts] = useState([]);
    const [isBusy, setBusy] = useState(true);
    const {auth} = useAuth();

    useEffect(() => {
        setBusy(true);
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser) {
            console.log("REACHED");
            console.log(loggedInUser);
            setUsername(loggedInUser);
            console.log(username);
        }
        console.log(loggedInUser);
        console.log(username);
        fetch('http://localhost:8080/api/myPosts', {
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

    }, [username]);

    return (
        <div>
            <h1>Profile</h1>
            {posts && posts.map(p => (
                <div class="card mt-5 shadow p-3 mb-5 bg-white rounded">

                <h5 class="card-header text-center bg-transparent">{p.category}</h5>

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
