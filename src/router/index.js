import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'auth',
    meta: {
      _layout: 'empty'
    },
    component: () => import('@/views/auth')
  },
  {
    path: '/chat',
    name: 'chat',
    meta: {
      _layout: 'main'
    },
    component: () => import('@/views/chat')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
