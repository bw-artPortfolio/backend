const db = require('./dbConfig');

function findBy(filter) {
    return db('artists').where(filter).first();
}

function add(artist) {
    return db('artists').insert(artist, 'id')
        .then(ids => {
            return db('artists')
                .where({id: ids[0]})
                .first();
            }
        );
}

function findAllLimited() {
    return db('artists').select('id', 'username');
}

module.exports = {
    add,
    findBy,
    findAllLimited
};
