const express = require('express');
const router = express.Router();

const artists = require('../database/artistModel');
const entries = require('../database/entryModel');

router.get('/:id', async (req, res) => {
    try {
        const { id, username } = await artists.findBy({ id });
        const userEntries = await entries.byUser(id);
        const { id: u, username_id, description, title, imgURL, votes} = userEntries;
        const strippedEntries = userEntries.map(e => {
            const { id, }
            return 
        });
    }
    catch (err) {
        res.status(500).json(
            { message: 'failed to load artist info from database'}
        );
    }
    artists.findBy({ id })
        .then(artist => {
            const { id, username } = artist;
            res.status(200).json();
        })
        .catch();
    res.status(200).json({ route: req.url, recieved: req.body });
});

module.exports = router;
