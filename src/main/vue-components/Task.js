/* Task */

'use strict';

Vue.component('task', {
  props: ['timespan', 'name', 'id'],
  data: function () {
    return {
      startTime: this.timespan.start,
      endTime: this.timespan.end,
      taskName: this.name
    };
  },
  template: `<div class="task" :id="id" v-on:contextmenu="removeTask($event)">
  <div class="taskTime">
    <button v-on:click="editTaskTimespan">{{ startTime }} > {{ endTime }}</button>
  </div>
  <div class="taskInfo">
    <button v-on:click="editTaskName">{{ taskName }}</button>
  <div class="taskState">
    <button v-on:click="completeTask">X</button>
  </div></div></div>`,
  methods: {
    completeTask: function () {
      ipcRenderer.send('complete-task', this.id);

      // Hightlight with green
      document.getElementById(this.id).style['background-color'] = 'rgb(55, 207, 93)';
      document.getElementById(this.id).style['border-color'] = 'rgb(55, 207, 93)';
      document.querySelector(`#${this.id} > div > button`).disabled = true;
      document.querySelector(`#${this.id} > .taskInfo > .taskState`).style['background-color'] = 'rgb(55, 207, 93)';
      document.querySelector(`#${this.id} > .taskInfo > .taskState > button`).textContent = 'Done!';

      setTimeout(() => {
        for (let i = 0; i < TASKS_LIST.tasks.length; i++) {
          if (TASKS_LIST.tasks[i].id === this.id) {
            TASKS_LIST.tasks.splice(i, 1);
            return;
          }
        }
      }, 100);
    },
    removeTask: function (event) {
      event.preventDefault();
      ipcRenderer.send('ask-remove-task', { id: this.id, name: this.name });
    },
    editTaskName: function () {
      document.querySelector(`#${this.id} > div > button`).disabled = true;

      // Ask for the new name
      // Change the name on Main response
      ipcRenderer.invoke('edit-task-name', { id: this.id, name: this.taskName }).then((newName) => {
        this.taskName = newName;
        document.querySelector(`#${this.id} > div > button`).disabled = false;
      });
    },
    editTaskTimespan: function () {
      ipcRenderer.send('edit-task-timespan', { id: this.id, name: this.name });
    }
  }
});
