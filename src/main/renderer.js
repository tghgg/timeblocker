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
        tasks: []
    }
});

document.querySelector('.actions > button:first-child').addEventListener('click', (event) => {
    console.log('New task');
    ipcRenderer.send('ask-new-task');
});

// Auto resize the page
ipcRenderer.on('resize', (event, data) => {
    document.querySelector('body').style.height = `${data}px`;
});

// Temporarily do this on the front-end right now. Will migrate this to the back-end and store it in the filesystem.
ipcRenderer.on('create-task', (event, data) => {
    const CURRENT_TIME = new Date();
    // ID starts with 'task_' since HTML does not allow ID to start with a digit
    const ID = `task_${data.name}_${CURRENT_TIME.getFullYear()}${CURRENT_TIME.getMonth()}${CURRENT_TIME.getDate()}`;
    const NEW_TASK = new Task(data.timeSpan, data.name, ID);
    TASKS_LIST.tasks.push(NEW_TASK);
});