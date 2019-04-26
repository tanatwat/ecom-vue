import Vue from 'vue'
import Router from 'vue-router'

import AdminRoutes from './AdminRoute'

Vue.use(Router)

// const baseRoutes = [
//   {
//     path: '/',
//     component: Home,
//   },
// ];

const routes = AdminRoutes;

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router
