exports.seed = function(knex) {
  return knex('scheduled-rides').del()
    .then(function() {
      return knex('scheduled-rides').insert([
        {
          "day": "TUESDAY, JUNE 16",
          "description": "20 min HIIT Ride",
          "time": "3:15 PM"
        }
      ]);
    });
};
