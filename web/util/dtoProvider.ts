import { Art, FrameSignInInfo } from '~/types/dto'

export const dtoProvider = {
  getEmptyFrameSignInInfo: (): FrameSignInInfo => {
    return {
      email: '',
      password: '',
    }
  },
  getArt: (id: string, artData: any): Art => {
    return {
      id,
      media: artData.media,
      mediaType: artData.mediaType,
      siteTitle: artData.siteTitle,
      siteFavIconUrl: artData.siteFavIconUrl,
      siteUrl: artData.siteUrl,
      createdAt: artData.createdAt,
    }
  },
}
