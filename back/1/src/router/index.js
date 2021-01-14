import Home from '../pages/Home.vue'
import Game from '../pages/Game.vue'
import Admin from '../pages/Admin.vue'
import User from '../pages/User.vue'
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
    { path: '/', component: Home },
    { path: '/game/', component: Game },
    { path: '/admin/', component: Admin },
    { path: '/user/:id/:lang', component: User },
    { path: '*', component: Page404 }
  ]
}
