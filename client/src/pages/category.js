import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import {useAuth} from '../AuthContext';
import cn from "classnames";
import hand from './hand.svg'
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import './styles.css';

const required = (value) => {
    if (!value && value !== "") {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
};

const Category = () => {
    const form = useRef();
    const checkBtn = useRef();
    const [username, setUsername] = useState("");
    const [posts, setPosts] = useState([]);
    const [isBusy, setBusy] = useState(true);
    const {auth} = useAuth();
    const [clicked, setClicked] = useState(false);
    const [category, setCategory] = useState("");

    const onChangeCategory = (e) => {
        setCategory(e.target.value);
    };

    const handleCategory = (e) => {
        e.preventDefault();
        fetch(process.env.REACT_APP_BASE_API_URL + '/api/category', {
            method: "POST",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "category": category
            })
        })
        .then((response) => response.json())
        .then((result) => {
            while(posts.length > 0) {
                posts.pop();
            }
            for (let i = 0; i < result.posts.length; i++){
                posts.push(result.posts[i]);
            }
            setBusy(!isBusy);
        });
    }

    useEffect(() => {
        setBusy(true);
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser) {
            setUsername(loggedInUser);
        }
        fetch(process.env.REACT_APP_BASE_API_URL + '/api/category', {
            method: "POST",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "category": category
            })
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
        setBusy(false);
    }, [posts, username, auth]);

    if (!auth) return (
        <div>
            <Navigate to="/login" />
        </div>
    )

    return (
        <div>
            <div class="h1" style={{color: '#201e1f'}}><center>Search for Category</center></div>
            <Form onSubmit={handleCategory} ref={form} className="form-inline">
                <div className='h2 d-inline-block'><label htmlFor="category">Category</label></div>
                <div className="form-group col-md-8 d-inline-block">
                    <Input
                    type="text"
                    className="form-control col-xs-12 col-xs-offset-0 col-sm-6 col-sm-offset-3 mx-3"
                    name="category"
                    validations={[required]}
                    onChange={onChangeCategory}
                    />
                </div>

                <div className="form-group d-inline-block">
                    <button className="btn btn-success btn-block mx-5">Submit</button>
                </div>
                <CheckButton style={{ display: "none" }} ref={checkBtn} />
            </Form>
            {posts && posts.map(p => (
                <div class="card mt-5 shadow p-3 mb-5" style={{borderRadius: '2em', boxShadow: '0 5px 10px rgba(0,0,0,.2)', backgroundColor: '#C3DBC5'}}>

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

export default Category;
