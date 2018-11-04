
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(table) {
    table.increments();
    table.string('name');
    table.integer('password');
    table.integer('role_id');
    table.boolean('deleted');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
