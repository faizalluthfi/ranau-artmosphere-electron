
exports.up = function(knex, Promise) {
  return knex.schema.createTable('transactions', function(table) {
    table.increments();
    table.integer('total');
    table.integer('created_at');
  }).createTable('transaction_items', function(table) {
    table.increments();
    table.integer('transaction_id').references('transactions.id');
    table.integer('service_id');
    table.boolean('deleted');
    table.integer('nominal');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('transactions').dropTable('transaction_items');
};
