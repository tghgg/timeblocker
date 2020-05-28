/* Task */

'use strict';

Vue.component('task', {
  props: ['timespan', 'name', 'id'],
  template: '<div class="task" :id="id"><div class="taskTime"><button>{{ timespan }}</button></div><div class="taskInfo"><button>{{ name }}</button><div class="taskState"><button>X</button></div></div></div>'
});
