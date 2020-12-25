import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Gold from '../views/Gold.vue'
import Channel from '../views/Channel.vue'
import Handler from '../views/handle/Handler.vue'
import Offset from '../views/handle/Offset.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/gold',
    name: 'Gold',
    component: Gold
  },
  {
    path: '/channel',
    name: 'Channel',
    component: Channel
  },
  { path: '', redirect: "/gold" }
]

declare const window: any;
const router = createRouter({
  history: createWebHistory(window.__POWERED_BY_QIANKUN__ ? '/data' : '/'),
  routes
})

export default router
