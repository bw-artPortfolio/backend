const db = require('./dbConfig');

async function getScore(entry){
    likesList = await db('likes').where({ entry });
    return likesList.length;
}

function getArtistsLikes(artist){ 
    return db('likes').where({ artist })
}

module.exports = {
    getScore,
    getArtistsLikes
};