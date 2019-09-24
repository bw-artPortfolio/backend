
exports.up = function(knex) {
  return knex.schema.createTable('likes', tbl => {
    tbl.integer('user')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users');
    tbl.integer('post')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('posts');
    tbl.primary(['user', 'post']);
  });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('likes');
};
