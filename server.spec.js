const request = require('supertest');

const server = require('./api/server');

const db = require('./database/dbConfig');
const artistModel = require('./database/artistModel');
const entryModel = require('./database/entryModel');

describe('account route', () => {
    test('hello world', async () =>{
        const res = await request(server).get('/');

        expect(res.status).toEqual(200);
    });

});
