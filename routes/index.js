const express = require('express');
const router  = express.Router();
const {ensureAuthenticated} = require("../config/403.js");
const User = require("../models/user.js");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const dbUser = require("../models/user");
const user = require('../models/user.js');
const bcrypt = require('bcrypt');
const Product = require("../models/product");
const product = require('../models/product');

///// GET Path /////
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
    Product.find().sort('name').exec((err,products)=>{

        res.render('shop',{
            products: products,
            user: req.user,
            page: 'shop'
        });
    });
})

//shop-detail page
router.get('/shop-detail/:id', (req,res)=>{
    Product.findOne({ 
        _id: req.params.id, // looking for the product 
    }, (err, product) =>{
        if (!product){
            req.flash('error_msg', "this product does not exist.")
            return res.redirect('/shop');
        }
        res.render('shop-detail',{
            product: product,
            user: req.user,
            page: 'shop'
        });
    });
})

//wishlist page
router.get('/wishlist', (req,res)=>{
    res.render('wishlist',{
        user: req.user,
        page: 'shop'
    });
})

//register page
router.get('/register', (req,res)=>{
    res.render('register',{
        user: req.user,
    });
})

// demand reset password page
router.get('/password',(req,res)=>{
    res.render('password');
})

// reset password page
router.get('/resetPassword/:token',(req,res)=>{
    User.findOne({ 
        resetPasswordToken: req.params.token, // looking for the reset token 
        resetPasswordExpires: { $gt: Date.now()} // expire greater than now
    }, (err, user) =>{
        if (!user){
            req.flash('error_msg', "Password reset token is invalid or has expired.")
            return res.redirect('/password');
        }
        res.render('resetPassword', {
            token: req.params.token,
        })
    });
})

///// POST Path /////
// request password reset
router.post('/password',(req,res)=>{
    // console.log(req.body);
    const {email} = req.body;
    let errors = [];
    let success_msg = [];

    if(!email) {
        errors.push({msg : "Please, enter your email"})
    }    

    if(errors.length > 0 ) {
        res.render('password', {
            user : req.user,
            page : '',
            errors : errors,
            email : email
        })
    } else { //validation passed
        User.findOne({email : email}).exec((err,result)=>{
            // console.log(result);   
            if(!result) {
                errors.push({msg: 'this email is not registered'});
                res.render('password', {
                    user : req.user,
                    page : '',
                    errors : errors,
                    email : email
                })
            } else { // send mail
                let user = result;
                // console.log(result);

                crypto.randomBytes(20, (err, buf) =>{
                    let token = buf.toString('hex');
                    console.log('token: '+token);

                    let expire = Date.now() + 1800000; // 30 minutes

                    // const transporter = nodemailer.createTransport({ // from mail, not working in localhost
                    //     service: 'Gmail',
                    //     auth:{
                    //         user: process.env.MAIL,
                    //         pass: process.env.PASS
                    //     }
                    // });

                    // let mailOptions = {
                    //     from:'FreshShop',
                    //     to: email,
                    //     subject: 'Password Reset',
                    //     text: 'Hello '+userName+','+'\n\n'+
                    //     'You recently requested to reset your password for your FreshShop account. Click the link below to reset it.'+'\n'+
                    //     'http://'+req.headers.host+'/resetPassword/'+token+'\n\n'+
                    //     'If you did not request a password reset, please ignore this email. This password reset is only valid for the next 30 minutes.'+'\n\n'+
                    //     'Thank you and stay FRESH!'
                    // }

                    // transporter.sendMail(mailOptions, (err, info)=>{
                    //     if (err){
                    //         // return console.log(err);
                    //     }
                    // });

                    const id = user._id;
                    dbUser.findByIdAndUpdate(id, { resetPasswordToken: token, resetPasswordExpires: expire}, err => { // add token to the user
                        if (err) return res.send(500, err);

                        success_msg.push('An e-mail has been sent to "'+email+'" with the confirmation link. Please, confirm password reset.')
                        res.render('password', {
                            success_msg: success_msg,
                            user : req.user,
                            email : email,
                            page : '',
                            sent : true
                        });
                    });
                });
            }
        })
    } 
});

// Change Password
router.post('/resetPassword/:token',(req,res)=>{
    const {password, password2} = req.body;
    let errors = [];
    const token = req.params.token;

    if(!password || !password2) {
        req.flash('error_msg','Please, fill in all fields.')
        return res.redirect(`/resetPassword/${token}`)
    }

    //check if match
    if(password !== password2) {
        req.flash('error_msg',"passwords don't match.")
        return res.redirect(`/resetPassword/${token}`)
    }

    //check if password is more than 6 characters
    if(password.length < 6 ) {
        req.flash('error_msg','password must be at least 6 characters.')
        return res.redirect(`/resetPassword/${token}`)
    }

    //validation passed
    bcrypt.genSalt(10,(err,salt) => bcrypt.hash(password,salt,(err,hash)=> {
        if(err) throw err;
        
        let hashedPassword = hash; //save pass to hash

        User.findOne({resetPasswordToken : token}).exec((err,result)=>{
            const id = result._id;

            dbUser.findByIdAndUpdate(id, { password: hashedPassword }, err => { // change the user's password
                if (err) return res.send(500, err);
                user.password = hashedPassword;
                req.flash('success_msg','Your password has been reset.')
                res.redirect('/users/login');
            });
        });
    }));
});

module.exports = router; 