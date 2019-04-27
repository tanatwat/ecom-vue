/* eslint-disable */
import Vue from 'vue'
import App from './App'
import router from './configs/routes/router'
import store from './configs/store'
import axios from 'axios'
window._ = require('lodash');

const databaseName = 'ecom.'
const siteName = 'testing'
const backendUrl = 'http://localhost:9000'

Vue.config.productionTip = false

import th from 'vee-validate/dist/locale/th';
import VeeValidate, { Validator } from 'vee-validate'
Vue.use(VeeValidate);
Validator.localize('th', th);

import number from './misc/number'
Vue.use(number)

import VueProgressBar from 'vue-progressbar'
const progressBarOptions = {
  color: '#64d858',
  failedColor: '#ce2446',
  thickness: '5px'
}
Vue.use(VueProgressBar, progressBarOptions)

let jwtToken = null
let clientId = null

if (localStorage.token) {
  jwtToken = `Bearer ${localStorage.token}`
  clientId = localStorage.client
}

Vue.prototype.$http = axios.create({
  baseURL: backendUrl,
  data: {
    database: databaseName,
    siteName: siteName
  },
  headers: {
    Authorization: jwtToken,
    Client: clientId
  }
});

/* GLOBAL COMPONENTS */
Vue.component('modal', require('./views/admin/_components/Modal.vue').default)
Vue.component('form-input', require('./views/admin/_components/Input.vue').default)
Vue.component('form-textarea', require('./views/admin/_components/Textarea.vue').default)
Vue.component('products', require('./views/admin/_components/ProductContainer.vue').default)
Vue.component('search-filter', require('./views/admin/_components/Filter.vue').default)
Vue.component('pagination', require('./views/admin/_components/Pagination.vue').default)


new Vue({
  data() {
    return {
      backendUrl: backendUrl,
      loading: false,
      showModal: false,
      siteName: siteName,
      clientId: clientId,
      // 1 MB
      thumbnailSize: {
        file: 1048576,
        string: '1 MB'
      },
      // 1.5 MB
      photoSize: {
        file: 1572864,
        string: '1.5 MB'
      },
      photoLimit: 7
    }
  },
  router,
  store,
  render: h => h(App)
}).$mount('#app')
