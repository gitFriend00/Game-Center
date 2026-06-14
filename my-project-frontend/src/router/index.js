import { createRouter, createWebHistory } from 'vue-router'
import { useMainStore } from '../stores/index.js'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Home', component: () => import('../views/Home.vue') },
    { path: '/about', name: 'About', component: () => import('../views/About.vue') },
    { path: '/login', name: 'LoginPage', component: () => import('../views/LoginPage.vue') },
    { path: '/gamecenter', name: 'GameCenter', component: () => import('../components/games/GameCenter.vue')}
  ]
})

router.beforeEach((to,from,next) => {
  const storedData = useMainStore()
  console.log(storedData)
  const isLoggedin = Object.keys(storedData.$state.userInformation).length !== 0
  if(!isLoggedin && to.path !== '/login'){
    next({path:'/login'})

  }else if (isLoggedin && to.path === '/login'){
    next({path:'/gamecenter'})
  }else{
    next()
  }
})

export default router


