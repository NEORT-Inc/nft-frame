export const fileUtil = {
  isImage(url: string): boolean {
    const ext = this.getExt(url)
    return ext === 'gif' || ext === 'jpg' || ext === 'jpeg' || ext === 'png'
  },
  isVideo(url: string): boolean {
    const ext = this.getExt(url)
    return ext === 'mp4'
  },
  maybeHTML(url: string): boolean {
    const ext = this.getExt(url)
    return !!url && ext === ''
  },
  getExt(url: string): string {
    let ext = (url.split('.').pop() || '').toLowerCase()
    if (ext.includes('?')) {
      ext = ext.substring(0, ext.indexOf('?'))
    }
    if (ext.length > 4) {
      return ''
    }
    return ext
  },
}
