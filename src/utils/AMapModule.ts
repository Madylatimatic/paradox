import StoryApi from '../api/StoryApi'
import AMapLoader from '@amap/amap-jsapi-loader'

interface AMapToken {
  securitykey: string
  key: string
}

const { data: token } = await StoryApi.get<AMapToken>('/amap/token')
window._AMapSecurityConfig = {
  securityJsCode: token.securitykey
}
console.log(token)
const AMapModule = await AMapLoader.load({
  key: token.key,
  version: '2.0',
  plugins: ['AMap.ToolBar', 'AMap.Driving'],
  AMapUI: {
    version: '1.1',
    plugins: []
  },
  Loca: {
    version: '2.0.0'
  }
})
export default AMapModule
