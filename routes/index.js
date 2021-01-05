const express = require('express');
const router  = express.Router();
const {ensureAuthenticated} = require("../config/403.js")

//index page
router.get('/', (req,res)=>{
    res.render('index');
})

//about page
router.get('/about', (req,res)=>{
    res.render('about');
})

//cart page
router.get('/cart', (req,res)=>{
    res.render('cart');
})

//checkout page
router.get('/checkout', (req,res)=>{
    res.render('checkout');
})

//contact-us page
router.get('/contact-us', (req,res)=>{
    res.render('contact-us');
})

//gallery page
router.get('/gallery', (req,res)=>{
    res.render('gallery');
})

//my-account page
router.get('/my-account', (req,res)=>{
    res.render('my-account');
})

//shop page
router.get('/shop', (req,res)=>{
    res.render('shop');
})

//shop-details page
router.get('/shop-details', (req,res)=>{
    res.render('shop-details');
})

//wishlist page
router.get('/wishlist', (req,res)=>{
    res.render('wishlist');
})

//////////////////////////////////////////////////////////////////////////////

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