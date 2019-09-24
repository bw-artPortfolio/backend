const express = require('express');
const router = express.Router();

const artists = require('../database/artistModel');
const entries = require('../database/entryModel');

router.get('/:id', async (req, res) => {
    const artistId = req.params.id;
    try {
        const { id, username } = await artists.findBy({ id: artistId });
        const userEntries = await entries.byUser(id);
        const { id: u, username_id, description, title, imgURL, votes} = userEntries;
        const strippedEntries = userEntries.map(({ id, imgURL, title}) => {
            return {
                id,
                url: imgURL,
                title
            };
        });
        res.status(200).json({
            id,
            username,
            entries: strippedEntries,
            likes: 'unimplemented for now'
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json(
            { message: 'failed to load artist info from database' }
        );
    }
});

module.exports = router;
