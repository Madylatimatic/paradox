<template>
  <main id="main" @keydown="handleKey">
    <div v-if="show" id="stories" @click="handleClick">
      <section v-for="[time, time_map] in storiesMap" :key="time" class="time">
        <article
          v-for="[storyid, picture] in time_map"
          :key="storyid"
          :style="imgURL(picture)"
          :title="time"
          class="story"
        ></article>
      </section>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, ref } from 'vue'
import StoryApi from '../api/StoryApi'

export default defineComponent({
  setup() {
    // translate the model to view-model
    const storiesMap: import('./Story').StoryMap = new Map()
    const show = ref<boolean>(false)
    const current_story = document.getElementById('stories')! as Element
    return {
      storiesMap,
      show,
      current_story
    }
  },

  created() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let that = this
    this.initializeStoriesMap().then(() => {
      that.show = true
      that.$nextTick(() => {
        this.current_story = document.getElementById('stories')!.firstElementChild!
          .lastElementChild! as Element
      })
    })
  },

  methods: {
    async initializeStoriesMap() {
      const self = getCurrentInstance()!.appContext.config
        .globalProperties as import('../utils/GlobalProperties').GlobalProperties
      if (self.$store.stories.size === 0) {
        const { data } = await StoryApi.get<import('./Story').Story[]>(
          `/story/${self.$store.markerid}`
        )
        const stories = data
        let time_map = null
        let res = null
        for (const story of stories) {
          time_map = this.storiesMap.get(story.time)
          if (time_map === undefined) {
            time_map = new Map()
          }
          // get the accessible image link
          res = await StoryApi.post('/qiniu/image', {
            imgUrl: story.picture
          })

          time_map.set(story.storyid, res.data.imgUrl)
          this.storiesMap.set(story.time, time_map)
        }
        self.$store.stories = this.storiesMap
      }
      this.storiesMap = self.$store.stories
      console.log(this.storiesMap)
    },
    // handler the click and drag
    navigateStories(direction: 'next' | 'prev') {
      const story = this.current_story!
      const lastItemInUserStory = story.parentNode!.firstElementChild
      const firstItemInUserStory = story.parentNode!.lastElementChild
      const hasNextUserStory = story.parentElement!.nextElementSibling
      const hasPrevUserStory = story.parentElement!.previousElementSibling
      console.log(story)
      // to right
      if (direction === 'next') {
        if (lastItemInUserStory === story && !hasNextUserStory) {
          this.$router.push('/home')
          return
        } else if (lastItemInUserStory === story && hasNextUserStory) {
          this.current_story = story.parentElement!.nextElementSibling!.lastElementChild!
          story.parentElement!.nextElementSibling!.scrollIntoView({
            behavior: 'smooth'
          })
        } else {
          story.classList.add('seen')
          this.current_story = story.previousElementSibling!
        }
      }
      // to left
      else if (direction === 'prev') {
        if (firstItemInUserStory === story && !hasPrevUserStory) {
          this.$router.push('/config')
          return
        } else if (firstItemInUserStory === story && hasPrevUserStory) {
          this.current_story = story.parentElement!.previousElementSibling!.firstElementChild!
          story.parentElement!.previousElementSibling!.scrollIntoView({
            behavior: 'smooth'
          })
        } else {
          story.nextElementSibling!.classList.remove('seen')
          this.current_story = story.nextElementSibling!
        }
      }
    },
    handleClick(event: any) {
      const stories = document.getElementById('stories')!
      const median = stories.offsetLeft + stories.clientWidth / 2
      if (event.target.nodeName !== 'ARTICLE') return
      this.navigateStories(event.clientX > median ? 'next' : 'prev')
    },

    handleKey(event: any) {
      const key = event.key
      if (key !== 'ArrowDown' || key !== 'ArrowUp') {
        this.navigateStories(key === 'ArrowDown' ? 'next' : 'prev')
      }
    },
    imgURL(picture: string) {
      return `--bg: url(${picture})`
    }
  }
})
</script>

<style scoped>
main {
  min-height: 100vh;
  display: grid;
  align-items: center;
  justify-items: center;
  place-items: center;
  margin: 0;
  background: hsl(200, 15%, 93%);
}

main > #stories {
  width: 100vw;
  height: 100vh;

  box-shadow: 0 5px 2.5px hsla(200, 95%, 3%, 0.037), 0 12px 6.5px hsla(200, 95%, 3%, 0.053),
    0 22.5px 13px hsla(200, 95%, 3%, 0.065), 0 40.2px 24px hsla(200, 95%, 3%, 0.077),
    0 75.2px 44px hsla(200, 95%, 3%, 0.093), 0 180px 80px hsla(200, 95%, 3%, 0.13);
}

@media (hover: hover) {
  main > #stories {
    border-radius: 3ch;
  }
}

@media (hover: hover) and (min-width: 480px) {
  main > #stories {
    max-width: 480px;
    max-height: 848px;
  }
}

@media (hover: hover) and (max-height: 880px) and (min-width: 720px) {
  main > #stories {
    max-width: 320px;
    max-height: 568px;
  }
}

#stories {
  display: grid;
  grid: 1fr / auto-flow 100%;
  grid-gap: 1ch;
  gap: 1ch;
  overflow-x: auto;
  -ms-scroll-snap-type: x mandatory;
  scroll-snap-type: x mandatory;
  -ms-scroll-chaining: none;
  overscroll-behavior: contain;
  touch-action: pan-x;
}

.time {
  /* outer */
  scroll-snap-align: start;
  scroll-snap-stop: always;

  /* inner */
  display: grid;
  grid: [story] 1fr / [story] 1fr;
}

.story {
  grid-area: story;
  background-size: cover;
  background-image: var(--bg), linear-gradient(to top, rgb(249, 249, 249), rgb(226, 226, 226));
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  touch-action: manipulation;
  transition: opacity 0.3s cubic-bezier(0.4, 0, 1, 1);
}

.story.seen {
  opacity: 0;
  pointer-events: none;
}

@-webkit-keyframes octocat-wave {
  0%,
  100% {
    transform: rotate(0);
  }
  20%,
  60% {
    transform: rotate(-25deg);
  }
  40%,
  80% {
    transform: rotate(10deg);
  }
}

@keyframes octocat-wave {
  0%,
  100% {
    transform: rotate(0);
  }
  20%,
  60% {
    transform: rotate(-25deg);
  }
  40%,
  80% {
    transform: rotate(10deg);
  }
}
</style>
