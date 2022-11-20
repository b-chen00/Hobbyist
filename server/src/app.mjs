import express from 'express'
import mongoose from 'mongoose';
import path from 'path'
import { fileURLToPath } from 'url';
import * as db from './db.mjs';
import session from 'express-session';
import * as auth from './auth.mjs';
import cors from 'cors';
import bodyParser from 'body-parser'


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
    secret: 'feline good',
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
        res.json({ message: "Loggin unsuccessful " + err});
    }

    auth.login(req.body.username, req.body.password, error, success);
});

app.post('/api/register', (req, res) => {
    // Referencing authentiation from homework #5
    console.log(req.body);
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
    Post.find({}).sort('-createdAt').populate('user').exec((err, posts) => {
        console.log(posts);
        res.json({posts: posts});
    });
});


app.post('/api/create', (req, res) => {
    const newPost = new Post({user: req.session.user._id, content: req.body.describe, title: req.body.title, category: req.body.category, comments: [], createdAt: Date.now(), likes: []});
    newPost.save(function (err){
        if (err){
            res.json({ message: "Error creating post " + err});
        }
        else{
            res.json({ message: "Created"});
        }
    });
});

app.get('/api/logout', (req, res) => {
    function error(err) {
        res.json({ message: "Error logging out " + err});
    };
    auth.endAuthenticatedSession(req, error)
});

app.listen(process.env.PORT || 8080, () =>{
    console.log('LISTENING');
});
