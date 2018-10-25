
exports.seed = function(knex, Promise) {
  const table = 'report_categories';
  var count = 0;

  return knex(table).count('id AS total')
    .then(function(data) {
      count = parseInt(data[0].total);
    })
    .then(function () {
      // Inserts seed entries
      return count == 0 ? knex(table).insert([
        {id: 1, name: 'Print / Fotokopi'},
        {id: 2, name: 'Foto / Banner'},
        {id: 3, name: 'Nota / Brosur'},
        {id: 4, name: 'Stempel'},
        {id: 5, name: 'Lain-Lain'},
      ]).then(function(report_categories_insert_result) {
        return knex('categories').where('id', 1).update({report_category_id: 1})
          .then(function() {
            return knex('categories').whereIn('id', [2, 10]).update({report_category_id: 2})
              .then(function() {
                return knex('categories').whereIn('id', [6, 7, 8, 9]).update({report_category_id: 3})
                  .then(function() {
                    return knex('categories').where('id', 12).update({report_category_id: 4})
                      .then(function() {
                        return knex('categories').whereNull('report_category_id').update({report_category_id: 5})
                      });
                  });
              });
          });
      }) : true;
    });
};
