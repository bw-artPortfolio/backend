exports.up = function(knex) {
    return knex.schema

        .createTable('artists', (tbl) => {
            tbl.increments();
            tbl.string('username', 20).notNullable().unique();
            tbl.string('password', 56).notNullable();
            tbl.string('email', 32).unique();
        })

        .createTable('entries', (tbl) => {
            tbl.increments();
            tbl.integer('artist')
                .unsigned()
                .notNullable()
                .references('id')
                .inTable('artists')
                .onDelete('CASCADE')
                .onUpdate('CASCADE')
            tbl.string('description');
            tbl.string('title', 26).notNullable();
            tbl.string('url').notNullable();
        })
        .createTable('likes', tbl => {
            tbl.integer('artist')
                .unsigned()
                .notNullable()
                .references('id')
                .inTable('artists')
                .onDelete('CASCADE')
                .onUpdate('CASCADE')
            tbl.integer('entry')
                .unsigned()
                .notNullable()
                .references('id')
                .inTable('entries')
                .onDelete('CASCADE')
                .onUpdate('CASCADE')
            tbl.primary(['artist', 'entry']);
        });

};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists('likes')
        .dropTableIfExists('entries')
        .dropTableIfExists('artists');
        
};
