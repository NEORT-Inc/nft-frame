import CryptoJS from 'crypto-js'

export const encryptionUtil = {
  encrypt(object: any, encryptionKey: string): string {
    return CryptoJS.AES.encrypt(
      JSON.stringify(object),
      encryptionKey
    ).toString()
  },
  decrypt(encryptedObjectString: string, encryptionKey: string): object {
    const bytes = CryptoJS.AES.decrypt(encryptedObjectString, encryptionKey)
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
  },
}
