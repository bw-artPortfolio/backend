const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');


const generateToken = require('../../config/auth/generateToken');

const authModel = require('./authModel');


module.exports = router;

router.post('/register', checkCreds, checkDoubleCreds, async (req, res) => {
    let user = req.body;
    const hash = bcrypt.hashSync(user.password, 10);
    user.password = hash;
    console.log(user);

    try {
        const addedUser = await authModel.add(user);
        token = generateToken(addedUser);
        res.status(201).json({username: addedUser.username, id: addedUser.id, token})
    }
    catch {
        res.status(500).json({"errorMessage": "Server error. Try again."})
    }
})

router.post('/login', async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await authModel.findBy({email})
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
    if(body.username && body.email && body.password) {
        next()
    }
    else {
        res.status(422).json({"message": "Missing required fields. Try again."});
    }
}

async function checkDoubleCreds(req, res, next) {
    const {username, email}= req.body;

    try {
        let user1 = await authModel.findBy({username});
        let user2 = await authModel.findBy({email});

        if (user1 || user2) {
            res.status(405).json({errorMessage: "This info is already in the database - try again."})
        }
        else {
            next()
        }
    }
    catch {
        res.status(500).json({"errorMessage": "Server error."})
    }
}

module.exports = router;