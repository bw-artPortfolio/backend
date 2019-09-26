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

    test('session', async () => {
        const url = "https://i.redd.it/mmh514srunj31.png";

        const initEntriesGet = await request(server).get('/api/entries');
        const initEntries = initEntriesGet.body.entries;

        const leftover = initEntries.find(entry => entry.url === url);

        // login
        const loginRes = await request(server).post('/api/account/login')
              .send({
                  username: 'alice',
                  password: 'swordfish'
              });
        const token = loginRes.body.token;

        // create entry
        if (!leftover) {
            const entryRes = await request(server).post('/api/entries')
                  .send({
                      artistId: 8,
                      url,
                      title: "fear"
                  })
                  .set('authorization', token);
        }

        // read all entries
        const entriesRes = await request(server).get('/api/entries');
        const entries = entriesRes.body.entries;
        const entry = entries.find(entry => entry.url === url);
        const correctId = entry.id;

        // delete entry
        const delEntryRes = await request(server).delete(`/api/entries/${correctId}`)
              .set('authorization', token);

        const finalEntriesRes = await request(server).get('/api/entries');
        const finalEntries = finalEntriesRes.body.entries;

        expect(entries.some(entry => entry.url === url)).toBeTruthy();
        expect(entriesRes.status).toEqual(200);
        expect(delEntryRes.status).toEqual(204);

    });

    // test('register', async () => {
    //     const { artists: initArtists } = await request(server)
    //         .get('/api/artists');
    //     const res = await request(server)
    //         .post('/api/account/register')
    //         .send({
    //             username: "testone",
    //             password: "3141592"
    //         });
    //     const { artists } = await request(server)
    //         .get('/api/artists');

    //     expect(artists.length).toEqual(initArtists.length + 1);
    //     expect(artists.some(artist => {
    //         return artist.username === 'testone';
    //     })).toBeTruthy();
    // });

});
