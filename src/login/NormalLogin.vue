<template>
  <div>
    <form action="#" method="post" @submit.prevent="submit">
      <h1>网易云账号登录</h1>

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
        <label for="current-password">密码</label>
        <input
          id="current-password"
          v-model="password"
          name="current-password"
          :type="password_type"
          autocomplete="current-password"
          required
        />
        <button id="toggle-password" type="button" @click="togglePassword">
          {{ password_reminder }}
        </button>
      </section>

      <button id="signin">登录</button>

      <div class="flex-opposite">
        <div class="flex-opposite flex-button" @click="routeSMSLogin(self)">
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
import { routeSMSLogin, routeQRLogin, routeHome } from '../utils/route'
import NetEaseAPI from '../api/NetEaseAPI'
import LogResult from './LogResult'

// global
const self = getCurrentInstance()!.appContext.config
  .globalProperties as import('../utils/GlobalProperties').GlobalProperties

// login information
let phone = ''
let password = ''

// display info
let password_type = 'password'
let password_reminder = '显示密码'

// switch how to display
function togglePassword() {
  if (password_type === 'password') {
    password_type = 'text'
    password_reminder = '隐藏密码'
  } else {
    password_type = 'password'
    password_reminder = '显示密码'
  }
}

// submit and jump to Home
async function submit() {
  const { data } = await NetEaseAPI.get<LogResult>(
    `/login/cellphone?phone=${phone}&password=${password}`
  )
  if (data.account !== null && data.profile !== null) {
    self.$pop('登录成功')
    routeHome(self, data.profile.userId)
    return
  }
  self.$pop('密码错误')
}
</script>

<style scoped>
button#toggle-password {
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 300;
  padding: 0;
  position: absolute;
  top: -4px;
  right: -2px;
}
</style>
