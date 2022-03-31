<template>
  <div id="area"></div>
  <HomePanel />
  <HomeMap />
</template>
<script setup lang="ts">
import HomeMap from './HomeMap.vue'
import HomePanel from './HomePanel.vue'
</script>
<style>
#home-panel {
  display: grid;
  grid-template-columns: min-content min-content;
  grid-template-rows: min-content;
  z-index: 3;
}

#voice,
#back {
  grid-column: 1 / 2;
  grid-row: 1 / 2;
}

#listen {
  grid-column: 2 / 3;
  grid-row: 1 / 2;
}

#voice,
#listen {
  z-index: 1;
}

#back,
#search {
  z-index: 2;
}

#back {
  visibility: hidden;
}

.icon_button {
  height: 40px;
  width: 40px;
  background-color: rgb(241, 243, 244);
  border-radius: 50%;
  border: 0;
  margin: 10px 0 10px 10px;
}

#search {
  width: 300px;
  border-radius: 100px / 90px;
  background-color: rgb(241, 243, 244);
  padding: 0 30px;
  outline: none;
  grid-column: 2 / 3;
  grid-row: 1 / 2;
  margin: 10px 0 10px 10px;
  visibility: hidden;
}

#area {
  padding: 1em;
  z-index: 3;
  background-color: transparent;
  box-shadow: 0 80px #a9abab88;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1em;
  height: calc(99vh - 90px);
  overflow: hidden;
}

#area button {
  margin-left: auto;
  border-radius: 35px;
  color: white;
  border: 10px solid transparent;
  background-clip: padding-box;
  background-color: #a9abab;
  width: 70px;
  height: 70px;
  font-size: 20px;
  transform: scale(0.75);
}

#music-list {
  display: flex;
  flex-direction: row;
  width: 90%;
  align-items: center;
  gap: 1em;
  background-color: aliceblue;
  padding: 0 1em;
  border-radius: 50px;
}

#container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

#arc {
  pointer-events: none;
}
</style>
