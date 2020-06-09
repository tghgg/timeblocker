/* Task */

'use strict';

Vue.component('task', {
  props: ['timespan', 'name', 'id'],
  template: '<div class="task" :id="id" v-on:contextmenu="removeTask($event)"><div class="taskTime"><button v-on:click="editTaskTimespan">{{ timespan }}</button></div><div class="taskInfo"><button v-on:click="editTaskName">{{ name }}</button><div class="taskState"><button v-on:click="completeTask">X</button></div></div></div>',
  methods: {
    completeTask: function () {
      ipcRenderer.send('complete-task', this.id);

      // Hightlight with green
      document.getElementById(this.id).style['background-color'] = 'rgb(55, 207, 93)';
      document.getElementById(this.id).style['border-color'] = 'rgb(55, 207, 93)';
      document.querySelector(`#${this.id} > div > button`).disabled = true;
      document.querySelector(`#${this.id} > .taskInfo > .taskState`).style['background-color'] = 'rgb(55, 207, 93)';
      document.querySelector(`#${this.id} > .taskInfo > .taskState > button`).textContent = 'Done!';

      setTimeout(() => document.getElementById(this.id).remove(), 500);
    },
    removeTask: function (event) {
      event.preventDefault();
      ipcRenderer.send('ask-remove-task', { id: this.id, name: this.name });
    },
    editTaskName: function() {
      console.log("edit task name");

      ipcRenderer.send('edit-task-name', { id: this.id, name: this.name })


    },
    editTaskTimespan: function() {
      console.log("edit task timespan")

      ipcRenderer.send('edit-task-timespan');

    }
  }
});
