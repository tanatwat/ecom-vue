import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'
import lodash from 'lodash'

const databaseName = 'ecom.'
const siteName = 'testing'
const backendUrl = 'http://localhost:9000'

Vue.config.productionTip = false

import VeeValidate from 'vee-validate'
Vue.use(VeeValidate);

import number from './misc/number'
Vue.use(number)

import VueProgressBar from 'vue-progressbar'
const progressBarOptions = {
  color: '#64d858',
  failedColor: '#ce2446',
  thickness: '5px'
}
Vue.use(VueProgressBar, progressBarOptions)

Vue.prototype.$http = axios.create({
  baseURL: backendUrl,
  data: {
    database: databaseName,
    siteName: siteName
  }
});

new Vue({
  data() {
    return {
      backendUrl: backendUrl,
      loading: false,
      database: databaseName,
      siteName: siteName
    }
  },
  router,
  store,
  render: h => h(App)
}).$mount('#app')
