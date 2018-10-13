
exports.seed = function(knex, Promise) {
  const table = 'categories';
  var count = 0;

  return knex(table).count('id AS total')
    .then(function(data) {
      count = parseInt(data[0].total);
    })
    .then(function () {
      // Inserts seed entries
      return count == 0 ? knex(table).insert([
        {id: 1, name: 'Print & Fotokopi Warna'},
        {id: 2, name: 'Cetak Foto'},
        {id: 3, name: 'Pengetikan'},
        {id: 4, name: 'Scan'},
        {id: 5, name: 'Rental'},
        {id: 6, name: 'Nota HVS'},
        {id: 7, name: 'Nota NCR'},
        {id: 8, name: 'Brosur Bahan Art Paper'},
        {id: 9, name: 'Brosur Bahan HVS'},
        {id: 10, name: 'Banner'},
        {id: 11, name: 'Cetak Art Paper / Poster & Stiker'},
        {id: 12, name: 'Stempel'},
        {id: 13, name: 'Yasin'},
        {id: 14, name: 'Kartu Nama'},
        {id: 15, name: 'Mug'},
        {id: 16, name: 'Kop Surat'},
        {id: 17, name: 'Amplop'},
        {id: 18, name: 'Tas Bahan Art Paper'},
        {id: 19, name: 'Tas Bahan Kraf'},
        {id: 20, name: 'Jilid Hardcover'},
        {id: 21, name: 'Kartu Ucapan Terima Kasih / Piagam'},
      ]).then(function(categories_insert_result) {
        return knex('services').insert([
          {name: 'Print Hitam Putih', price: 500, category_id: 1, note: null},
          {name: 'Print Warna 10%', price: 800, category_id: 1, note: null},
          {name: 'Print Warna', price: 1000, category_id: 1, note: null},
          {name: 'Print Warna Gambar', price: 1500, category_id: 1, note: null},
          {name: 'Print Warna Full 75%', price: 2000, category_id: 1, note: null},
          {name: 'Print Warna Full Kertas 100%', price: 2500, category_id: 1, note: null},
          {name: 'Print Buffalo/BC', price: 3000, category_id: 1, note: null},
          {name: 'Print Buffalo/BC Kertas Sendiri ', price: 2500, category_id: 1, note: null},
          {name: 'Fotokopi Warna', price: 2500, category_id: 1, note: null},

          {name: 'Foto Ukuran 3x4', price: 500, category_id: 2, note: 'Minim 5 Foto'},
          {name: 'Foto Ukuran 4x6', price: 1000, category_id: 2, note: 'Minim 5 Foto'},
          {name: 'Foto Ukuran 3R', price: 2500, category_id: 2, note: null},
          {name: 'Foto Ukuran 4R', price: 4000, category_id: 2, note: null},
          {name: 'Foto Full Kertas A4', price: 6000, category_id: 2, note: null},

          {name: 'Ketik Biasa', price: 3000, category_id: 3, note: '1 Lembar A4/F4'},
          {name: 'Ketik Tabel & Angka', price: 4000, category_id: 3, note: '1 Lembar A4/F4'},

          {name: 'Scan', price: 3000, category_id: 4, note: null},
          {name: 'Scan + Edit', price: 4000, category_id: 4, note: null},

          {name: 'Rental Komputer', price: 2500, category_id: 5, note: '1 - 30 menit'},

          {name: '1 folio', price: 16000, category_id: 6, note: 10},
          {name: '1/2 folio', price: 8500, category_id: 6, note: 20},
          {name: '1/3 folio', price: 6000, category_id: 6, note: 30},
          {name: '1/4 folio', price: 4700, category_id: 6, note: 40},
          {name: '1/6 folio', price: 3300, category_id: 6, note: 60},
          {name: '1/8 folio', price: 2600, category_id: 6, note: 80},
          {name: '1/10 folio', price: 2200, category_id: 6, note: 100},

          {name: '1 folio rkp 2', price: 21000, category_id: 7, note: 10},
          {name: '1 folio rkp 3', price: 30000, category_id: 7, note: 10},
          {name: '1 folio rkp 4', price: 36000, category_id: 7, note: 10},
          {name: '1 folio rkp 5', price: 42000, category_id: 7, note: 10},
          {name: '1/2 folio rkp 2', price: 11500, category_id: 7, note: 20},
          {name: '1/2 folio rkp 3', price: 15500, category_id: 7, note: 20},
          {name: '1/2 folio rkp 4', price: 18500, category_id: 7, note: 20},
          {name: '1/2 folio rkp 5', price: 21500, category_id: 7, note: 20},
          {name: '1/3 folio rkp 2', price: 8000, category_id: 7, note: 30},
          {name: '1/3 folio rkp 3', price: 10500, category_id: 7, note: 30},
          {name: '1/3 folio rkp 4', price: 12500, category_id: 7, note: 30},
          {name: '1/3 folio rkp 5', price: 14500, category_id: 7, note: 30},
          {name: '1/4 folio rkp 2', price: 6250, category_id: 7, note: 40},
          {name: '1/4 folio rkp 3', price: 8000, category_id: 7, note: 40},
          {name: '1/4 folio rkp 4', price: 9500, category_id: 7, note: 40},
          {name: '1/4 folio rkp 5', price: 11000, category_id: 7, note: 40},
          {name: '1/6 folio rkp 2', price: 4300, category_id: 7, note: 60},
          {name: '1/6 folio rkp 3', price: 5500, category_id: 7, note: 60},
          {name: '1/6 folio rkp 4', price: 6500, category_id: 7, note: 60},
          {name: '1/6 folio rkp 5', price: 7500, category_id: 7, note: 60},
          {name: '1/8 folio rkp 2', price: 3300, category_id: 7, note: 80},
          {name: '1/8 folio rkp 3', price: 4300, category_id: 7, note: 80},
          {name: '1/8 folio rkp 4', price: 5100, category_id: 7, note: 80},
          {name: '1/8 folio rkp 5', price: 5800, category_id: 7, note: 80},
          {name: '1/10 folio rkp 2', price: 2800, category_id: 7, note: 100},
          {name: '1/10 folio rkp 3', price: 3500, category_id: 7, note: 100},
          {name: '1/10 folio rkp 4', price: 4100, category_id: 7, note: 100},
          {name: '1/10 folio rkp 5', price: 4700, category_id: 7, note: 100},

          {name: 'A6 (10x15)', price: 120000, category_id: 8, note: '500 Lembar'},
          {name: '1/3 A4 (10x20)', price: 160000, category_id: 8, note: '500 Lembar'},
          {name: 'A5 (15x20)', price: 230000, category_id: 8, note: '500 Lembar'},
          {name: 'A4 (21x29)', price: 380000, category_id: 8, note: '500 Lembar'},

          {name: 'Brosur HVS 1 rim', price: 120000, category_id: 9, note: '1 Warna (tambah warna 10.000) Maksimal 2 warna'},

          {name: 'Banner (bahan std)', price: 25000, category_id: 10, note: 'Permeter'},
          {name: 'Banner (bahan tebal)', price: 35000, category_id: 10, note: 'Permeter'},
          {name: 'Banner (bahan kain)', price: 35000, category_id: 10, note: 'Permeter'},
          {name: 'X-Banner', price: 130000, category_id: 10, note: 'Permeter'},

          {name: 'Stiker Bontax', price: 7000, category_id: 11, note: 'Ukuran A3+'},
          {name: 'Stiker Vinyl', price: 12000, category_id: 11, note: 'Ukuran A3+'},
          {name: 'Stiker Vinyl Transparan', price: 13000, category_id: 11, note: 'Ukuran A3+'},
          {name: 'AP 120', price: 6000, category_id: 11, note: 'Ukuran A3+'},
          {name: 'AP 150', price: 6000, category_id: 11, note: 'Ukuran A3+'},
          {name: 'AP 210', price: 7000, category_id: 11, note: 'Ukuran A3+'},
          {name: 'AP 230', price: 7000, category_id: 11, note: 'Ukuran A3+'},
          {name: 'AP 260', price: 7000, category_id: 11, note: 'Ukuran A3+'},
          {name: 'AP 310', price: 8000, category_id: 11, note: 'Ukuran A3+'},

          {name: 'Stempel Kayu', price: 45000, category_id: 12, note: 'Lebih dari 2 warna tambah 10.000 per warna'},
          {name: 'Stempel Flash/Tekan', price: 120000, category_id: 12, note: 'Lebih dari 2 warna tambah 10.000 per warna'},

          {name: 'Jasmine/Plasma', price: 11000, category_id: 13, note: '1 Pcs, sudah sama yasin'},
          {name: 'AP 210', price: 13000, category_id: 13, note: '2 Pcs, sudah sama yasin'},
          {name: 'Hard cover', price: 18000, category_id: 13, note: '3 Pcs, sudah sama yasin'},

          {name: '1 sisi', price: 30000, category_id: 14, note: '1 box (isi 100)'},
          {name: '2 sisi', price: 45000, category_id: 14, note: '1 box (isi 100)'},

          {name: '1-10 pcs', price: 27000, category_id: 15, note: null},
          {name: '2 sisi', price: 25000, category_id: 15, note: null},

          {name: 'Kop surat 1 warna', price: 120000, category_id: 16, note: 'Per rim (minim order 1 rim)'},
          {name: 'Kop surat 2 warna', price: 150000, category_id: 16, note: 'Per rim (minim order 1 rim)'},

          {name: '1 box (1 warna)', price: 60000, category_id: 17, note: 'Minim order 1 box'},
          {name: '1 box (2 warna)', price: 80000, category_id: 17, note: 'Minim order 1 box'},

          {name: 'Ukuran 20x25', price: 4500, category_id: 18, note: 'Tanpa laminasi (minim 100)'},
          {name: 'Ukuran 20x25', price: 5500, category_id: 18, note: 'Laminasi (minim 100)'},

          {name: 'Ukuran 20x25', price: 2800, category_id: 19, note: 'Minimal 100'},
          {name: 'Ukuran 20x19', price: 3000, category_id: 19, note: 'Minimal 100'},

          {name: 'Ukuran A4', price: 40000, category_id: 20, note: null},
          {name: 'Ukuran Folio', price: 350000, category_id: 20, note: 'Tebal 17 cm'},
          {name: 'Ukuran Folio', price: 275000, category_id: 20, note: 'Tebal 9 cm'},
          {name: 'Ukuran Folio', price: 200000, category_id: 20, note: 'Tebal 7 cm'},
          {name: 'Ukuran Folio', price: 150000, category_id: 20, note: 'Tebal di bawah 5 cm'},

          {name: 'Ukuran 1/2 A4', price: 1500, category_id: 21, note: 'Sudah dikasih nama'},
          {name: 'Ukuran 1/2 A5', price: 1250, category_id: 21, note: 'Tanpa nama/kosongan'},
        ])
      }) : true;
    });
};
