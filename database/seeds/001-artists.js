const bcrypt = require('bcryptjs');

const password = bcrypt.hashSync('swordfish', 4)

exports.seed = function(knex) {
    // Deletes ALL existing entries
    return knex('artists').del()
        .then(function() {
            // Inserts seed entries
            return knex('artists').insert([{
                    username: 'alice',
                    password
                },
                {
                    username: 'bob',
                    password
                },
                {
                    username: 'charlie',
                    password
                },
                {
                    username: 'david',
                    password
                },
                {
                    username: 'eve',
                    password
                }
            ]);
        });
};
