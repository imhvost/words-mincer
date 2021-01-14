import Home from '../pages/Home.vue'
import Game from '../pages/Game.vue'
import Admin from '../pages/Admin.vue'
import User from '../pages/User.vue'
import Top from '../pages/Top.vue'
import Instruction from '../pages/Instruction.vue'
import PrivacyPolicy from '../pages/PrivacyPolicy.vue'
import Page404 from '../pages/Page404.vue'

export default {
  mode: 'history',
  fallback: false,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes: [
    {
      path: '/home',
      redirect: {
        name: 'home'
      }
    },
    { path: '/', name: 'home', component: Home },
    { path: '/game/', name: 'game', component: Game },
    { path: '/admin/', component: Admin },
    { path: '/top/', name: 'top', component: Top },
    { path: '/instruction/', component: Instruction },
    { path: '/privacy-policy/', component: PrivacyPolicy },
    { path: '/user/:id/:lang', name: 'user', component: User },
    { path: '*', component: Page404 }
  ]
}
