const express = require('express');
const router  = express.Router();
const {ensureAuthenticated} = require("../config/403.js")

//index page
router.get('/', (req,res)=>{
    res.render('index',{
        user: req.user,
        page: 'home'
    });
})

//about page
router.get('/about', (req,res)=>{
    res.render('about',{
        user: req.user,
        page: 'about'
    });
})

//cart page
router.get('/cart', (req,res)=>{
    res.render('cart',{
        user: req.user,
        page: 'shop'
    });
})

//checkout page
router.get('/checkout', (req,res)=>{
    res.render('checkout',{
        user: req.user,
        page: 'shop'
    });
})

//contact-us page
router.get('/contact-us', (req,res)=>{
    res.render('contact-us',{
        user: req.user,
        page: 'contact'
    });
})

//gallery page
router.get('/gallery', (req,res)=>{
    res.render('gallery',{
        user: req.user,
        page: 'gallery'
    });
})

//my-account page
router.get('/my-account', ensureAuthenticated,(req,res)=>{
    res.render('my-account',{
        user: req.user,
        page: 'shop'
    });
})

//shop page
router.get('/shop', (req,res)=>{
    res.render('shop',{
        user: req.user,
        page: 'shop'
    });
})

//shop-details page
router.get('/shop-details', (req,res)=>{
    res.render('shop-details',{
        user: req.user,
        page: 'shop'
    });
})

//wishlist page
router.get('/wishlist', (req,res)=>{
    res.render('wishlist',{
        user: req.user,
        page: 'shop'
    });
})

//////////////////////////////////////////////////////////////////////////////

//register page
router.get('/register', (req,res)=>{
    res.render('register',{
        user: req.user,
        page: ''
    });
})

module.exports = router; 