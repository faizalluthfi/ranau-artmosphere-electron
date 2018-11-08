import { app, BrowserWindow, Tray, Menu, ipcMain, dialog, shell} from 'electron';
import * as url from 'url';
import * as path from 'path';
import * as isDev from 'electron-is-dev';
import { autoUpdater } from 'electron-updater';
import * as log from 'electron-log';
import * as AutoLaunch from 'auto-launch';
import * as fs from 'fs';
import * as knex from 'knex';

import * as printer from 'node-thermal-printer';
import * as targz from 'targz';
import * as rmdir from 'rmdir';
import * as excel from 'node-excel-export';

const appdir = __dirname;

const backupExtension = 'artmosphere.backup';

let packageJson = require('./package.json');

let iconPath = path.join(__dirname, 'assets', 'icons', 'png', '256x256.png');

// Debug environment
let env = process.env;
console.dir(env);
console.log(`App path is ${app.getAppPath()}`);

autoUpdater.logger = log;
autoUpdater.logger['transports'].file.level = 'info';

let printerPort;

printer.init({
  type: 'epson'
});

let initPrinter = port => {
  if(port != printerPort) {
    printerPort = port;
    printer.init({
      interface: port
    });
  }
};

let printNote = note => {
  printer.println(note);
  printer.cut();
  if(printerPort) {
    printer.execute(err => {
      if(err) {
        console.error('Print failed', err);
      } else {
        win.webContents.send('print-success');
        console.log('Print done');
      }
    });
  } else {
    win.webContents.send('no-printer-port');
  }
};

ipcMain.on( 'init-printer', ( e, arg ) => {
  initPrinter(arg);
});

ipcMain.on( 'test-printer', ( e, arg ) => {
  let oldPort = printerPort;
  initPrinter(arg.printerPath);
  if(arg.test) {
    printNote(arg.test);
  }
  initPrinter(oldPort);
});

ipcMain.on( 'print-note', ( e, arg ) => {
  printNote(arg);
});

ipcMain.on('print-to-pdf', function (event, args) {
  const win = BrowserWindow.fromWebContents(event.sender)
  dialog.showSaveDialog(win, {
    title: 'Save PDF',
    filters: [
      {
        name: `PDF (*.pdf)`,
        extensions: ['pdf']
      }
    ]
  }, filename => {
    if(filename) {
      // Use default printing options
      win.webContents.printToPDF(args || {}, function (error, data) {
        if (error) {
          throw error;
        }
        fs.writeFile(filename, data, function (error) {
          if (error) {
            throw error;
          }
          shell.openExternal('file://' + filename);
          win.webContents.send('print-to-pdf-success');
        })
      })
    } else {
      win.webContents.send('print-to-pdf-success');
    }
  });
});

let configdir  = app.getPath('appData');

let mkdir = dir => {
  if(fs.existsSync(dir)) {
    fs.stat(dir, (err, stats) => {
      if(stats.isFile()) app.quit();
    });
  } else {
    fs.mkdirSync(dir);
  }
}
const dbfile   = 'db.sqlite3';
const subpaths = ['com', 'faizalluthfi', 'artmosphere' + (isDev ? '.development' : '')];
subpaths.forEach(p => {
  configdir = path.join(configdir, p);
  mkdir(configdir);
});
const dbpath = path.join(configdir, dbfile);


const pathname = path.join(__dirname, 'html', 'index.html');

const loadApp = () => {
  win.loadFile(pathname);
}

if(isDev) {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
  });
} else {
  let autoLauncher;
  let autoLauncherOptions = {
    name: packageJson.productName
  };
  if (env.APPIMAGE) {
    autoLauncher = new AutoLaunch({
      name: autoLauncherOptions.name,
      path: env.APPIMAGE
    });
  } else {
    autoLauncher = new AutoLaunch(autoLauncherOptions);
  }

  autoLauncher.isEnabled()
    .then(function(isEnabled){
      if(isEnabled){
        return;
      }
      autoLauncher.enable();
    })
    .catch(function(err){
      // handle error
    });
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow;

// Global reference of tray object
let tray: Tray;

let makeSingleInstance = () => {
  app.on('second-instance', () => {
    if (win) {
      // Show application if minimized or hidden in tray and
      // same application is tried to be opened
      if (!win.isVisible()) showApplication();
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });
  return app.requestSingleInstanceLock();
}

let nullifyWindow = () => {
  win = null;
};

let hideApplication = () => {
  win.hide();
  setTrayMenu(false);
}

let showApplication = () => {
  win.show();
  setTrayMenu(true);
}

let setTrayMenu = (enableHideMenuItem = true) => {
  tray.setContextMenu(Menu.buildFromTemplate([
    {
      label: 'Munculkan Aplikasi',
      click: () => {
        showApplication();
      }
    },
    {
      enabled: enableHideMenuItem,
      label: 'Sembunyikan Aplikasi', click: function () {
        hideApplication();
      }
    },
    {
      label: 'Log Aplikasi', click: function () {
        win.webContents.openDevTools({mode: 'detach'});
      }
    },
    {
      label: 'Keluar', click: function () {
        win.webContents.send('quit-application');
      }
    }
  ]));
}

const knexConfig = {
  client: 'sqlite3',
  connection: {
    filename: dbpath
  },
  migrations: {
    directory: path.join(appdir, 'migrations')
  },
  seeds: {
    directory: path.join(appdir, 'seeds')
  },
  useNullAsDefault: true
};

let migrateDatabase = () => {
  let k = knex(knexConfig);
  k.migrate.latest()
    .then(function() {
      k.seed.run();
      createWindow();
    });
};

let backupData = (file) => {
  targz.compress({
    src: configdir,
    dest: file
  }, err => {
    if(err) {
      win.webContents.send('error', 'Backup failed.');
      console.log(err);
    } else {
      win.webContents.send('backup-succeed', file);
      console.log('Backup succeed.');
    }
  });
};

let restoreData = file => {
  if(!fs.existsSync(file)) {
    win.webContents.send('error', 'File does not exist.');
  } else if(fs.lstatSync(file).isDirectory()) {
    win.webContents.send('error', 'The selected is a folder.');
  } else {
    win.loadFile(path.join(__dirname, 'restoring.html'));
    rmdir(configdir, (err, dirs, files) => {
      mkdir(configdir);
      targz.decompress({
        src: file,
        dest: configdir
      }, err => {
        if(err) {
          console.log(err);
        } else {
          console.log('Restore done.');
          loadApp();
        }
      });
    });
  }
};

let createWindow = () => {
  // Create the browser window.
  createBrowserWindow();

  let shouldQuit = !makeSingleInstance();

  if (shouldQuit) {
    return app.quit();
  }

  // and load the index.html of the app.
  loadApp();

  ipcMain.on('export-to-excel', (e, args) => {
    const win = BrowserWindow.fromWebContents(e.sender)
    dialog.showSaveDialog(win, {
      title: 'Ekspor ke Excel',
      filters: [
        {
          name: `Microsoft Excel (*.xlsx)`,
          extensions: ['xlsx']
        }
      ]
    }, filename => {
      if(filename) {
        const excelExport = excel.buildExport([
          JSON.parse(args)
        ]);
        fs.writeFile(filename, excelExport, err => {
          if (err) throw err;
          else shell.openExternal('file://' + filename);
        });
      }
    });
  });

  ipcMain.on('show-application', (e, arg) => {
    showApplication();
  });
  ipcMain.on('quit-application', (e, arg) => {
    app['isQuiting'] = true;
    app.quit();
  });
  ipcMain.on('apply-update', (e, arg) => {
    app['isQuiting'] = true;
    autoUpdater.quitAndInstall();
  });

  // On backup and restore
  ipcMain.on( 'backup', ( e, options ) => {
    backupData(options);
  });
  ipcMain.on('restore', (e, file) => {
    restoreData(file);
  });

  // Open the DevTools if the current environment is development.
  if(isDev) {
    win.webContents.openDevTools()
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    nullifyWindow();
  })
}

let createBrowserWindow = () => {
  win = new BrowserWindow({ width: 800, height: 600, icon: iconPath, show: false })

  // Global variables
  global['autoUpdater'] = autoUpdater;
  global['iconPath'] = url.format({
    pathname: iconPath,
    protocol: 'file'
  });
  global['app'] = app;
  global['win'] = win;
  global['appdir'] = appdir;
  global['backupExtension'] = backupExtension;
  global['dialog'] = dialog;
  global['dbpath'] = dbpath;
  global['knexConfig'] = knexConfig;
  global['packageJson'] = packageJson;

  win.once('ready-to-show', () => {
    win.show();
    win.maximize();

    // Do not quit application by closing window
    win.on('close', event => {
      if (!(app['isQuiting'] || isDev)) {
        event.preventDefault();
        hideApplication();
        return false;
      }
      return true;
    });

    // Set tray after application is ready to show
    tray = new Tray(iconPath);
    tray.setToolTip(packageJson.productName);
    tray.on('click', event => {
      if (win.isVisible() && win.isFocused()) {
        hideApplication();
      } else {
        showApplication();
      }
    });
    setTrayMenu();
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', migrateDatabase);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

app.on('before-quit', () => {
  tray.destroy();
});