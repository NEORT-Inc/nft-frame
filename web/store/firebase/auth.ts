import { FirebaseAuthState } from '~/types/state'

const initialState = (): FirebaseAuthState => {
  return {
    loading: true,
    id: '',
    token: '',
    email: '',
    isEmailVerified: false,
  }
}

export const state = (): FirebaseAuthState => initialState()

export const mutations = {
  RESET_STORE: (state: FirebaseAuthState) => {
    Object.assign(state, initialState(), { loading: false })
  },
  SET_LOADING(state: FirebaseAuthState, loading: boolean) {
    state.loading = loading
  },
  SET_ID: (state: FirebaseAuthState, id: string) => {
    state.id = id
  },
  SET_TOKEN(state: FirebaseAuthState, token: string) {
    state.token = token
  },
  SET_EMAIL(state: FirebaseAuthState, email: string) {
    state.email = email
  },
  IS_EMAIL_VERIFIED(state: FirebaseAuthState, isEmailVerified: boolean) {
    state.isEmailVerified = isEmailVerified
  },
}

export const actions = {
  clear({ commit }) {
    commit('RESET_STORE')
  },
  async onAuthStateChanged(
    { commit, dispatch, _getters },
    { authUser, _, token }
  ) {
    console.log(authUser)

    if (!authUser) {
      // Try to restore user from cookie
      await dispatch('auth/signInWithEmailFromCookie', null, {
        root: true,
      })
      commit('SET_LOADING', false)
      return
    }
    commit('SET_ID', authUser.uid)
    commit('SET_EMAIL', authUser.email)
    commit('IS_EMAIL_VERIFIED', authUser.emailVerified)

    if (token) {
      commit('SET_TOKEN', token)
    } else if (authUser.getIdToken) {
      try {
        const token = await authUser.getIdToken(true)
        commit('SET_TOKEN', token)
      } catch (e) {
        console.log(e)
      }
    }
    commit('SET_LOADING', false)
  },
}

export const getters = {}
