
exports.up = function(knex, Promise) {
  return knex.schema.table('transactions', function(table) {
    table.integer('user_id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('transactions', function(table) {
    table.dropColumn('user_id');
  });
};
