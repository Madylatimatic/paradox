import { GlobalProperties } from './GlobalProperties'

export const routeNormalLogin = (self: GlobalProperties) => {
  self.$router.push('/login')
}

export const routeSMSLogin = (self: GlobalProperties) => {
  self.$router.push('/smslogin')
}

export const routeQRLogin = (self: GlobalProperties) => {
  self.$router.push('/qrlogin')
}

export const routeHome = (self: GlobalProperties, userid: number) => {
  self.$router.push('/home')
  self.$store.userid = userid
  console.log(userid)
}
