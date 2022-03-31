import { ErrorHandler } from '../../missing-type'

declare module 'qrcode' {
  function toCanvas(el: HTMLElement | null, url: string, errorHandler: ErrorHandler): void
}
