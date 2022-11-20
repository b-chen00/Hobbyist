import React, { useState, useEffect } from "react";


const Profile = () => {
    const [username, setUsername] = useState("");
    
    useEffect(() => {
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser) {
            setUsername(loggedInUser);
        }
    }, []);

    return (
        <div>
            <h1>Profile</h1>
        </div>
    );
};

export default Profile;
