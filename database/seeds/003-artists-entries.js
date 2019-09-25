
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('likes').del()
    .then(function () {
      // Inserts seed entries
      return knex('likes').insert([
          {artist: 1, entry: 2},
          {artist: 2, entry: 3},
          {artist: 2, entry: 4},
          {artist: 3, entry: 4},
          {artist: 3, entry: 5},
          {artist: 3, entry: 6},
          {artist: 4, entry: 5},
          {artist: 4, entry: 6},
          {artist: 4, entry: 7},
          {artist: 4, entry: 1},
          {artist: 5, entry: 6}
      ]);
    });
};
