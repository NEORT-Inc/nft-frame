export const fileUtil = {
  isImage(url: string): boolean {
    const ext = this.getExt(url)
    return ext === 'gif' || ext === 'jpg' || ext === 'jpeg' || ext === 'png'
  },
  isVideo(url: string): boolean {
    const ext = this.getExt(url)
    return ext === 'mp4'
  },
  getExt(url: string): string {
    const name = (url.split('.').pop() || '').toLowerCase()
    if (name.includes('?')) {
      return name.substring(0, name.indexOf('?'))
    } else {
      return name
    }
  },
}
