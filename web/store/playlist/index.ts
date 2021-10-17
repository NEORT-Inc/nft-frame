import { PlaylistState } from '~/types/state'
import { Art, DAILY_PLAYLIST, Playlist } from '~/types/dto'

export const state = (): PlaylistState => ({
  loading: false,
  arts: [],
  currentArtIndex: 0,
  currentPlaylistId: '',
  currentPlaylistName: '',
  playlists: [],
})

export const mutations = {
  setLoading(state: PlaylistState, isLoading: boolean) {
    state.loading = isLoading
  },
  setArts(state: PlaylistState, arts: Art[]) {
    state.arts = arts
  },
  setCurrentArtIndex(state: PlaylistState, index: number) {
    state.currentArtIndex = index
  },
  setCurrentPlaylistId(state: PlaylistState, playlistId: string) {
    state.currentPlaylistId = playlistId
  },
  setCurrentPlaylistName(state: PlaylistState, name: string) {
    state.currentPlaylistName = name
  },
  setPlaylists(state: PlaylistState, playlists: Playlist[]) {
    state.playlists = playlists
  },
}

export const actions = {
  setArts({ commit }, arts: Art[]) {
    commit('setArts', arts)
  },
  setCurrentArtIndex({ commit }, index: number) {
    commit('setCurrentArtIndex', index)
  },
  setCurrentPlaylistId({ commit }, playlistId: string) {
    commit('setCurrentPlaylistId', playlistId)
  },
  setCurrentPlaylistName({ commit }, playlistName: string) {
    commit('setCurrentPlaylistName', playlistName)
  },
  setPlaylists({ commit }, playlists: Playlist[]) {
    commit('setPlaylists', playlists)
  },
  clear({ commit }) {
    commit('setArts', [])
    commit('setCurrentArtIndex', 0)
    commit('setCurrentPlaylistId', '')
    commit('setCurrentPlaylistName', '')
    commit('setPlaylists', [])
  },
}

export const getters = {
  isDailyPlaylist: (state: PlaylistState) => (): boolean => {
    return state.currentPlaylistId === DAILY_PLAYLIST.id
  },
}
