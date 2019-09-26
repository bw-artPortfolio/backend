const cleaner = require('knex-cleaner');

exports.seed = function(knex) {
    return knex('likes').del()
        .then(() => knex('entries').del())
        .then(() => knex('artists').del())
};
