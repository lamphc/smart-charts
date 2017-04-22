import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource'
import Env from '../config/dev.env';

import App from './App.vue';

console.log(Env.NODE_ENV, Env.NODE_ENV === '"development"');
if (Env.NODE_ENV === '"development"') {
  Vue.config.debug = true
}

Vue.use(VueRouter);
Vue.use(VueResource);

//router component
import BarChart from './components/BarChart.vue';
import NodeChart from './components/nodeChart.vue';


//router instance
const router = new VueRouter({
    mode: 'history',
    base: './',
    routes: [
      {
        path: '/index',
        component: BarChart,
        alias:['/']
      },
      {
        path: '/node',
        component: NodeChart,
      },
    ]
  }
);


//root vue instance
new Vue({
  router: router,
  render: create => create(App),
}).$mount('#app');
