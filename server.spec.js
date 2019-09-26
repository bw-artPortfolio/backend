const request = require('supertest');

const server = require('./api/server');

const db = require('./database/dbConfig');
const artistModel = require('./database/artistModel');
const entryModel = require('./database/entryModel');

describe('account route', () => {
    test('hello world', async () => {
        const res = await request(server).get('/');

        expect(res.status).toEqual(200);
    });

    test('register', async () => {
        const { artists: initArtists } = await request(server)
            .get('/api/artists');
        const res = await request(server)
            .post('/api/account/register')
            .send({
                username: "testone",
                password: "3141592"
            });
        const { artists } = await request(server)
            .get('/api/artists');

        expect(artists.length).toEqual(initArtists.length + 1);
        expect(artists.some(artist => {
            return artist.username === 'testone';
        })).toBeTruthy();
    });

});
