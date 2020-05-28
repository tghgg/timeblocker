/* Vue component for the hours in the sidebar */

Vue.component('hour', {
    props: ['time'],
    template: '<p>{{ time }}</p>'   
});