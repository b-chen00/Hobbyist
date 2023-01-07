import express from 'express'
import mongoose from 'mongoose';
import path from 'path'
import { fileURLToPath } from 'url';
import * as db from './db.mjs';
import session from 'express-session';
import * as auth from './auth.mjs';
import cors from 'cors';
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
dotenv.config()

const db2 = mongoose.connection;
db2.on("error", console.error.bind(console, "connection error: "));
db2.once("open", function () {
  console.log("Connected successfully");
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
}));


app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

// logging
// app.use((req, res, next) => {
//     console.log(req.method, req.path, req.body);
//     next();
// });

const Post = mongoose.model('Post');
const User = mongoose.model('User');
const Comment = mongoose.model('Comment');

const loginMessages = {"PASSWORDS DO NOT MATCH": 'Incorrect password', "USER NOT FOUND": 'User doesn\'t exist'};
const registrationMessages = {"USERNAME ALREADY EXISTS": "Username already exists", "USERNAME TOO SHORT": "Username or password is too short"};

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});


app.post('/api/login', (req, res) => {
    // Referencing authentiation from homework #5
    function success(user) {
        auth.startAuthenticatedSession(req, user, (err) => {
            if(!err) {
                res.json({ message: "Logged in"});
            } else {
                res.json({ message: "Error starting auth session " + err});
            }
        });
    }

    function error(err) {
        res.json({ message: "Login unsuccessful " + err.message});
    }

    auth.login(req.body.username, req.body.password, error, success);
});

app.post('/api/register', (req, res) => {
    // Referencing authentiation from homework #5
    function success(newUser) {
        auth.startAuthenticatedSession(req, newUser, (err) => {
            if (!err) {
                res.json({ message: "Registered"});
            } else {
                res.json({ message: "Error authentiating"});
            }
        });
    }

    function error(err) {
        res.json({ message: "Registration error"});
    }
    auth.register(req.body.username, req.body.password, error, success);
});

app.get('/api/all', (req, res) => {
    Post.find({}).sort('-createdAt').populate('user').populate('likes').exec((err, posts) => {
        res.json({posts: posts});
    });
});

app.post('/api/category', (req, res) => {
    Post.find({category: req.body.category}).sort('-createdAt').populate('user').populate('likes').exec((err, posts) => {
        if (err){
            console.log(err);
        }
        res.json({posts: posts});
    });
});

app.post('/api/myPosts', (req, res) => {
    User.findOne({name: req.body.username}, (err, user) => {
        if (!err && user){
            Post.find({user: user._id}).populate('user').exec((err, posts) => {
                res.json({posts: posts});
            })
        }
        else{
            res.json({ message: "No user found: " + err});
        }
    });
});


app.post('/api/create', (req, res) => {
    User.findOne({name: req.body.username}, (err, user) => {
        if (!err && user) {
            const newPost = new Post({user: user._id, content: req.body.describe, title: req.body.title, category: req.body.category, image: req.body.imageurl, comments: [], createdAt: Date.now(), likes: []});
            newPost.save(function (err){
                if (err){
                    res.json({ message: "Error creating post " + err});
                }
                else{
                    res.json({ message: "Created"});
                }
            });
        }
        else{
            res.json({ message: "Error creating post " + err});
        }
    });
});

app.post('/api/delete', (req, res) => {
    User.findOne({name: req.body.username}, (err, user) => {
        Post.deleteOne({_id: req.body.postId, user: user._id}, (err) => {
            if (err){
                res.json({message: "Error in deleting: " + err});
            }
            else{
                Comment.remove({post: req.body.postId}, (err) => {
                    res.json({message: "Deleted"})
                });
            }
        });
    });
});

app.post('/api/createComment', (req, res) =>{
    User.findOne({name: req.body.username}, (err, user) => {
        if (!err && user){
            Post.findOne({_id: req.body.postID}, (err, post) => {
                if (!err && post) {
                    const newComment = new Comment({user: user._id, content: req.body.comment, post: post._id});
                    post.comments.unshift(newComment._id);
                    post.save();
                    newComment.save(function (err){
                        if (err){
                            res.json({ message: "Error creating comment " + err});
                        }
                        else{
                            res.json({ message: "Created"});
                        }
                    });
                }
                else{
                    res.json({ message: "Error creating comment " + err});
                }
            })
        }
        else{
            es.json({ message: "Error creating comment " + err});
        }
    });
})

app.post('/api/post', (req, res) => {
    Post.findOne({_id: req.body.PostId}).populate({path: 'comments', populate: {path: 'user'}}).populate('user').exec((err, post) => {
        res.json({post: post});
    });
});

app.get('/api/logout', (req, res) => {
    function error(err) {
        res.json({ message: "Error logging out " + err});
    };
    auth.endAuthenticatedSession(req, error)
});

app.post('/api/like', (req, res) => {
    User.findOne({name: req.body.username}, (err, user) => {
        Post.findOne({_id: req.body.postId}, (err, doc) => {
            if (!err){
                doc.likes.push(user._id);
                doc.save();
                res.json({message: 'success'});
            }
            else{
                res.json({message: 'error liking' + err});
            }
        });
    });
});

app.post('/api/unlike', (req, res) => {
    User.findOne({name: req.body.username}, (err, user) => {
        Post.update({_id: req.body.postId}, {
            $pull: {
                likes: user._id
            }
        }, (err, doc) => {
            if (!err){
                res.json({message: 'success'});
            }
            else{
                res.json({message: 'error unliking: ' + err});
            }
        });
    });
})

app.listen(8080, () =>{
    console.log('LISTENING');
});
