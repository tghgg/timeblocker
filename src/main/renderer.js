const { ipcRenderer } = require('electron');

class Task {
    constructor (timeSpan, name, id) {
        this.timeSpan = timeSpan;
        this.name = name;
        this.id = id;
    }
}

const TASKS_LIST = new Vue({
    el: '.tasks',
    data: {
        tasks: [new Task('1 > 10', 'kill demons', '12355')]
    }
});

// Auto resize the page
ipcRenderer.on('resize', (event, data) => {
    document.querySelector('body').style.height = `${data}px`;
});
