import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// Axios to fetch data from the API
import axios from 'axios'
import VueAxios from 'vue-axios'
// Multiselect
import Multiselect from 'vue-multiselect'
// Bootstrap
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

Vue.use(VueAxios, axios)
Vue.component('multiselect', Multiselect)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
