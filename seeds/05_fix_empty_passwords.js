
exports.seed = function(knex, Promise) {
  return knex('users')
    .whereNull('password')
    .update({
      password: 'password'
    });
};
