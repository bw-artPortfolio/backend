const db = require('../../config/database/dbConfig');

function findBy(filter) {
    return db('users').where(filter).first();
}

function add(user) {
    console.log("in Model:");
    return db('users').insert(user, 'id')
        .then(ids => {
            return db('users')
                .where({id: ids[0]})
                .first();
            }
        );
}

module.exports = {
    add,
    findBy,
}