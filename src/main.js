import Vue from 'vue'
import App from './App.vue'
import router from './router'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/dark.css'
// import './assets/css/app.css'
// import './assets/css/chunk-vendors.css'

Vue.use(ElementUI);

//utils
import utils from './utils.js'
Vue.prototype.$utils = utils

//vue-infinite-scroll
import infiniteScroll from 'vue-infinite-scroll';
Vue.use(infiniteScroll)

//echarts
//import echarts from 'echarts'
//Vue.prototype.$echarts = echarts

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
