const express = require('express');
const router  = express.Router();
const {ensureAuthenticated} = require("../config/403.js");
const Product = require("../models/product.js");
const dbProduct = require("../models/product");
const user = require('../models/user.js');
const bcrypt = require('bcrypt');

///// GET Path /////

router.get('/product', ensureAuthenticated,(req,res)=>{
    if (req.user.admin === false){
        return res.redirect('/');
    }

    Product.find().exec((err,products)=>{
        console.log(products);
        res.render('product',{
            products: products,
            user: req.user,
            page: ''
        });
    });
});

router.get('/discount/:name', ensureAuthenticated,(req,res)=>{
    Product.findOne({name : req.params.name}).exec((err,product)=>{   
        const id = product._id;
        let discount = true;
        if (product.discount){
            discount = false
        }
        dbProduct.findByIdAndUpdate(id, { discount : discount }, err => { // update product's discount
            if (err) return res.send(500, err);
            res.redirect('/admin/product');
        });
    })
});
///// POST Path /////

router.post('/add',(req,res)=>{
    const {name,img,category, password} = req.body;
    let errors = [];

    if(!name || !img || !category || !password) {
        errors.push({msg : "Please, fill in all fields"})
    }

    if(errors.length > 0 ) {
        res.render('product', {
            user : req.user,
            errors : errors,
            name : name,
            img : img,
            category : category,
            password : password,
            page : ''
        })
    } else { //validation passed
        bcrypt.compare(password,req.user.password,(err,isMatch)=>{
            if(err) throw err;
    
            if(!isMatch) {
                errors.push({msg : "Password incorrect"});
                res.render('product', {
                    user : req.user,
                    errors : errors,
                    name : name,
                    img : img,
                    category : category,
                    password : password,
                    page : ''
                })
            } else {
                Product.findOne({name : name}).exec((err,product)=>{   
                    if(product) {
                        errors.push({msg: 'product already registered'});
                        res.render('product', {
                            errors : errors
                        })
                    } else {
                        const newProduct = new Product({
                            name : name,
                            img : img,
                            category : category
                        });
              
                        newProduct.save() //save user
                        .then((value) => {
                            console.log(value)
                            req.flash('success_msg','Product Registered!')
                            res.redirect('/admin/product');
                        })
                        .catch(value => console.log(value));
                    }
                })
            }
        })
    }
})

module.exports  = router;