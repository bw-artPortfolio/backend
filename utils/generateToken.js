const jwt = require('jsonwebtoken');

const secrets = require('../config/secrets');



function generateToken(user) {

    const payload = {
      id: user.id,
      username: user.username
    };


    const options = {
      expiresIn: '1d',
    };

    return jwt.sign(payload, secrets.jwtSecret, options);
  }

  module.exports = generateToken;
