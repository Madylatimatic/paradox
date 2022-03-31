<template>
  <div>
    <form action="#" method="post" @submit.prevent="submit">
      <h1>网易云验证码登录</h1>

      <section>
        <label for="tel">手机</label>
        <input
          id="tel"
          v-model="phone"
          name="tel"
          type="tel"
          placeholder=" "
          pattern="[0-9]{11}"
          autocomplete="username"
          required
        />
      </section>

      <section>
        <label for="captcha">验证码</label>
        <div class="flex-opposite">
          <input
            id="captcha"
            v-model="captcha"
            name="captcha"
            type="text"
            autocomplete="one-time-code"
            required
          />
          <button id="get-captcha" type="button" @click="getCaptcha">获取验证码</button>
        </div>
      </section>

      <button id="signin">登录</button>

      <div class="flex-opposite">
        <div class="flex-opposite flex-button" @click="routeNormalLogin(self)">
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
        <div class="flex-opposite flex-button" @click="routeQRLogin(self)">
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
              d="M6 13C6 10.2386 8.23858 8 11 8H13C15.7614 8 18 10.2386 18 13V16H6V13ZM11 10C9.34315 10 8 11.3431 8 13V14H16V13C16 11.3431 14.6569 10 13 10H11Z"
              fill="#4296FF"
            />
            <path
              d="M3 6C3 3.79086 4.79086 2 7 2H9C9.55228 2 10 2.44772 10 3C10 3.55228 9.55228 4 9 4H7C5.89543 4 5 4.89543 5 6V7C5 7.55228 4.55228 8 4 8C3.44772 8 3 7.55228 3 7V6Z"
              fill="#152C70"
            />
            <path
              d="M2 15C2 14.4477 2.44772 14 3 14H21C21.5523 14 22 14.4477 22 15C22 15.5523 21.5523 16 21 16V18C21 20.2091 19.2091 22 17 22H15C14.4477 22 14 21.5523 14 21C14 20.4477 14.4477 20 15 20H17C18.1046 20 19 19.1046 19 18V16H5V18C5 19.1046 5.89543 20 7 20H9C9.55228 20 10 20.4477 10 21C10 21.5523 9.55228 22 9 22H7C4.79086 22 3 20.2091 3 18V16C2.44772 16 2 15.5523 2 15Z"
              fill="#152C70"
            />
            <path
              d="M17 2C19.2091 2 21 3.79086 21 6V7C21 7.55228 20.5523 8 20 8C19.4477 8 19 7.55228 19 7V6C19 4.89543 18.1046 4 17 4H15C14.4477 4 14 3.55228 14 3C14 2.44772 14.4477 2 15 2H17Z"
              fill="#152C70"
            />
          </svg>
          <div>二维码登录</div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance } from 'vue'
import { routeHome, routeNormalLogin, routeQRLogin } from '../utils/route'
import NetEaseAPI from '../api/NetEaseAPI'
import LogResult from './LogResult'

// global
const self = getCurrentInstance()!.appContext.config
  .globalProperties as import('../utils/GlobalProperties').GlobalProperties

// login information
let phone = ''
let captcha = ''

// send captcha
async function getCaptcha() {
  await NetEaseAPI.get(`/captcha/sent?phone=${phone}`)
  self.$pop('验证码已发送')
}

// submit
async function submit() {
  const { data } = await NetEaseAPI.get<LogResult>(
    `/login/cellphone?phone=${phone}&captcha=${captcha}`
  )
  if (data.account !== null && data.profile !== null) {
    self.$pop('登录成功')
    routeHome(self, data.profile.userId)
    return
  }
  self.$pop('验证码错误')
}
</script>

<style scoped>
#captcha {
  width: 50%; /* fallback */
  width: calc(55% - 30px); /* full width minus padding */
}

#get-captcha {
  padding: 15px;
  margin-top: 0;
  width: 45%; /* fallback */
  width: calc(50% - 30px); /* full width minus padding */
}

@media (min-width: 450px) {
  #captcha {
    width: 70%; /* fallback */
    width: calc(75% - 30px); /* full width minus padding */
  }
  #get-captcha {
    padding: 15px;
    margin-top: 0;
    width: inherit;
  }
}

@media (min-width: 450px) and (max-width: 600px) {
  #captcha {
    width: 50%; /* fallback */
    width: calc(55% - 30px); /* full width minus padding */
  }
  #get-captcha {
    width: 45%; /* fallback */
    width: calc(50% - 30px); /* full width minus padding */
  }
}
</style>
