import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

// assumes that User was registered in `./db.mjs`
const User = mongoose.model('User');

const startAuthenticatedSession = (req, user, cb) => {
    req.session.regenerate((err) => {
        if (!err) {
            req.session.user = user;
            cb();
        } else {
            cb(err);
        }
    });
};

const endAuthenticatedSession = (req, cb) => {
    req.session.destroy((err) => { cb(err); });
};


const register = (username, password, errorCallback, successCallback) => {
    const u = username['length'];
    if (u < 5){
        errorCallback({message: 'USERNAME TOO SHORT'});
    }
    else{
        User.findOne({name: username}, (err, result) => {
            if (result){
                errorCallback({message: 'USERNAME ALREADY EXISTS'});
            }
            else{
                bcrypt.hash(password, 10, function(err, hash) {
                    const newUser = new User({name: username, hash: hash, posts: [], follows: [], followers: []});//mongoose.model({username: username, email: email, password: hash});
                    newUser.save(function (err){
                        if (err){
                            errorCallback({message: "DOCUMENT SAVE ERROR"});
                        }
                        else{
                            successCallback(newUser);
                        }
                    });
                });
            }
        });
    }
};

const login = (username, password, errorCallback, successCallback) => {
    User.findOne({name: username}, (err, user) => {
        if (!err && user) {
            bcrypt.compare(password, user.hash, (err, passwordMatch) => {
                if (passwordMatch){
                    successCallback(user);
                }
                else{
                    errorCallback({message: "PASSWORDS DO NOT MATCH"});
                }
            });
        }
        else{
            errorCallback({message: "USER NOT FOUND"});
        }
    });
};

// creates middleware that redirects to login if path is included in authRequiredPaths
const authRequired = authRequiredPaths => {
  return (req, res, next) => {
    if(authRequiredPaths.includes(req.path)) {
      if(!req.session.user) {
        res.redirect('/login');
      } else {
        next();
      }
    } else {
      next();
    }
  };
};

export {
  startAuthenticatedSession,
  endAuthenticatedSession,
  register,
  login,
  authRequired
};
