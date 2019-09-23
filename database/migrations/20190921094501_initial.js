exports.up = function(knex) {
    return knex.schema
  
      .createTable('users', (tbl) => {
          tbl.increments();
          tbl.string('username', 20).notNullable().unique();
          tbl.string('password', 56).notNullable();
      })
  
      .createTable('posts', (tbl) => {
          tbl.increments();
          tbl.integer('username_id')
              .unsigned()
              .notNullable()
              .references('id')
              .inTable('users')
              .onDelete("RESTRICT")
              .onUpdate("CASCADE");
          tbl.string('description')
          tbl.string('title', 26).notNullable();
          tbl.string('imgURL').notNullable();
          tbl.integer('votes').unsigned().defaultTo(0);
          
      })
  };
  
  exports.down = function(knex) {
      return knex.schema
          .dropTableIfExists('posts')
          .dropTableIfExists('users');
  };