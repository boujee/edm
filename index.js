const {app, ipcMain, BrowserWindow} = require('electron');
const ini = require('ini');
const glob_ = require('glob');
const fs = require('fs');

const glob = path => new Promise((resolve, reject) => glob_(path, {}, (err, files) => {
  if (err) reject(err);
  else resolve(files);
}));

const readFile = path => new Promise((resolve, reject) => fs.readFile(path, 'utf8', (err, data) => {
  if (err) reject(err);
  else resolve(data);
}));

//:: () -> Promise [Object]
const fetchDesktopEntries = () => 
  Promise.all(['/usr/share/xsessions/*.desktop'].map(glob))
    .then(values => values.reduce((acc, cur) => acc.concat(cur), []))
    .then(values => Promise.all(values.map(readFile)))
    .then(values => values.map(ini.parse))
    .then(values => values.filter(it => !!it))
    .then(values => values.map(it => it['Desktop Entry']));

let window;

app.on('ready', () => {
  window = new BrowserWindow({width: 800, height: 600});
  window.on('closed', () => window = null);
  window.loadFile('index.html');
  window.webContents.on('dom-ready', () => {
    fetchDesktopEntries()
      .then(values => window.webContents.send('entries', values));
  });
});

app.on('window-all-closed', () => app.quit());