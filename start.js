const {app, BrowserWindow} = require('electron');

let window;

app.on('ready', () => {
  window = new BrowserWindow({width: 800, height: 600});
  window.on('closed', () => window = null);
  //window.setFullScreen(true);
});

app.on('window-all-closed', () => app.quit());

