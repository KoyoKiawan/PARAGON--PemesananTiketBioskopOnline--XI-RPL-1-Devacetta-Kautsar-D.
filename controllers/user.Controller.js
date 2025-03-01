const models = require('../models');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Validator = require('fastest-validator');

const v = new Validator();

function signUp(req, res) {
    const user = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    };

    const schema = {
        username: { type: "string", optional: false, max: 100 },
        email: { type: "email", optional: false, max: 500 },
        password: { type: "string", optional: false, max: 20 }
    };

    const validationResponse = v.validate(user, schema);

    if (validationResponse !== true) {
        return res.status(400).json({
            message: "Validation failed",
            errors: validationResponse
        });
    }

    models.users.findOne({ where: { email: req.body.email } })
        .then(result => {
            if (result) {
                return res.status(409).json({ message: "Email already exists!" });
            }

            bcryptjs.genSalt(10, function (err, salt) {
                bcryptjs.hash(req.body.password, salt, function (err, hash) {
                    const newUser = {
                        username: req.body.username,
                        email: req.body.email,
                        password: hash
                    };

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
        return res.status(400).json({
            message: "Validation failed",
            errors: validationResponse
        });
    }

    models.users.findOne({ where: { email: req.body.email } })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: "Invalid credentials!" });
            }

            bcryptjs.compare(req.body.password, user.password, function (err, result) {
                if (!result) {
                    return res.status(401).json({ message: "Invalid credentials!" });
                }

                jwt.sign(
                    { email: user.email, userId: user.id },
                    process.env.JWT_KEY,
                    function (err, token) {
                        if (err) {
                            return res.status(500).json({ message: "Token generation failed!", error: err });
                        }
                        res.status(200).json({ message: "Authentication successful!", token });
                    }
                );
            });
        })
        .catch(error => res.status(500).json({ message: "Something went wrong!", error }));
}

module.exports = {
    signUp,
    login
};
