import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import {useAuth} from '../../AuthContext';
import hand from '../../pages/hand.svg'

function Post(props) {
    return (
        <div class="card mt-5 shadow p-3 mb-5" style={{borderRadius: '2em', boxShadow: '0 5px 10px rgba(0,0,0,.2)', backgroundColor: '#C3DBC5'}}>
            <h5 class="card-header text-center bg-transparent">{props.category}</h5>
            <div class="card-body">
                <h3 class="card-title text-center">{props.title}</h3>
                <h6 class="card-title text-center">{props.user.name}</h6>
                <p class="card-text text-center">{props.content}</p>
                <div class="row justify-content-center">
                    <div class="col-4">
                        <img src={props.image} class="img-fluid" alt="Responsive image"/>
                    </div>
                </div>
                <p class="card-text text-center">
                    <Link to ={`/post/${props._id}`}>
                        <input type="button" value="Comment" class="btn btn-outline-primary"/>
                    </Link>
                </p>
            </div>
            <div class="card-footer text-muted pull-right text-end bg-transparent">
                {props.likes.length}
                {props.au && props.likes.filter(e => e.name === props.user).length === 0 && (
                    <button
                      onClick={() => props.hl(props._id, 'like')}
                      class='btn btn-secondary mx-2'
                    >
                        <img src={hand} class="img-responsive"/>
                    </button>
                )}

                {props.au && props.likes.filter(e => e.name === props.user).length > 0 && (<button
                      onClick={() => props.hl(props._id, 'unlike')}
                      class='btn btn-success mx-2'
                    >
                        <img src={hand} class="img-responsive"/>
                    </button>
                )}
                {props.createdAt}
            </div>
        </div>
    );
};

export default Post;
