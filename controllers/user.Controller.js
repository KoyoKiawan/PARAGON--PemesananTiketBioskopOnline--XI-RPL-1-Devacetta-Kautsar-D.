const models = require('../models');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Validator = require('fastest-validator');

const v = new Validator();

function signUp(req, res) {
    const user = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role || "user"
    };

    const schema = {
        username: { type: "string", optional: false, max: 100 },
        email: { type: "email", optional: false, max: 500 },
        password: { type: "string", optional: false, max: 20 },
        role: { type: "enum", values: ["admin", "user"], optional: true }
    };

    const validationResponse = v.validate(user, schema);
    if (validationResponse !== true) {
        return res.status(400).json({ message: "Validation failed", errors: validationResponse });
    }

    models.users.findOne({ where: { email: req.body.email } })
        .then(existingUser => {
            if (existingUser) {
                return res.status(409).json({ message: "Email already exists!" });
            }

            bcryptjs.genSalt(10, (err, salt) => {
                if (err) return res.status(500).json({ message: "Error generating salt", error: err });

                bcryptjs.hash(req.body.password, salt, (err, hash) => {
                    if (err) return res.status(500).json({ message: "Error hashing password", error: err });

                    const newUser = { username: req.body.username, email: req.body.email, password: hash, role:req.body.role || "user" };

                    models.users.create(newUser)
                        .then(() => res.status(201).json({ message: "User created successfully" }))
                        .catch(error => res.status(500).json({ message: "Something went wrong!", error }));
                });
            });
        })
        .catch(error => res.status(500).json({ message: "Something went wrong!", error }));
}

function login(req, res) {
    const user = {
        email: req.body.email,
        password: req.body.password
    };

    const schema = {
        email: { type: "email", optional: false, max: 500 },
        password: { type: "string", optional: false, max: 20 }
    };

    const validationResponse = v.validate(user, schema);
    if (validationResponse !== true) {
        return res.status(400).json({ success: false, message: "Validation failed", errors: validationResponse });
    }

    models.users.findOne({ where: { email: req.body.email } })
        .then(user => {
            if (!user) {
                return res.status(401).json({ success: false, message: "Invalid credentials!" });
            }

            bcryptjs.compare(req.body.password, user.password, (err, result) => {
                if (err) return res.status(500).json({ success: false, message: "Error comparing passwords", error: err });

                if (!result) return res.status(401).json({ success: false, message: "Invalid credentials!" });

                
                jwt.sign(
                    { email: user.email, id: user.id, role: user.role }, 
                    process.env.JWT_SECRET,
                    { expiresIn: "2h" },
                    (err, token) => {
                        if (err) {
                            return res.status(500).json({ success: false, message: "Token generation failed!", error: err });
                        }
                        res.status(200).json({ 
                            success: true, 
                            message: "Authentication successful!", 
                            token,
                            role: user.role,
                            name: user.username,
                            id: user.id,
                        });
                    }
                );
            });
        })
        .catch(error => res.status(500).json({ success: false, message: "Something went wrong!", error }));
}



module.exports = { signUp, login };
