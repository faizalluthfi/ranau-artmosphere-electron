
exports.seed = function(knex, Promise) {
  const table = 'materials';
  var count = 0;
  
  return knex(table).count('id AS total')
    .then(function(data) {
      count = parseInt(data[0].total);
    })
    .then(function () {
      // Inserts seed entries
      return count == 0 ? knex(table).insert([
        {id: 1, name: 'HVS'},
        {id: 2, name: 'Glossy'},
        {id: 3, name: 'ATK'},
        {id: 4, name: 'Ongkos Cetak/BBM'},
        {id: 5, name: 'Tinta'},
      ]) : true;
    });
};
