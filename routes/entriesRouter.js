const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const secrets = require('../config/secrets');

const entryModel = require('../database/entryModel');

/*
  "id": 1,
  "username_id": 1,
  "description": "dangerous activity window mix periodic word noise squirrel voyage",
  "title": "Hippo",
  "imgURL": "https://cdna.artstation.com/p/assets/images/images/013/855/676/large/guodong-zhao-7.jpg",
  "votes": 0,
  "username": "alice"
*/


router.get('/entries', async (req, res) => {
    try {
        const entries = await entryModel.findAll();
        formatted = entries.map(entry => {
            return {
                id: entry.id,
                url: entry.imgURL,
                artistName: entry.username,
                title: entry.title
            };
        });
        res.status(200).json({ entries: formatted });
    }
    catch (err) {
        res.status(500).json({errorMessage: "There was a problem getting the data"});
    }
});


router.get('/entries/:id', async (req, res) => {
    const {id} = req.params;
    try {
        const entry = await entryModel.findBy({id});
        if(entry) {
            const formatted = {
                id: entry.id,
                url: entry.imgURL,
                artistName: entry.username,
                artistId: entry.username_id,
                title: entry.title,
                description: entry.description,
                score: "unimplemented for now"
            };
            res.status(200).json(formatted);
        }
        else {
            res.status(404).json({message:'entry not found'});
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({errorMessage: "There was a problem getting the data"});
    }
});



router.put('/entries/:id', checkCreds, async (req, res) => {

    const {id} = req.params;
    const changes = req.body;
    const usernameId = req.user.username_id;

    if(changes.id || changes.username_id) {
        res.status(403).json({errorMessage: "Not allowed to change ids" })
    }

    if(!changes.description && !changes.imgURL && !changes.title && !changes.category && !timestamp) {
        res.status(400).json({errorMessage: "No field to update"})
    }

    try {
        const entry = await entryModel.findBy({id})

        if(entry) {
            if(entry.username_id === usernameId) {
                try {
                    const modifiedEntry = await entryModel.update({id}, changes)
                    if(modifiedEntry) {
                        res.status(200).json(modifiedEntry)
                    }
                    else {
                        res.status(500).json({errorMessage: 'entry to update not found'});
                    }
                }
                catch {
                    res.status(500).json({errorMessage: "There was a problem updating the entry"});
                }
            }
            else {
                res.status(403).json("errorMessage: Not allowed to update")
            }
        }
        else {
            res.status(404).json({errorMessage: 'Entry not found'});
        }
    }
    catch {
        res.status(500).json({message: "There was a problem finding the entry"});
    }

})

router.post('/entries', validateEntryInfo, checkCreds, async (req, res) => {
    const entry = {
        username_id: req.user.username_id,
        imgURL: req.body.imgURL,
        description: req.body.description,
        title: req.body.title,
        category: req.body.category,
        timestamp: req.body.timestamp,
        votes: 0
    }

    try {
        const newEntry = await entryModel.add(entry, 'id');
        res.status(201).json({newEntry});
    }
    catch {
        res.status(500).json({"errorMessage": "Encountered issue adding your entry"})
    }
})


router.delete('/entries/:id', checkCreds, async (req, res) => {

    const {id} = req.params;
    const usernameId = req.user.username_id;

    try {
        const entry = await entryModel.findBy({id})

        if (entry) {
            if(entry.username_id === usernameId) {
                try {
                    const count = await entryModel.remove({id})
                    if(count>0) {
                        res.status(200).json({message: `${count} entry(s) deleted`})
                    }
                    else {
                        res.status(500).json({errorMessage: 'Entry does not exist'});
                    }
                }
                catch {
                    res.status(500).json({errorMessage: "Encountered issue deleting the entry"});
                }
            }
            else {
                res.status(403).json("errorMessage: Unable to delete")
            }
        }
        else {
            res.status(404).json({errorMessage: 'Entry does not exist'});
        }
    }
    catch {
        res.status(500).json({message: "There was a problem finding the entry"});
    }
});



//Middleware to validate if entry info is existing
function validateEntryInfo(req, res, next) {
    const entry = req.body;
    if(entry.description && entry.imgURL && entry.title && entry.category && entry.timestamp) {
        next();
    }
    else {
        res.status(422).json({"errorMessage": "Missing entry info"});
    }
}

//Middleware to check if user is logged in
function checkCreds(req, res, next) {
    const token = req.headers.authorization;

    if(token) {
        jwt.verify(token, secrets.jwtSecret, (err, decodedToken) => {
            if(err) {
                res.status(401).json({ message: 'Invalid Credentials' });
            }
            else {
                req.user = {username_id: decodedToken.username_id, username: decodedToken.username }
                next();
            }
        })
    }
    else {
        res.status(400).json({ message: 'No token provided' });
    }
}

module.exports = router;
