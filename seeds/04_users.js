
exports.seed = function(knex, Promise) {
  const table = 'users';
  var count = 0;
  
  return knex(table).count('id AS total')
    .then(function(data) {
      count = parseInt(data[0].total);
    })
    .then(function () {
      // Inserts seed entries
      return count == 0 ? knex(table).insert([
        {id: 1, name: 'admin', password: 'admin', role_id: 1},
      ]).then(function() {
        return knex('transactions').whereNotNull('id').update({user_id: 1});
      }) : true;
    });
};
