
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('likes').del()
    .then(function () {
      // Inserts seed entries
      return knex('likes').insert([
          {user: 1, post: 2},
          {user: 2, post: 3},
          {user: 2, post: 4},
          {user: 3, post: 4},
          {user: 3, post: 5},
          {user: 3, post: 6},
          {user: 4, post: 5},
          {user: 4, post: 6},
          {user: 4, post: 7},
          {user: 4, post: 1},
          {user: 5, post: 6}
      ]);
    });
};
