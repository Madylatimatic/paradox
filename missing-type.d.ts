type ErrorHandler = (error: Error) => void

declare module 'qrcode' {
  function toCanvas(el: HTMLElement | null, url: string, errorHandler: ErrorHandler): void
}

declare interface Window {
  _AMapSecurityConfig: {
    securityJsCode: string
  }
  AMap: import('./src/utils/AMap').IAMap
}

declare interface CSSProperties {
  '--bg': string
}
