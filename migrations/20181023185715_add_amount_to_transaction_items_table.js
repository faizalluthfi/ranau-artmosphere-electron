
exports.up = function(knex, Promise) {
  return knex.schema.table('transaction_items', function(table) {
    table.integer('amount');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('transaction_items', function(table) {
    table.dropColumn('amount');
  });
};
