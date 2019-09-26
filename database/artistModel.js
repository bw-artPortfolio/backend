const db = require('./dbConfig');
const knex = require('knex');

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

function remove(id) {
    
    console.log('likes')
    const likes = db('likes').where({artist: id}).del()
    console.log(likes)
    db('entries').where({artist: id}).del()
    console.log('artists')
    return db('artists').where({id}).del()
    
    // const likeRes = await db('likes').where({artist: id}).del();
    // const entRes = await db('entries').where({artist: id}).del(); 
    
    // await db('artists').where({id}).del();

    // return knex('likes').where({artist: id}).del()
    // .then(() => knex('entries').where({artist: id}).del())
    // .then(() => knex('artists').where({id}).del())
    
}

module.exports = {
    add,
    findBy,
    remove
};
