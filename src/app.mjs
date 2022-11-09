import express from 'express'
import mongoose from 'mongoose';
import path from 'path'
import { fileURLToPath } from 'url';
import * as db from './db.mjs';
import session from 'express-session';
import * as auth from './auth.mjs';

const db2 = mongoose.connection;
db2.on("error", console.error.bind(console, "connection error: "));
db2.once("open", function () {
  console.log("Connected successfully");
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('view engine', 'hbs');
app.set('views', `${__dirname}/views`);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'feline good',
    resave: false,
    saveUninitialized: true,
}));

app.use("/styles/css", express.static(path.join(__dirname, "../node_modules/bootstrap/dist/css"))); // <- This will use the contents of 'bootstrap/dist/css' which is placed in your node_modules folder as if it is in your '/styles/css' directory.


app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

// logging
app.use((req, res, next) => {
    console.log(req.method, req.path, req.body);
    next();
});

const Post = mongoose.model('Post');

const loginMessages = {"PASSWORDS DO NOT MATCH": 'Incorrect password', "USER NOT FOUND": 'User doesn\'t exist'};
const registrationMessages = {"USERNAME ALREADY EXISTS": "Username already exists", "USERNAME TOO SHORT": "Username or password is too short"};

app.get('/', (req, res) => {
    res.redirect('all');
});

app.get('/login', (req, res) => {
    res.render('login.hbs');
});

app.post('/login', (req, res) => {
    // Referencing authentiation from homework #5
    function success(user) {
        auth.startAuthenticatedSession(req, user, (err) => {
            if(!err) {
                res.redirect('/');
            } else {
                res.render('error', {message: 'error starting auth sess: ' + err});
            }
        });
    }

    function error(err) {
        res.render('login', {message: loginMessages[err.message] || 'Login unsuccessful'});
    }

    auth.login(req.body.username, req.body.password, error, success);
});

app.get('/register', (req, res) => {
    res.render('register.hbs');
});

app.post('/register', (req, res) => {
    // Referencing authentiation from homework #5
    function success(newUser) {
        auth.startAuthenticatedSession(req, newUser, (err) => {
            if (!err) {
                res.redirect('/');
            } else {
                res.render('error', {message: 'err authing???'});
            }
        });
    }

    function error(err) {
        res.render('register', {message: registrationMessages[err.message] ?? 'Registration error'});
    }

    auth.register(req.body.username, req.body.password, error, success);
});

app.get('/all', (req, res) => {
    Post.find({}).sort('-createdAt').populate('user').exec((err, posts) => {
        console.log(posts);
        res.render('all', {posts: posts});
    });
});

app.get('/profile', (req, res) => {
    res.render('profile.hbs');
});

app.get('/post', (req, res) => {
    res.render('post.hbs');
});

app.get('/create', (req, res) => {
    console.log("working");
    res.render('create');
});

app.post('/create', (req, res) => {
    const newPost = new Post({user: req.session.user._id, content: req.body.describe, title: req.body.title, category: req.body.category, comments: [], createdAt: Date.now(), likes: []});
    newPost.save(function (err){
        if (err){
            res.status(500).send(err);
        }
        else{
            res.redirect('/all');
        }
    });
});

app.get('/logout', (req, res) => {
    function error(err) {
        res.redirect('all')
    }
    auth.endAuthenticatedSession(req, error)
})

app.listen(process.env.PORT || 3000);
