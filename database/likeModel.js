const db = require('./dbConfig');

async function getScore(entry){
    likesList = await db('likes').where({ entry });
    return likesList.length;
}

function getArtistsLikes(artist){
    return db('likes').select('entry').where({ artist });
}

function like(artist, entry) {
    return db('likes').insert({ artist, entry });
}

function unlike(artist, entry) {
    return db('likes').where({ artist, entry }).del();
}

module.exports = {
    getScore,
    getArtistsLikes,
    like,
    unlike
};
