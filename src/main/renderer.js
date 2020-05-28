const { ipcRenderer } = require('electron');

// Auto resize the page
ipcRenderer.on('resize', (event, data) => {
    console.log(data);
    document.querySelector('body').style.height = `${data.height}px`;
});
