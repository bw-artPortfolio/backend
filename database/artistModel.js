const db = require('./dbConfig');

function findBy(filter) {
    return db('artists').where(filter).first();
}

function add(artist) {
    console.log("in Model:");
    return db('artists').insert(artist, 'id')
        .then(ids => {
            return db('artists')
                .where({id: ids[0]})
                .first();
            }
        );
}

module.exports = {
    add,
    findBy,
};
