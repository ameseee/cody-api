exports.up = function(knex) {
  return knex.schema.table('rides', table => {
    table.string('rideId')
  });
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('rides');
};
