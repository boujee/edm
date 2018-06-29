const {ipcRenderer} = require('electron');

ipcRenderer.on('entries', (evt, entries) => {
  entries.forEach(e => {
    document.writeln('<h3>' + e.Name + '</h3>');
  });
});