const express = require('express');
const router  = express.Router();
const {ensureAuthenticated} = require("../config/403.js")

//login page
router.get('/', (req,res)=>{
    res.render('welcome');
})

//register page
router.get('/register', (req,res)=>{
    res.render('register');
})

//dashboard page
router.get('/dashboard', ensureAuthenticated,(req,res)=>{
    res.render('dashboard',{
        user: req.user
    });
    console.log(req.user);
})

module.exports = router; 