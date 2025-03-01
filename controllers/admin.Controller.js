const models = require('../models');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Validator = require('fastest-validator');

const v = new Validator();

function signUp(req, res){
    
    
    models.admins.findOne({where:{username:req.body.username}}).then(result => {
        if(result){
            res.status(409).json({
                message: "Username already exists!",
            });
        }else{
            bcryptjs.genSalt(10, function(err, salt){
                bcryptjs.hash(req.body.password, salt, function(err, hash){
                    const admins = {
                        username: req.body.username,
                        password: hash
                    }
                
                    models.admins.create(admins).then(result => {
                        res.status(201).json({
                            message: "User created successfully",
                        });
                    }).catch(error => {
                        console.log(error);
                        res.status(500).json({
                            message: "Something went wrong!",
                        });
                    });
                });
            });
        }
    }).catch(error => {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong!",
        });
    });
}


function login(req, res){

    const user = {
        username: req.body.username,
        password: req.body.password
    };

    // Validator schema for login
    const schema = {
        username: { type: "string", optional: false, max: 500 },
        password: { type: "string", optional: false, max: 20 }
    };

    const validationResponse = v.validate(user, schema);

    if (validationResponse !== true) {
        return res.status(400).json({
            message: "Validation failed",
            errors: validationResponse
        });
    }

    models.admins.findOne({where:{username: req.body.username}}).then(user => {
        if(user === null){
            res.status(401).json({
                message: "Invalid credentials!",
            });
        }else{
            bcryptjs.compare(req.body.password, user.password, function(err, result){
                if(result){
                    const token = jwt.sign({
                        username: user.username,
                        role: 'admin',
                        
                    }, process.env.JWT_KEY,{expiresIn: '1h'}, function(err, token){
                        res.status(200).json({
                            message: "Authentication successful!",
                            token: token
                        });
                    });
                }else{
                    res.status(401).json({
                        message: "Invalid credentials!",
                    });
                }
            });
        }
    }).catch(error => {
        res.status(500).json({
            message: "Something went wrong!",
        });
    });
}


module.exports = {
    signUp: signUp,
    login: login
} 