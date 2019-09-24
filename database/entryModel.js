const db = require('./dbConfig');

function byUser(username_id) {
    return db('posts').where({ username_id });
}

module.exports = {
    byUser
};
