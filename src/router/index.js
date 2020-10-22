import Vue from 'vue'
import VueRouter from 'vue-router'
import Test from '../components/highchartsRelate.vue'
//import NoResult from '../views/NoResult.vue'
import Homeres from '../views/Homeres.vue'
// import About from '../views/About.vue'
// import Help from '../views/Help.vue'

Vue.use(VueRouter)
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}

const routes = [
  {
    path: '/',
    name: 'Homeres',
    component: Homeres
  },
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // },
  {
    path:'/test',
    name:'test',
    component:Test
  }
  // {
  //   path:'/noResult',
  //   name:'noResult',
  //   component:NoResult
  // },
  // {
  //   path:'/about',
  //   name:'about',
  //   component:About
  // },
  // {
  //   path:'/help',
  //   name:'help',
  //   component:Help
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
