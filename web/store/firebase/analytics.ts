import { FirebaseAnalyticsState } from '~/types/state'
import { GAEventNAME, GAEventPage } from '~/types/dto'

const initialState = (): FirebaseAnalyticsState => {
  return {}
}

export const state = (): FirebaseAnalyticsState => initialState()

export const mutations = {}

export const actions = {
  sendPageEvent({ rootState }, page: GAEventPage) {
    const userId: string = (rootState as any).firebase.auth.id
    if (!userId) {
      return
    }
    const email: string = (rootState as any).firebase.auth.email
    if (!email) {
      return
    }
    const _this: any = this
    _this.$fire.analytics.logEvent(GAEventNAME.access, {
      page,
      userId,
      email,
    })
  },
  sendChangePlaylistEvent({ rootState }, playlistName: string) {
    const userId: string = (rootState as any).firebase.auth.id
    if (!userId) {
      return
    }
    const email: string = (rootState as any).firebase.auth.email
    if (!email) {
      return
    }
    const _this: any = this
    _this.$fire.analytics.logEvent(GAEventNAME.changePlaylist, {
      playlistName,
      userId,
      email,
    })
  },
  sendChangeArtEvent({ rootState }) {
    const userId: string = (rootState as any).firebase.auth.id
    if (!userId) {
      return
    }
    const email: string = (rootState as any).firebase.auth.email
    if (!email) {
      return
    }
    const _this: any = this
    _this.$fire.analytics.logEvent(GAEventNAME.changeArt, {
      userId,
      email,
    })
  },
  sendPlaylistChangedEvent({ rootState }, playlistId: string) {
    const userId: string = (rootState as any).firebase.auth.id
    if (!userId) {
      return
    }
    const email: string = (rootState as any).firebase.auth.email
    if (!email) {
      return
    }
    const _this: any = this
    _this.$fire.analytics.logEvent(GAEventNAME.playlistChanged, {
      userId,
      email,
      playlistId,
    })
  },
  sendArtChangedEvent({ rootState }) {
    const userId: string = (rootState as any).firebase.auth.id
    if (!userId) {
      return
    }
    const email: string = (rootState as any).firebase.auth.email
    if (!email) {
      return
    }
    const _this: any = this
    _this.$fire.analytics.logEvent(GAEventNAME.artChanged, {
      userId,
      email,
    })
  },
}

export const getters = {}
