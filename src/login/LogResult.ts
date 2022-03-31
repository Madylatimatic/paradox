export default interface LogResult {
  loginType: number
  code: number
  account: {
    id: number
    userName: string
    type: number
    status: number
    whitelistAuthority: number
    createTime: number
    salt: string
    tokenVersion: number
    ban: number
    baoyueVersion: number
    donateVersion: number
    vipType: number
    viptypeVersion: number
    anonimousUser: boolean
    uninitialized: boolean
  }
  token: string
  profile: {
    userId: number
    followed: boolean
    backgroundUrl: string
    detailDescription: string
    userType: number
    backgroundImgIdStr: string
    gender: number
    accountStatus: number
    vipType: number
    avatarImgId: number
    nickname: string
    backgroundImgId: number
    birthday: number
    city: number
    avatarUrl: string
    defaultAvatar: boolean
    province: number
    expertTags: unknown
    experts: unknown
    mutual: boolean
    remarkName: unknown
    authStatus: number
    djStatus: number
    avatarImgIdStr: string
    description: string
    signature: string
    authority: number
    avatarImgId_str: string
    followeds: number
    follows: number
    eventCount: number
    avatarDetail: null
    playlistCount: number
    playlistBeSubscribedCount: number
  }
  bindings: [
    {
      userId: number
      url: string
      expired: boolean
      bindingTime: number
      tokenJsonStr: string
      expiresIn: number
      refreshTime: number
      id: number
      type: number
    },
    {
      userId: number
      url: string
      expired: true
      bindingTime: number
      tokenJsonStr: string
      expiresIn: number
      refreshTime: number
      id: number
      type: number
    }
  ]
  cookie: string
}
