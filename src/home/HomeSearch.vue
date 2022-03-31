<template>
  <input id="search" placeholder="输入搜索歌曲" @input="searchMusic($event)" />

  <teleport to="#area" :disabled="!props.searching">
    <div v-for="item in props.searching ? list : []" id="music-list" :key="item.id">
      <h3>{{ item.name }}</h3>
      <p>{{ item.ar[0].name }}</p>
      <button @click="play(item.id, item.name)">+</button>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { getCurrentInstance, ref } from 'vue'
import NetEaseAPI from '../api/NetEaseAPI'
import { Song, SongResult, SongURLResult } from './SongResult'

// global
const self = getCurrentInstance()!.appContext.config
  .globalProperties as import('../utils/GlobalProperties').GlobalProperties

// state
const props = defineProps<{
  searching: boolean
}>()

// search what
let list = ref<Song[]>([])

// search music
function searchMusic(event: any) {
  const search = event.target.value as string
  if (search === '') {
    list.value = []
    return
  }
  NetEaseAPI.get<SongResult>(`/cloudsearch?keywords=${search}&limit=80`).then(({ data }) => {
    list.value = data.result.songs
    console.log(list)
  })
}

async function play(id: number, name: string) {
  const { data } = await NetEaseAPI.get<SongURLResult>(`/song/url?id=${id}`)
  let URL: string | null = null
  let free = true
  for (const { url, freeTrialInfo } of data.data) {
    if (url !== null) {
      URL = url
      free = freeTrialInfo === null
      console.log(freeTrialInfo)
      break
    }
  }
  if (URL === null) {
    self.$pop('播放失败')
    return
  }
  if (free) {
    self.$pop('正在播放：' + name)
  } else {
    self.$pop('正在试听' + name)
  }
  const audio = self.$Music.ref
  audio.pause()
  audio.src = URL
  audio.play()
}
</script>
