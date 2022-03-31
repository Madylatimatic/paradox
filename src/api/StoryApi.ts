import axios from 'axios'

const StoryApi = axios.create({
  baseURL: 'http://localhost:8080'
})

StoryApi.interceptors.request.use((request) => {
  console.log('StoryApi Request:' + JSON.stringify(request))
  return request
})

StoryApi.interceptors.response.use((response) => {
  console.log('StoryApi Response:' + JSON.stringify(response.data))
  return response
})

export default StoryApi
