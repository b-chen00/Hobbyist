import React, { useState, useEffect } from "react";

const All = () => {
    const [username, setUsername] = useState("");

    useEffect(() => {
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser) {
            setUsername(loggedInUser);
        }
     }, []);

     console.log(username);

    return (
        <div>
            <h1>This is the all page</h1>
        </div>
    );
};

export default All;
