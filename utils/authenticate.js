const jwt = require('jsonwebtoken');
const secrets = require('../config/secrets');

function authenticate(req, res, next) {
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

module.exports = authenticate;