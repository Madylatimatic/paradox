<template>
  <h6 v-for="[time] of storiesMap" :key="time">
    <h2>{{ time }}</h2>
    <el-upload
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :file-list="_fileListarray.get(time)?.value || []"
    >
      <el-icon><Plus /></el-icon>
    </el-upload>
  </h6>
  <p class="flex-center">
    <el-button color="#626aef" style="color: white" @click="onComit">确认</el-button>
    <el-button color="#626aef" plain @click="onCancel">取消</el-button>
  </p>
</template>

<script lang="ts" setup>
import { getCurrentInstance, Ref, ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import * as qiniu from 'qiniu-js'

import { UploadProps, UploadUserFile } from 'element-plus'
import StoryApi from '../api/StoryApi'

const self = getCurrentInstance()!.appContext.config
  .globalProperties as import('../utils/GlobalProperties').GlobalProperties

const storiesMap = self.$store.stories

// initalize picture
let _fileListarray = new Map<string, Ref<UploadUserFile[]>>()
for (const [time, time_map] of storiesMap) {
  let _fileList = []
  for (const [storyid, picture] of time_map) {
    _fileList.push({
      name: storyid.toString() + ':' + picture.substring(picture.lastIndexOf('/') + 1),
      url: picture
    })
  }
  console.log(_fileList)
  _fileListarray.set(time, ref<UploadUserFile[]>(_fileList))
}

const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}

const onCancel = () => {
  self.$router.push('/home')
}

const onComit = async () => {
  const { data } = await StoryApi.get('/qiniu/token')
  const token = data.token as string

  const observer = {
    error() {
      self.$pop('上传失败')
    },
    complete() {
      self.$pop('上传成功')
    }
  }
  for (const [time, filesref] of _fileListarray) {
    let time_map = storiesMap.get(time)
    for (let { name, raw } of filesref.value) {
      const splits = name.split(':')
      name = splits[1]
      if (time_map?.get(parseInt(splits[0])) === undefined) {
        qiniu.upload(raw!, undefined, token).subscribe(observer)
      }
    }
  }
}
</script>
<style>
p {
  margin: 1em;
}
</style>
