
exports.up = function(knex, Promise) {
  return knex.schema.table('categories', function(table) {
    table.integer('report_category_id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('categories', function(table) {
    table.dropColumn('amount');
  });
};
