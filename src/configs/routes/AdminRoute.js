import Login from '../../views/admin/_Login.vue'
import Admin from '../../views/admin/Admin.vue'
import Dashboard from '../../views/admin/Dashboard.vue'
import Product from '../../views/admin/products/components/_ProductsView.vue'
import ProductUpload from '../../views/admin/products/upload/ProductUpload.vue'
import ProductEdit from '../../views/admin/products/edit/ProductEdit.vue'
import Category from '../../views/admin/products/category/Category.vue'
import CategoryEdit from '../../views/admin/products/CategoryEdit.vue'
import Promotion from '../../views/admin/products/promotion/Promotion.vue'
import Stock from '../../views/admin/products/Stock.vue'

import Order from '../../views/admin/order/Order.vue'
import OrderHistory from '../../views/admin/order/OrderHistory.vue'

import Showcase from '../../views/admin/showcase/Showcase.vue'
import ShowcaseEdit from '../../views/admin/showcase/ShowcaseEdit.vue'

import Banner from '../../views/admin/Banner.vue'
import Payment from '../../views/admin/Payment.vue'
import Settings from '../../views/admin/Settings.vue'
import Shipping from '../../views/admin/Shipping.vue'

export default [
  {
    path: '/admin/login',
    component: Login,
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem("token")) {
        next({
          path: '/admin'
        })
      } else {
        next()
      }
    }
  },
  {
    path: '/admin',
    name: 'admin',
    component: Admin,
    redirect: { name: 'admin-home' },
    meta: { requiresAuth: true },
    beforeEnter: (to, from, next) => {
      if (!localStorage.getItem("token")) {
        next({
          path: '/admin/login'
        })
      } else {
        next()
      }
    },
    children: [
      {
        path: '',
        name: 'admin-home',
        component: Dashboard,
      },
      {
        path: 'products',
        component: Product,
      },
      {
        path: 'products/upload',
        component: ProductUpload,
      },
      {
        path: 'products/:uid/edit',
        component: ProductEdit,
      },
      {
        path: 'products/category',
        component: Category,
      },
      {
        path: 'products/category/:category',
        component: CategoryEdit,
        name: 'categoryEdit'
      },
      {
        path: 'products/promotions',
        component: Promotion,
      },
      {
        path: 'products/stock',
        component: Stock,
      },
      {
        path: 'orders',
        component: Order,
      },
      {
        path: 'showcase',
        component: Showcase,
      },
      {
        path: 'showcase/:showcase',
        component: ShowcaseEdit,
      },
      {
        path: 'banner',
        component: Banner,
      },
      {
        path: 'payment',
        component: Payment,
      },
      {
        path: 'settings',
        component: Settings,
      },
      {
        path: 'shipping',
        component: Shipping,
      },
    ],
  }
];
