
exports.up = function(knex, Promise) {
  return knex.schema.table('transactions', function(table) {
    table.integer('discount');
    table.integer('money_nominal');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('transactions', function(table) {
    table.dropColumn('discount');
    table.dropColumn('money_nominal');
  });
};
