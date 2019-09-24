const express = require('express');
const server = express();
server.use(express.json()); ////

const cors = require('cors');
server.use(cors());

// routes

server.use('/api/artists', require('../routes/artistRoute'));

//Sanity check
server.get('/', (req, res) => {
    res.status(200).send("Server is responding.");
});

//register and login are at the base level, should they be?

const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');
const artistModel = require('../database/artistModel');

server.post('/api/register', checkCreds, async (req, res) => {
    const { username, password } = req.body;
    const hash = bcrypt.hashSync(password, 10);
    const validUser = { username, password: hash };
    try {
        const addedUser = await artistModel.add(validUser);
        res.status(201).json({
            username: addedUser.username,
            id: addedUser.id
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            "errorMessage": "Registration failed. Server error. Try again."
        });
    }
});

server.post('/api/login', async (req, res) => {
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
        console.log(err);
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
        res.status(422).json({
            "message": "Missing required fields. Try again."
        });
    }
}

module.exports = server;
