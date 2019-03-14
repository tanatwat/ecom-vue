import Admin from '../admin/Admin.vue'
import Dashboard from '../admin/views/Dashboard.vue'
import Product from '../admin/views/products/Products.vue'
import ProductUpload from '../admin/views/products/ProductUpload.vue'
import Category from '../admin/views/products/Category.vue'
import Promotion from '../admin/views/products/Promotion.vue'
import Stock from '../admin/views/products/Stock.vue'

import Order from '../admin/views/order/Order.vue'
import OrderHistory from '../admin/views/order/OrderHistory.vue'

import Showcase from '../admin/views/showcase/Showcase.vue'
import ShowcaseEdit from '../admin/views/showcase/ShowcaseEdit.vue'

import Banner from '../admin/views/Banner.vue'
import Payment from '../admin/views/Payment.vue'
import Settings from '../admin/views/Settings.vue'
import Shipping from '../admin/views/Shipping.vue'

export default [
  {
    path: '/admin',
    name: 'admin',
    component: Admin,
    redirect: { name: 'admin-home' },
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
        path: 'products/category',
        component: Category,
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
  },
];
