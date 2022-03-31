import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import NormalLogin from './login/NormalLogin.vue'
import SMSLogin from './login/SMSLogin.vue'
import QRLogin from './login/QRLogin.vue'
import HomeContainer from './home/HomeContainer.vue'
import StoryView from './story/StoryView.vue'
import StoryConfig from './story/StoryConfig.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: NormalLogin
  },
  {
    path: '/smslogin',
    component: SMSLogin
  },
  {
    path: '/qrlogin',
    component: QRLogin
  },
  {
    path: '/home',
    component: HomeContainer
  },
  {
    path: '/story',
    component: StoryView
  },
  {
    path: '/config',
    component: StoryConfig
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
