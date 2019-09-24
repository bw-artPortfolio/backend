const db = require('./dbConfig');

function byUser(username_id) {
    return db('entries').where({ username_id });
}
