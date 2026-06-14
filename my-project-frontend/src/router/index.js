import { createRouter, createWebHistory } from 'vue-router'
import { useMainStore } from '../stores/index.js'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Home', component: () => import('../views/Home.vue') },
    { path: '/about', name: 'About', component: () => import('../views/About.vue') },
    { path: '/login', name: 'LoginPage', component: () => import('../views/LoginPage.vue') },
    { path: '/gamecenter', name: 'GameCenter', component: () => import('../components/games/GameCenter.vue')},
    { path: '/usermanagement', name: 'UserManagement', component: () => import('../components/usermanagement/UserList.vue')},
    { path: '/store', name: 'Store', component: () => import('../components/store/GameStore.vue')},
  ]
})

router.beforeEach((to,from,next) => {
  const storedData = useMainStore()
  const role = storedData.$state.userInformation.Role
  const isLoggedin = Object.keys(storedData.$state.userInformation).length !== 0
  const isCustomer = role === 'Customer'
  const isAdmin = role === 'Admin'

  if (!isLoggedin && to.path !== '/login') {
    next({ path: '/login' })
    return
  }

  if (isLoggedin && to.path === '/login') {
    next({ path: isCustomer ? '/store' : '/gamecenter' })
    return
  }

  if (isCustomer && ['/gamecenter', '/usermanagement'].includes(to.path)) {
    next({ path: '/' })
    return
  }

  if (isAdmin && to.path === '/store') {
    next({ path: '/' })
    return
  }

  next()
})

export default router


