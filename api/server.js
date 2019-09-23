const express = require('express');
const server = express();
server.use(express.json());

const cors = require('cors');
server.use(cors());

//Routes

//Sanity check
server.get('/', (req, res) => {
    res.status(200).send("Server is responding.")
})


module.exports = server