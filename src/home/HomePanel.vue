<template>
  <div id="home-panel">
    <button id="voice" class="icon_button flex-center" @click="startVoiceChat()">
      <svg
        width="17px"
        height="17px"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <path
          d="M8.5 12c2.481 0 4.5-2.019 4.5-4.5v-3c0-2.311-1.756-4.197-4-4.449v-0.051h-1v0.051c-2.244 0.252-4 2.138-4 4.449v3c0 2.481 2.019 4.5 4.5 4.5zM6 2.059v1.941h1v-2.648c0.312-0.149 0.646-0.25 1-0.301v2.949h1v-2.949c0.354 0.051 0.688 0.151 1 0.301v2.648h1v-1.941c0.617 0.631 1 1.491 1 2.441v0.5h-7v-0.5c0-0.95 0.383-1.811 1-2.441zM5 6h7v1.5c0 1.93-1.57 3.5-3.5 3.5s-3.5-1.57-3.5-3.5v-1.5zM15 7v3.25c0 2.067-2.019 3.75-4.5 3.75h-1.5v3h-1v-3h-1.5c-2.481 0-4.5-1.683-4.5-3.75v-3.25h1v3.25c0 1.517 1.57 2.75 3.5 2.75h4c1.93 0 3.5-1.233 3.5-2.75v-3.25h1z"
          fill="#000000"
        />
      </svg>
    </button>

    <button id="listen" class="icon_button flex-center" @click="startSearchMusic()">
      <svg
        width="17px"
        height="17px"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <path
          d="M15.981 8.085c-0.192-4.493-3.469-8.085-7.481-8.085s-7.289 3.592-7.481 8.085c-0.59 0.201-1.019 0.756-1.019 1.415v4c0 0.827 0.67 1.5 1.494 1.5h1.506v-1h1v-5h-1v-1h-0.978c0.225-3.902 3.040-7 6.478-7s6.253 3.098 6.478 7h-0.978v1h-1v5h1v1h1.506c0.824 0 1.494-0.673 1.494-1.5v-4c0-0.659-0.429-1.214-1.019-1.415zM2 14h-0.506c-0.272 0-0.494-0.225-0.494-0.5v-4c0-0.275 0.222-0.5 0.494-0.5h0.506v5zM16 13.5c0 0.275-0.222 0.5-0.494 0.5h-0.506v-5h0.506c0.272 0 0.494 0.225 0.494 0.5v4z"
          fill="#000000"
        />
      </svg>
    </button>

    <button id="back" class="icon_button flex-center" @click="closeSearchMusic()">
      <svg
        width="17px"
        height="17px"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <path
          d="M16 8.972h-12.793l6.146 6.146-0.707 0.707-7.353-7.353 7.354-7.354 0.707 0.707-6.147 6.147h12.793v1z"
          fill="#000000"
        />
      </svg>
    </button>

    <HomeSearch :searching="searching" />
  </div>
</template>

<script setup lang="ts">
import { ref } from '@vue/reactivity'
import HomeSearch from './HomeSearch.vue'

// state
let searching = ref<boolean>(false)

// switch the state
function startSearchMusic() {
  const back = document.getElementById('back') as HTMLInputElement
  const search = document.getElementById('search') as HTMLInputElement
  const area = document.getElementById('area') as HTMLDivElement
  const container = document.getElementById('container') as HTMLDivElement
  back && (back.style.visibility = 'visible')
  search && (search.style.visibility = 'visible')
  area && ((area.style.overflowY = 'scroll'), (area.style.backgroundColor = '#a9abab88'))
  container && (container.style.zIndex = '-1')
  searching.value = true
}
function closeSearchMusic() {
  const back = document.getElementById('back') as HTMLInputElement
  const search = document.getElementById('search') as HTMLInputElement
  const area = document.getElementById('area') as HTMLDivElement
  const container = document.getElementById('container') as HTMLDivElement
  back && (back.style.visibility = 'hidden')
  search && (search.style.visibility = 'hidden')
  area && ((area.style.overflowY = ''), (area.style.backgroundColor = ''))
  container && (container.style.zIndex = '0')
  searching.value = false
}

function startVoiceChat() {
  console.log('startVoiceChat')
}
</script>
