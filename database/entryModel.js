const db = require('./dbConfig');

function findAll() {
    return db.select('posts.*', 'users.username')
        .from('posts')
        .leftJoin('users', 'users.id', 'posts.username_id')
        .orderBy('id');

}

function findBy(filter) {
    return db('posts').where(filter).first();
}

function add(post) {
    return db('posts').insert(post, 'id')
        .then( ids => {
            return db('posts')
                .where({id: ids[0]})
                .first();
        }
             );
}

function update(id, changes) {
    return db('posts')
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
    return db('posts')
        .where(id)
        .del();
}

function byUser(username_id) {
    return db('posts').where({ username_id });
}

module.exports = {
    findAll,
    findBy,
    add,
    update,
    remove,
    byUser
};
