import { ArtsState } from '~/types/state'
import { getArts } from '~/api/openSeaApiClient'
import { AppError, Art2, ErrorType, MediaType } from '~/types/dto'
import { fileUtil } from '~/util/fileUtil'

export const state = (): ArtsState => ({
  items: [],
})

export const mutations = {
  setItems(state: ArtsState, items: Art2[]) {
    state.items = items
  },
}

export const actions = {
  async fetchArts({ commit, rootState }) {
    const address = (rootState as any).wallet.address
    if (!address) {
      throw new AppError('address is empty.', ErrorType.GENERAL)
    }
    const result = await getArts((this as any).$axios, address)
    commit('setItems', result.assets)
  },
}

export const getters = {
  mediaType:
    () =>
    (art: Art2): MediaType | null => {
      if (art.animation_url) {
        if (fileUtil.isVideo(art.animation_url)) {
          return MediaType.VIDEO
        } else if (fileUtil.maybeHTML(art.animation_url)) {
          return MediaType.IFRAME
        }
      } else if (art.image_url) {
        return MediaType.IMG
      }
      return null
    },
}
