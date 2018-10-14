
exports.up = function(knex, Promise) {
  return knex.schema.createTable('daily_uses', function(table) {
    table.increments();
    table.integer('total');
    table.integer('created_at');
  }).createTable('daily_materials_uses', function(table) {
    table.increments();
    table.integer('daily_use_id').references('daily_uses.id');
    table.integer('material_id');
    table.integer('nominal');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('daily_uses').dropTable('daily_materials_uses');
};
