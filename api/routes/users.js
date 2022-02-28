const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

router.post('/signup', (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if(user.length){
            res.status(500).json({
                message: "Mail Exists"
            })
        }else{
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err){
                    res.status(500).json({
                        message: "Signup unsuccessfull"
                    })
                }else{
                    const info = {
                        _id: mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    }
                    const user = new User(info);
                    user.save()
                    .then(result => res.status(200).json(result))
                    .catch(err => res.status(500).json(err));
                }
            })
        }
    })
    .catch(err => res.status(500).json(err));
})

router.post('signin', (req, res, next) => {
    User.findOne({email: req.body.email})
    .exec()
    .then(user => {
        if(!user){
            res.status(500).json({
                message: "Failed"
            })
        }else{
            bcrypt.compare(req.body.password, user .password, (err, result) => {
                if(err){
                    res.status(500).json({
                        message: "Auth Failed"
                    })
                }
                if(result){
                    const token = jwt.sign({id: user._id}, `${process.env.JWT_KEY}`, {
                        expiresIn: 3600
                    });
                    res.status(200).json({
                        message: "Auth Success",
                        token: token
                    })
                }
                else{
                    res.status(500).json({
                        message: "Auth Failed"
                    })
                }
            })
        }
    })
    .catch(err => res.status(500).json({
        message: "fail"
    }));
})

module.exports = router;