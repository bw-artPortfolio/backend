const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const secrets = require('../config/secrets');

const entryModel = require('../database/entryModel');
const likeModel = require('../database/likeModel');

//Tested
router.get('/entries', async (req, res) => {
    try {
        const entries = await entryModel.findAll();
        formatted = entries.map(entry => {
            return {
                id: entry.id,
                url: entry.url,
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

router.post('/entries/:id/like', checkCreds, async (req, res) => {
    const artistId = req.user.id;
    const entryId = req.params.id;

    try {
        const dbRes = await likeModel.like(artistId, entryId);
        res.status(202).json({ message: `user has liked art entry ${entryId}`});
    } catch (err) {
        console.log(err);
        res.status(500).json({errorMessage: 'failed to write to database'});
    }
});

router.delete('/entries/:id/like', checkCreds, async (req, res) => {
    console.log(req.user)
    const artistId = req.user.id;
    const entryId = req.params.id;

    try {
        const entry = await entryModel.findBy({ id: entryId });
        const dbRes = await likeModel.unlike(artistId, entryId);
        res.status(204).json({message: `user no longer likes art entry ${entryId}`});
    } catch (err) {
        console.log(err);
        res.status(500).json({errorMessage: 'failed to write to database'});
    }
});

//Tested
router.get('/entries/:id', async (req, res) => {
    const {id} = req.params;
    try {
        const entry = await entryModel.findBy({id});
        if(entry) {
            const score = await likeModel.getScore(id);
            const formatted = {
                id: entry.id,
                url: entry.url,
                artistName: entry.username,
                artistId: entry.artist,
                title: entry.title,
                description: entry.description,
                score
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


//Tested
router.put('/entries/:id', checkCreds, async (req, res) => {

    const {id} = req.params;
    const changes = req.body;
    const user = req.user;

    // if(changes.id || changes.id) {
    //     res.status(403).json({errorMessage: "Not allowed to change ids" })
    // }

    if(!changes.description && !changes.url && !changes.title) {
        res.status(400).json({errorMessage: "No field to update"})
    }

    try {
        const entry = await entryModel.findBy({id})
        console.log('user', user)
        console.log('entry', entry)

        if(entry) {
            if(entry.artist === user.id) {
                try {
                    const modifiedEntry = await entryModel.update({id}, changes)
                    if(modifiedEntry) {
                        res.status(202).json(modifiedEntry)
                    }
                    else {
                        res.status(500).json({errorMessage: 'entry to update not found'});
                    }
                }
                catch (err) {
                    res.status(500).json({errorMessage: "There was a problem updating the entry"});
                }
            }
            else {
                res.status(403).json({errorMessage: "Not allowed to update"});
            }
        }
        else {
            res.status(404).json({errorMessage: 'Entry not found'});
        }
    }
    catch (err) {
        res.status(500).json({message: "There was a problem finding the entry"});
    }

});
    //Tested
router.post('/entries', validateEntryInfo, checkCreds, async (req, res) => {
    const given = req.body;
    let entry = { url: given.url, artist: req.user.id };
    if (given.description) {
        entry.description = given.description;
    }
    if (given.title) {
        entry.title = given.title;
    }

    try {
        const newEntry = await entryModel.add(entry, 'id');
        res.status(201).json({ id: newEntry.id });
    }
    catch(err) {
        console.log(err)
        res.status(500).json({"errorMessage": "Encountered issue adding your entry"})
    }
})

//Tested
router.delete('/entries/:id', checkCreds, async (req, res) => {

    const {id} = req.params;
    const usernameId = req.user.id;

    try {
        const entry = await entryModel.findBy({id});

        if (entry) {
            if(entry.artist === usernameId) {
                try {
                    const count = await entryModel.remove(id);
                    if(count>0) {
                        res.status(204).json({message: `${count} entry(s) deleted`})
                    }
                    else {
                        res.status(500).json({errorMessage: 'Entry does not exist'});
                    }
                }
                catch (err) {
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
    catch (err) {
        res.status(500).json({message: "There was a problem finding the entry"});
    }
});



//Middleware to validate if entry info is existing
function validateEntryInfo(req, res, next) {
    const entry = req.body;
    if(entry.url) {
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
                req.user = {id: decodedToken.id, username: decodedToken.username }
                next();
            }
        })
    }
    else {
        res.status(400).json({ message: 'No token provided' });
    }
}

module.exports = router;
