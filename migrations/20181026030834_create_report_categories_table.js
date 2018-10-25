
exports.up = function(knex, Promise) {
  return knex.schema.createTable('report_categories', function(table) {
    table.increments();
    table.string('name');
    table.integer('order_number');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('report_categories')
};
