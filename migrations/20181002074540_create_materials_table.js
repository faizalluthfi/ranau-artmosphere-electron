
exports.up = function(knex, Promise) {
  return knex.schema.createTable('materials', function(table) {
    table.increments();
    table.string('name');
    table.boolean('deleted');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('materials');
};
