/* Task */

'use strict';

Vue.component('task', {
  props: ['timespan', 'name', 'id'],
  template: '<div class="task" :id="id"><div class="taskTime"><button>{{ timespan }}</button></div><div class="taskInfo"><button v-on:click="completeTask" v-on:contextmenu="removeTask($event)">{{ name }}</button><div class="taskState"><button>X</button></div></div></div>',
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
    }
  }
});
