<template>
  <div>
    <form action="#" method="post">
      <h1>网易云二维码登录</h1>

      <section class="flex-center">
        <canvas id="qrcode" ref="qrcode"></canvas>
      </section>

      <div class="flex-opposite">
        <div class="flex-opposite flex-button" @click="goNormalLogin()">
          <svg
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M15.6508 4.24075C16.0701 4.60017 16.1187 5.23147 15.7593 5.65079L10.3171 12L15.7593 18.3492C16.1187 18.7685 16.0701 19.3998 15.6508 19.7593C15.2315 20.1187 14.6002 20.0701 14.2407 19.6508L8.24074 12.6508C7.91975 12.2763 7.91975 11.7237 8.24074 11.3492L14.2407 4.34921C14.6002 3.92989 15.2315 3.88132 15.6508 4.24075Z"
              fill="#152C70"
            />
          </svg>
          <div>密码登录</div>
        </div>
        <div class="flex-opposite flex-button" @click="goSMSLogin()">
          <svg
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M2 9C2 6.23858 4.23858 4 7 4H17C19.7614 4 22 6.23858 22 9V15C22 17.7614 19.7614 20 17 20H7C4.23858 20 2 17.7614 2 15V9ZM7 6C5.34315 6 4 7.34315 4 9V15C4 16.6569 5.34315 18 7 18H17C18.6569 18 20 16.6569 20 15V9C20 7.34315 18.6569 6 17 6H7Z"
              fill="#152C70"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M6.21917 8.37534C6.56418 7.94408 7.19347 7.87416 7.62473 8.21917L10.126 10.2201C11.2216 11.0967 12.7785 11.0967 13.8741 10.2201L16.3753 8.21917C16.8066 7.87416 17.4359 7.94408 17.7809 8.37534C18.1259 8.8066 18.056 9.4359 17.6247 9.78091L15.1235 11.7819C13.2974 13.2428 10.7027 13.2428 8.87656 11.7819L6.37534 9.78091C5.94408 9.4359 5.87416 8.8066 6.21917 8.37534Z"
              fill="#4296FF"
            />
          </svg>
          <div>验证码登录</div>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { routeHome, routeNormalLogin, routeSMSLogin } from '../utils/route'
import { defineComponent, getCurrentInstance } from 'vue'
import NetEaseAPI from '../api/NetEaseAPI'
import { QRKeyResult, QRResult } from './QRResult'
import QRCode from 'qrcode'
import { GlobalProperties } from '../utils/GlobalProperties'

export default defineComponent({
  data() {
    return {
      timer: undefined as ReturnType<typeof setTimeout> | undefined,
      self: getCurrentInstance()!.appContext.config.globalProperties as GlobalProperties,
      unikey: ''
    }
  },

  async mounted() {
    await this.paintQR()
    await this.subscribe()
  },

  unmounted() {
    if (this.timer !== undefined) {
      clearTimeout(this.timer)
      this.timer = undefined
    }
  },

  methods: {
    async paintQR() {
      const now = new Date().getTime()
      const { data: QRKey } = await NetEaseAPI.get<QRKeyResult>(`/login/qr/key?t=${now}`)
      this.unikey = QRKey.data.unikey
      console.log(QRKey)
      const { data: QRUrl } = await NetEaseAPI.get<QRResult>(
        `/login/qr/create?key=${this.unikey}&t=${now}`
      )
      const qrcode = this.$refs.qrcode as HTMLCanvasElement
      QRCode.toCanvas(qrcode, QRUrl.data.qrurl, (error: Error) => {
        if (error) this.self.$pop('二维码生成失败')
        this.self.$pop('二维码生成成功')
      })
    },

    async subscribe() {
      const now = new Date().getTime()
      let response = await NetEaseAPI.get(`/login/qr/check?key=${this.unikey}&t=${now}`)
      switch (response.data.code) {
        case 801:
          this.self.$pop('请使用网易云音乐扫码')
          break

        case 802:
          this.self.$pop('请在手机上确认')
          break

        case 803:
          this.self.$pop('登录成功')
          response = await NetEaseAPI.get('/user/account')
          routeHome(this.self as unknown as GlobalProperties, response.data.profile.userId)
          return

        case 800:
          this.self.$pop('二维码过期')
          await this.paintQR()
          return

        default:
          this.self.$pop('网络异常')
          return
      }
      // long polling
      this.timer = setTimeout(this.subscribe, 3000)
    },

    goNormalLogin() {
      routeNormalLogin(this.self as unknown as GlobalProperties)
    },

    goSMSLogin() {
      routeSMSLogin(this.self as unknown as GlobalProperties)
    }
  }
})
</script>
