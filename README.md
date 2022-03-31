# paradox 私密地图手账系统

## 简介

我们常常处于一种状态，与世界的关系若即若离。有时，我们渴望社交，渴望自己有很多朋友，渴望分享自己的事情。有时，我们被一堆烂摊子事所束缚，被一些无法放下的事情和情绪所包围，朋友很多，但都不想诉说，很累，反复内耗，直至麻木。不好的事情无法避免，坏情绪只能转移释放或者被覆盖。朋友圈记录生活固然可以让自己快乐，但发朋友圈何尝不是一件被形象所束缚的事情呢？
paradox 是一个几乎 0 社交的记录生活的网站，你可以将自己想要记录的事情都记录在这里。这是基于地图的记录方式，你可以在地图打标记点、在标记点里面记录生活的一点一滴。另外，你无需另外记住密码，请使用网易云账户进行登录，你还可以享受网易云的会员权益在本网站听歌。夜深人静之时，paradox 能带着网易云，陪你记录生活，沉浸在过去的回忆之中。正如 paradox 的中文意思——矛盾，paradox 也能满足你的分享欲，它提供了语音通话功能，让不在身边的密友或伴侣进入你的小世界，感觉最真实的你自己。

## 技术

paradox 使用 Vue3 + Binaryify/NeteaseCloudMusicApi(API) + Springboot + Mybatis-Plus + gorrilla/websocket 实现

1. 前端使用 Vue3 + Vue-Router + TypeScript + Vite，同时使用 Eslint + Prettier + lint-staged + husky 规范项目
2. 登录和搜歌听歌使用开源项目 Binaryify/NeteaseCloudMusicApi 作为 API 服务器，图片上传使用七牛云 SDK 结合后端实现，地图使用高德地图 API 实现
3. 使用 TypeScript 定义前后端交互接口类，补全多个 JS 库缺失的 TS 声明，使用 Axios 对多个服务端口分别进行配置
4. 后端使用 Springboot 实现标记点和故事管理，使用 go 语言的 gorrilla/websocket 结合浏览器的 WebRTC 接口实现语音通话
5. 本人后端很烂，等过几个月学成归来再将后端架构重构一遍 quq
