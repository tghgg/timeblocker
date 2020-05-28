/* Task */

'use strict';

Vue.component('task', {
  props: ['timespan', 'name', 'id'],
  template: '<div class="task" :id="id"><div class="taskTime"><h3>{{ timespan }}</h3></div><div class="taskInfo"><button>{{ name }}</button><h3>X</h3></div></div>'
});
