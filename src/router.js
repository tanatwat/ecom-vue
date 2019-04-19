import Vue from 'vue'
import Router from 'vue-router'

import Home from './client/Home'
import AdminRoutes from './routes/AdminRoute'

Vue.use(Router)

const baseRoutes = [
  {
    path: '/',
    component: Home,
  },
];

const routes = baseRoutes.concat(AdminRoutes);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router
