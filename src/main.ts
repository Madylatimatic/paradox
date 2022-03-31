import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import { MusicAudio, VoiceAudio } from './utils/GlobalProperties'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// create app
const app = createApp(App)
app.use(router).use(ElementPlus).mount('#app')

// get globalProperties
const globalProperties = app.config
  .globalProperties as import('./utils/GlobalProperties').GlobalProperties

// set fallback and try to use Toast
globalProperties.$pop = (text: string) => Promise.resolve(alert(text))
import('./utils/Toast').then((TOAST) => {
  globalProperties.$pop = TOAST.default
  globalProperties.$pop('Welcome to PARADOX!')
})

// set Promise to tell if the Promise is fulfilled later
globalProperties.$AMap = import('./utils/AMapModule')

// initialize global player
globalProperties.$Music = new MusicAudio()
globalProperties.$Voice = new VoiceAudio()

// initialize the store
globalProperties.$store = {
  userid: 0,
  markerid: 0,
  stories: new Map(),
  room_id: '',
  key: ''
}
