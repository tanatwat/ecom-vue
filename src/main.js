import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'

Vue.config.productionTip = false

import VeeValidate from 'vee-validate'
Vue.use(VeeValidate);

const http = axios.create({
  baseURL: 'http://localhost:9000',
  headers: {"Access-Control-Allow-Origin": true},
  data: {
    database: 'ecom.'
  }
});

window.axios = http;

new Vue({
  data() {
    return {
      backendUrl: 'google',
      loading: false
    }
  },
  router,
  store,
  render: h => h(App)
}).$mount('#app')
