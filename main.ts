import { app, BrowserWindow, Tray, Menu, ipcMain} from 'electron';
import * as url from 'url';
import * as path from 'path';
import * as isDev from 'electron-is-dev';
import { autoUpdater } from 'electron-updater';
import * as log from 'electron-log';
import * as AutoLaunch from 'auto-launch';
import * as fs from 'fs';
import * as knex from 'knex';
import * as printer from 'node-thermal-printer';

const appdir = __dirname;

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


const loadApp = () => {
  win.loadURL(url.format({
    pathname: isDev ? 'localhost:4200' : path.join(__dirname, 'html', 'index.html'),
    protocol: `${isDev ? 'http' : 'file'}:`,
    slashes: true
  }));
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
  knex(knexConfig).migrate.latest()
    .then(function() {
      createWindow();
    });
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

  ipcMain.on('show-application', (e, arg) => {
    showApplication();
  });
  ipcMain.on('quit-application', (e, arg) => {
    app['isQuiting'] = true;
    app.quit();
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
  global['dbpath'] = dbpath;
  global['knexConfig'] = knexConfig;

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