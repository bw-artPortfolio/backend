exports.up = function(knex) {
    return knex.schema

        .createTable('artists', (tbl) => {
            tbl.increments();
            tbl.string('username', 20).notNullable().unique();
            tbl.string('password').notNullable();
            tbl.string('email', 32).unique();
        })

        .createTable('entries', (tbl) => {
            tbl.increments();
            tbl.integer('artist')
                .unsigned()
                .notNullable()
                .references('id')
                .inTable('artists');
            tbl.string('description');
            tbl.string('title', 26).notNullable();
            tbl.string('url').notNullable();
        })
        .createTable('likes', tbl => {
            tbl.integer('artist')
                .unsigned()
                .notNullable()
                .references('id')
                .inTable('artists');
            tbl.integer('entry')
                .unsigned()
                .notNullable()
                .references('id')
                .inTable('entries');
            tbl.primary(['artist', 'entry']);
        });

};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists('artists')
        .dropTableIfExists('entries')
        .dropTableIfExists('likes');
};
