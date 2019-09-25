const express = require('express');
const server = express();
server.use(express.json()); ////

const cors = require('cors');
server.use(cors());

// routes
const authRouter = require('../routes/authRouter');
const enteriesRouter = require('../routes/entriesRouter');

server.use('/api/account', authRouter);
server.use('/api', enteriesRouter);
server.use('/api/artists', require('../routes/artistRoute'));

//Sanity check
server.get('/', (req, res) => {
    res.status(200).send("Server is responding.");
});

module.exports = server;
