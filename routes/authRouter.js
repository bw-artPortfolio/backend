//This route contains functionality for Login, Register & Delete Account

const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');
const artistModel = require('../database/artistModel');

//Registration

router.post('/register', checkCreds, async (req, res) => {
    const { username, password, email } = req.body;
    const hash = bcrypt.hashSync(password, 10);
    const validUser = { username, password: hash, email };
    try {
        console.log("Registration successful @", Date.now())
        const addedUser = await artistModel.add(validUser);
        res.status(201).json({
            username: addedUser.username,
            id: addedUser.id,
            email: addedUser.email
        });
    } catch (err) {
        console.warn(err);
        res.status(500).json({
            "errorMessage": "Registration failed. Server error. Try again."
        });
    }
});

//Login

router.post('/login', async (req, res) => {
    const {
        username,
        password
    } = req.body;

    try {
        const user = await artistModel.findBy({
            username
        });
        if (user && bcrypt.compareSync(password, user.password)) {
            token = generateToken(user);
            console.log("Login successful @", Date.now())
            res.status(200).json({
                username: user.username,
                id: user.id,
                token
            });
        } else {
            res.status(401).json({
                message: 'Invalid Credentials'
            });
        }
    } catch (err) {
        console.warn(err);
        res.status(500).json({
            "errorMessage": "Server error. Try again."
        });
    }
});

//Middleware that ensures creds are given in register

function checkCreds(req, res, next) {
    const body = req.body;
    if (body.username && body.password) {
        next()
    } else {
        console.warn('MIDDLEWARE FAILURE - "checkCreds"')
        res.status(422).json({
            "message": "Missing required fields. Try again."
        });
    }
}

module.exports = router;