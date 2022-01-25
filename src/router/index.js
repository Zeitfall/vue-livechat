import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'register',
    meta: {
      _layout: 'empty'
    },
    component: () => import('@/views/register')
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      _layout: 'empty'
    },
    component: () => import('@/views/login')
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
