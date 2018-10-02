
exports.up = function(knex, Promise) {
  return knex.schema.createTable('categories', function(table) {
    table.increments();
    table.string('name');
    table.boolean('deleted');
  }).createTable('services', function(table) {
    table.increments();
    table.string('name');
    table.integer('price');
    table.integer('category_id').references('categories.id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('categories').dropTable('services');
};
