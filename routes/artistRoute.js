const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');


const generateToken = require('../../config/auth/generateToken');

const authModel = require('./authModel');


module.exports = router;

router.post('/register', checkCreds, async (req, res) => {
    let user = req.body;
    const hash = bcrypt.hashSync(user.password, 10);
    user.password = hash;
    console.log(user);

    try {
        const addedUser = await authModel.add(user);
        res.status(201).json({username: addedUser.username, id: addedUser.id})
    }
    catch(err) {
        console.log(err);
        res.status(500).json({"errorMessage": "Registration failed. Server error. Try again."})
    }
})

router.post('/login', async (req, res) => {
    const {username, password} = req.body;

    try {
        const user = await authModel.findBy({username})
        if(user && bcrypt.compareSync(password, user.password)) {
            token = generateToken(user);
            res.status(200).json({username: user.username, id: user.id, token})
        }
        else {
            res.status(401).json({ message: 'Invalid Credentials' });
        }
    }
    catch {
        res.status(500).json({"errorMessage": "Server error. Try again."})
    }
})


//Middleware that ensures creds are given in register
function checkCreds(req, res, next) {
    const body = req.body;
    if(body.username && body.password) {
        next()
    }
    else {
        res.status(422).json({"message": "Missing required fields. Try again."});
    }
}


module.exports = router;