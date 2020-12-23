import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Operator from '../views/Operator.vue'
import Handler from '../views/handle/Handler.vue'
import Offset from '../views/handle/Offset.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:platform',
    name: 'Operator',
    component: Operator,
    children: [
      {
        path: ':symbol/:contractType/:direction',
        name: 'Handler',
        component: Handler,
        children: [
          {
            path: ':offset',
            name: 'Offset',
            component: Offset
          }
        ]
      }
    ]
  },
  { path: '', redirect: "/gold" }
]

declare const window: any;
const router = createRouter({
  history: createWebHistory(window.__POWERED_BY_QIANKUN__ ? '/data' : '/'),
  routes
})

export default router
