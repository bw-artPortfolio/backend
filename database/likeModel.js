const db = require('./dbConfig');

async function getScore(post){
    likesList = await db('likes').where({ post });
    return likesList.length;
}

module.exports = {
    getScore
};