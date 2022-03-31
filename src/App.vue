<template>
  <router-view></router-view>
</template>
<script lang="ts">
import { getCurrentInstance } from 'vue'
import NetEaseAPI from './api/NetEaseAPI'
import { LogStatus } from './login/LogStatus'
import { routeHome, routeNormalLogin } from './utils/route'

export default {
  async created() {
    // global
    const self = getCurrentInstance()!.appContext.config
      .globalProperties as import('./utils/GlobalProperties').GlobalProperties

    const { data } = await NetEaseAPI.get<LogStatus>('/login/status')
    if (data.data.profile !== null && data.data.profile !== null) {
      routeHome(self, data.data.profile.userId)
    } else {
      routeNormalLogin(self)
    }
  }
}
</script>
