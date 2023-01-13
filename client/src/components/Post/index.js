import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import {useAuth} from '../../AuthContext';
import hand from '../../pages/hand.svg'

function Post(props) {
    const handleLike = (postId, purpose) => {
        console.log(props.posts);
        if (purpose === 'like'){
            fetch(process.env.REACT_APP_BASE_API_URL + '/api/like', {
                method: "POST",
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "username": props.user,
                    "postId": postId
                })
            })
            .then((response) => response.json())
            .then((result) => {
                props.setLikeChanged(true);
                fetch(process.env.REACT_APP_BASE_API_URL + '/api/all', {
                    method: "GET",
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then((response) => response.json())
                .then((result) => {
                    while(props.posts.length > 0) {
                        props.posts.pop();
                    }
                    for (let i = 0; i < result.posts.length; i++){
                        props.posts.push(result.posts[i]);
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
                    "username": props.user,
                    "postId": postId
                })
            })
            .then((response) => response.json())
            .then((result) => {
                props.setUnlikeChanged(true);
                fetch(process.env.REACT_APP_BASE_API_URL + '/api/all', {
                    method: "GET",
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then((response) => response.json())
                .then((result) => {
                    props.posts.map(p => {
                        props.posts.pop();
                    });
                    result.posts.map(p => {
                        props.posts.push(p);
                    });
                });
            });
        }
    };

    return (
        <div className="card mt-5 shadow p-3 mb-5" style={{borderRadius: '2em', boxShadow: '0 5px 10px rgba(0,0,0,.2)', backgroundColor: '#C3DBC5'}}>
            <h5 className="card-header text-center bg-transparent">{props.category}</h5>
            <div className="card-body">
                <h3 className="card-title text-center">{props.title}</h3>
                <h6 className="card-title text-center">{props.user.name}</h6>
                <p className="card-text text-center">{props.content}</p>
                <div className="row justify-content-center">
                    <div className="col-4">
                        <img src={props.image} className="img-fluid" alt="Responsive image"/>
                    </div>
                </div>
                <p className="card-text text-center">
                    <Link to ={`/post/${props._id}`}>
                        <input type="button" value="Comment" className="btn btn-outline-primary"/>
                    </Link>
                </p>
            </div>
            <div className="card-footer text-muted pull-right text-end bg-transparent">
                {props.likes.length}
                {props.au && props.likes.filter(e => e.name === props.user).length === 0 && (
                    <button
                      onClick={() => handleLike(props._id, 'like')}
                      className='btn btn-secondary mx-2'
                    >
                        <img src={hand} className="img-responsive"/>
                    </button>
                )}

                {props.au && props.likes.filter(e => e.name === props.user).length > 0 && (<button
                      onClick={() => handleLike(props._id, 'unlike')}
                      className='btn btn-success mx-2'
                    >
                        <img src={hand} className="img-responsive"/>
                    </button>
                )}
                {props.createdAt}
            </div>
        </div>
    );
};

export default Post;
