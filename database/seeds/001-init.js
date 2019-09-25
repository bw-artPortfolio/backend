exports.seed = function(knex) {
    // Deletes ALL existing entries
    return knex('users').del()
        .then(function() {
            // Inserts seed entries
            return knex('users').insert([{
                    username: 'alice',
                    password: 'swordfish'
                },
                {
                    username: 'bob',
                    password: 'swordfish'
                },
                {
                    username: 'charlie',
                    password: 'swordfish'
                },
                {
                    username: 'david',
                    password: 'swordfish'
                },
                {
                    username: 'eve',
                    password: 'swordfish'
                }
            ]);
        });
};