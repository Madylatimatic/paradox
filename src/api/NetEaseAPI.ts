import axios from 'axios'

const NetEaseAPI = axios.create({
  baseURL: 'http://localhost:4000',
  withCredentials: true
})

NetEaseAPI.interceptors.request.use((request) => {
  console.log('MusicApi Request: ' + JSON.stringify(request))
  return request
})

NetEaseAPI.interceptors.response.use((response) => {
  console.log('MusicApi Response: ' + JSON.stringify(response.data))
  return response
})

export default NetEaseAPI
