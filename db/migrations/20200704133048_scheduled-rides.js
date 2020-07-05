exports.up = function(knex) {
    return knex.schema
      .createTable('scheduled-rides', function(table) {
        table.increments('id').primary();
        table.string('description');
        table.string('time');
        table.string('day');

        table.timestamps(true, true);
      })
  };
  
  exports.down = function(knex) {
    return knex.schema
      .dropTable('scheduled-rides');
  };
  