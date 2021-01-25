const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require("../models/user.js");
const mongoose = require('mongoose');
const passport = require('passport');
const dbUser = require("../models/user");
const { doesNotMatch } = require('assert');
const {ensureAuthenticated} = require("../config/403.js")

mongoose.set('useFindAndModify', false);

///// get path /////
router.get('/login',(req,res)=>{
    res.render('login',{
        user: req.user,
        page: ''
    });
})

router.get('/register',(req,res)=>{
    res.render('register',{
        user: req.user,
        page: ''
    });
})

router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','You are logged out');
    res.redirect('/users/login');
})

router.get('/email', ensureAuthenticated,(req,res)=>{
    res.render('email',{
        user: req.user,
    });
})

///// post path /////
//Register
router.post('/register',(req,res)=>{
    const {name,lastName,email, password, password2} = req.body;
    let errors = [];
    // console.log(req.body);
    console.log('First Name: ' + name+ ' Last Name: '+ lastName+ ' email: ' + email+ ' pass: ' + password);

    if(!name || !lastName || !email || !password || !password2) {
        errors.push({msg : "Please, fill in all fields"})
    }

    //check if match
    if(password !== password2) {
        errors.push({msg : "passwords don't match"});
    }

    //check if password is more than 6 characters
    if(password.length < 6 ) {
        errors.push({msg : 'password must be at least 6 characters'})
    }

    if(errors.length > 0 ) {
        res.render('register', {
            errors : errors,
            name : name,
            lastName : lastName,
            email : email,
            password : password,
            password2 : password2
        })
    } else { //validation passed
        User.findOne({email : email}).exec((err,user)=>{
            console.log(user);   
            if(user) {
                errors.push({msg: 'email already registered'});
                res.render('register', {
                    errors : errors
                })
            } else {
                const newUser = new User({
                    name : name,
                    lastName : lastName,
                    email : email,
                    password : password
                });
      
                //hash password
                bcrypt.genSalt(10,(err,salt) => bcrypt.hash(newUser.password,salt,(err,hash)=> {
                    if(err) throw err;
                    
                    newUser.password = hash; //save pass to hash
                    newUser.save() //save user

                    .then((value) => {
                        // console.log(value)
                        req.logout();
                        req.flash('success_msg','Register Successful');
                        res.redirect('/users/login');
                    })
                    .catch(value => console.log(value));                      
                }));
            }
        })
    }
})

//Change Email
router.post('/email',(req,res)=>{
    let user = req.user;
    const {email, checkPassword} = req.body;
    let errors = [];
    // console.log(user);
    // console.log(req.body);
    // console.log('New email: ' + email+ ' pass: ' + checkPassword);

    if(!email || !checkPassword) {
        errors.push({msg : "Please, fill in all fields"})
    } else {
        bcrypt.compare(checkPassword, user.password, function(err, result) {
            // console.log(result);
            if(result === false){
                errors.push({msg : "Wrong Password"})
            } else {
                User.findOne({email : email}).exec((err,result)=>{
                    // console.log(result);   
                    if(result) {
                        errors.push({msg: 'email already registered'});
                        res.render('email', {
                            user : user,
                            errors : errors,
                            page : ''
                        })
                    } else { // change the mail
                        // user.email = email
                        // console.log(user);
                        const id = user._id;
                        dbUser.findByIdAndUpdate(id, { email: email }, err => { // update the user's email
                            if (err) return res.send(500, err);
                            user.email = email;
                            res.redirect('/my-account');
                        });
                    }
                })
            }
    
            if(errors.length > 0 ) {
                res.render('email', {
                    user : user,
                    errors : errors,
                    email : email,
                    page : ''
                })
            }
        });
    }

    if(errors.length > 0 ) {
        res.render('email', {
            user : User,
            errors : errors,
            email : email,
            page : ''
        })
    }
})

//Delete Account
router.post('/delete',(req,res)=>{
    const {password} = req.body;
    let errors = [];
    
    bcrypt.compare(password, req.user.password, function(err, result) {
        // console.log(result);
        if(result === false){
            errors.push({msg : "Your account has NOT been deleted because you entered a wrong password."})
        
        } else { // delete Account
            const id = req.user._id;
            dbUser.findByIdAndDelete(id, err => { // update the user's email
                if (err) return res.send(500, err);
                req.logout();
                req.flash('success_msg','Your Account has been deleted');
                res.redirect('/users/login');
            });
        }

        if(errors.length > 0 ) {
            res.render('my-account', {
                user : req.user,
                errors : errors,
                page : ''
            })
        }
    });
});

//sign in
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect : '/my-account',
        failureRedirect : '/users/login',
        failureFlash : true,
    })(req,res,next);
})

module.exports  = router;