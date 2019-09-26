const express = require('express');
const router = express.Router();


const entryModel = require('../database/entryModel');

//Auth middleware
const authenticate = require('../utils/authenticate');

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

//Tested
router.get('/entries/:id', async (req, res) => {
    const {id} = req.params;
    try {
        const entry = await entryModel.findBy({id});
        if(entry) {
            const formatted = {
                id: entry.id,
                url: entry.url,
                artistName: entry.username,
                artistId: entry.artist,
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


//Tested
router.put('/entries/:id', authenticate, async (req, res) => {

    const {id} = req.params;
    const changes = req.body;
    const user = req.user;
    console.log(user)

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
router.post('/entries', validateEntryInfo, authenticate, async (req, res) => {
    const entry = {
        artist: req.user.id,
        url: req.body.url,
        description: req.body.description,
        title: req.body.title,
    }

    try {
        const newEntry = await entryModel.add(entry, 'id');
        res.status(201).json({newEntry});
    }
    catch(err) {
        console.log(err)
        res.status(500).json({"errorMessage": "Encountered issue adding your entry"})
    }
})

//Tested
router.delete('/entries/:id', authenticate, async (req, res) => {

    const {id} = req.params;
    const usernameId = req.user.id;

    try {
        const entry = await entryModel.findBy({id})

        if (entry) {
            if(entry.artist === usernameId) {
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
    if( entry.url && entry.description && entry.title) {
        next();
    }
    else {
        res.status(422).json({"errorMessage": "Missing entry info"});
    }
}



module.exports = router;
