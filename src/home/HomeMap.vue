<template>
  <div id="container"></div>
  <teleport to="#area" :disabled="hovering">
    <canvas id="arc" ref="arc" style="z-index: 99"></canvas>
  </teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { AMapEvent, IMap } from '../utils/AMap'
import { shallowRef } from '@vue/reactivity'
import { getCurrentInstance } from 'vue'
import StoryApi from '../api/StoryApi'
import Marker from './Marker'
import { LngLat } from '../utils/AMap'

export default defineComponent({
  setup() {
    const map = shallowRef(null)
    return {
      click: false,
      hovering: false,
      map
    }
  },

  async mounted() {
    // inisialize the data
    const self = getCurrentInstance()!.appContext.config
      .globalProperties as import('../utils/GlobalProperties').GlobalProperties
    const { data: markers } = await StoryApi.get<Marker[]>(`/marker/${self.$store.userid}`)

    // initalize the amap
    await self.$AMap
    let map = shallowRef<IMap>()
    map.value = new window.AMap.Map('container', {
      zoom: 20
    })

    // initalzie the canvas
    let canvas = this.$refs.arc as HTMLCanvasElement
    let ctx = canvas.getContext('2d')!
    ctx.beginPath()
    ctx.arc(100, 100, 20, -0.5 * Math.PI, 1 * Math.PI)
    ctx.stroke()
    canvas.height = window.innerHeight - 90
    canvas.width = window.innerWidth - 10

    let down = () => {
      this.click = true
    }
    let up = () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      this.click = false
    }

    // mark handler
    const goMarker = (markerid: number) => {
      self.$store.markerid = markerid
      self.$router.push('/story')
    }
    const mark = (lnglat: LngLat, markerid: number) => {
      let marker = new window.AMap.Marker({
        position: lnglat,
        map: map.value!
      })
      console.log(lnglat)
      marker.on('click', () => goMarker(markerid))
      marker.on('touchdown', down)
      marker.on('touchleave', up)
      marker.on('touchup', () => {
        this.click && up()
        goMarker(markerid)
      })
    }
    markers.forEach((element) => {
      let lngLat = new window.AMap.LngLat(element.longitude, element.latitude)
      mark(lngLat, element.markerid)
    })

    // handler lnglat
    const filterLnglat = (lngLat: LngLat) => {
      for (const v of markers) {
        if (
          Math.abs(v.latitude - lngLat.lat) < 0.00001 &&
          Math.abs(v.longitude - lngLat.lng) < 0.00001
        ) {
          return false
        }
      }
      return true
    }
    const goStory = async (lngLat: LngLat) => {
      const { data } = await StoryApi.post('marker/create', {
        latitude: lngLat.lat,
        longitude: lngLat.lng,
        userid: self.$store.userid
      })
      return data.markerid as number
    }

    // write circle to reminder marker is making
    const setMarker = (event: AMapEvent) => {
      console.log(2)
      if (!filterLnglat(event.lnglat)) {
        return
      }
      console.log(3)
      let now = -0.5
      const clearState = () => {
        // eslint-disable-next-line no-self-assign
        canvas.height = canvas.height
        now = -0.5
      }
      let x = event.pixel.x - 0
      let y = event.pixel.y - 10
      this.hovering = true
      let isHovering = () => this.hovering
      let callback = function () {
        console.log(4)
        if (!isHovering()) {
          clearState()
          return
        }
        let next = now + 0.03
        if (next >= 1.5) {
          clearState()
          goStory(event.lnglat).then((markerid) => {
            mark(event.lnglat, markerid)
          })
          return
        }
        ctx.beginPath()
        ctx.arc(x, y, 20, now * Math.PI, next * Math.PI)
        ctx.stroke()
        now = next
        requestAnimationFrame(callback)
      }
      callback()
    }

    // cancel to create a marker midway
    const cancelMark = () => {
      this.hovering = false
    }

    // add listener ( mobile and desktop )
    map.value.on('mousedown', setMarker)
    map.value.on('touchstart', setMarker)
    map.value.on('mouseup', cancelMark)
    map.value.on('touchend', cancelMark)
    map.value.on('mousemove', cancelMark)
    map.value.on('touchmove', cancelMark)
  }
})
</script>
