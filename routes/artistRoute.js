const express = require('express');
const router = express.Router();

const artistsDb = require('../database/artistModel');
const entriesDb = require('../database/entryModel');

router.get('/:id', async (req, res) => {
    const artistId = req.params.id;
    try {
        const { id, username } = await artistsDb.findBy({ id: artistId });
        const userEntries = await entriesDb.byArtist(id);
        const strippedEntries = userEntries.map(({ id, url, title}) => {
            return {
                id,
                url,
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

router.get('/', async (req, res) => {
    try {
        const artists = await artistsDb.findAllLimited();
        res.status(200).json({ artists });
    } catch (err) {
        console.log(err);
        res.status(500).json({ errorMessage: 'failed to read from database' })
    }
});

module.exports = router;
