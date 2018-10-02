const path = require('path');
const fs = require('fs');

var configdir = (process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + 'Library/Preferences' : process.env.HOME + '/.config'));
const subpaths = ['com', 'faizalluthfi', 'artmosphere'];

function makeSureFolderIsAvailable(dir) {
  if(fs.existsSync(dir)) {
    fs.stat(dir, function(err, stats) {
      if(stats.isFile()) app.quit();
    });
  } else {
    fs.mkdirSync(dir);
  }
}

subpaths.forEach(function(p) {
  configdir = path.join(configdir, p);
  makeSureFolderIsAvailable(configdir);
});

makeSureFolderIsAvailable(configdir + '.development');
makeSureFolderIsAvailable(configdir + '.staging');

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: configdir + '.development/db.sqlite3'
    },
    useNullAsDefault: true
  },

  staging: {
    client: 'sqlite3',
    connection: {
      filename: configdir + '.staging/db.sqlite3'
    },
    migrations: {
      tableName: 'knex_migrations'
    },
    useNullAsDefault: true
  },

  production: {
    client: 'sqlite3',
    connection: {
      filename: configdir + '/db.sqlite3'
    },
    migrations: {
      tableName: 'knex_migrations'
    },
    useNullAsDefault: true
  }

};