const express = require('express');
const router = express.Router();

router.get('/:id', (req, res) => {
    console.log(req.params.id);
    res.status(200).json({ route: req.url, recieved: req.body });
});

module.exports = router;
