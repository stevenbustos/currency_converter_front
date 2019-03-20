import Vue from 'vue'
import Router from 'vue-router'
import CurrencyConverter from './components/CurrencyConverter.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'currency-converter',
      component: CurrencyConverter
    }
  ]
})
