const db = require('./dbConfig');

function findAll() {
    return db.select('entries.*', 'artists.username')
        .from('entries')
        .leftJoin('artists', 'artists.id', 'entries.artist')
        .orderBy('id');

}

function findBy(filter) {
    return db('entries').where(filter).first();
}

function add(entry) {
    return db('entries').insert(entry, 'id')
        .then( ids => {
            return db('entries')
                .where({id: ids[0]})
                .first();
        }
             );
}

function update(id, changes) {
    return db('entries')
        .where(id)
        .update(changes)
        .then(count => {
            if (count > 0)
                return findBy(id);
            else
                return null;
        });
}

function remove(id) {
    return db('entries')
        .where(id)
        .del();
}

function byArtist(artist) {
    return db('entries').where({ artist });
}

module.exports = {
    findAll,
    findBy,
    add,
    update,
    remove,
    byArtist
};
