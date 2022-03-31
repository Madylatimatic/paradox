export interface QRKeyResult {
  data: {
    code: number
    unikey: string
  }
}

export interface QRResult {
  data: {
    qrurl: string
    qrimg: string
  }
}
