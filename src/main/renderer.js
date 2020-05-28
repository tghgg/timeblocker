const { ipcRenderer } = require('electron');

const HOURS_LIST = new Vue({
    el: '.hours-list',
    data: {
        hours: []
    }
});

// Init hours list
for (let i = 0; i < 24; i++) {
    HOURS_LIST.hours.push(i+1);
}

// Auto resize the page
ipcRenderer.on('resize', (event, data) => {
    document.querySelector('body').style.height = `${data}px`;
});
