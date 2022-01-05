import CryptoJS from 'crypto-js'
import firebase from 'firebase/app'
import { FrameSignInState } from '~/types/state'
import { FrameSignInInfo } from '~/types/dto'
import DocumentSnapshot = firebase.firestore.DocumentSnapshot
import DocumentData = firebase.firestore.DocumentData
import { dtoProvider } from '~/util/dtoProvider'

export const FRAME_SIGNIN_DB_COLLECTION = 'signins'
export const FRAME_SIGNOUT_DB_COLLECTION = 'signouts'
export const FRAME_SIGNIN_DB_ENCRYPTION_KEY = 'neort_frame_key'

export const state = (): FrameSignInState => ({
  loading: false,
  frameSignInInfo: dtoProvider.getEmptyFrameSignInInfo(),
  childChangedCallback: null,
  errorMessage: '',
})

export const mutations = {
  setLoading(state: FrameSignInState, isLoading: boolean) {
    state.loading = isLoading
  },
  setFrameSignInInfo(
    state: FrameSignInState,
    frameSignInInfo: FrameSignInInfo
  ) {
    state.frameSignInInfo = frameSignInInfo
  },
  setChildChangedCallback(state: FrameSignInState, callback: any) {
    state.childChangedCallback = callback
  },
  setErrorMessage(state: FrameSignInState, message: string) {
    state.errorMessage = message
  },
}

export const actions = {
  observeSignIn({ commit }, tempId: string) {
    const _this: any = this
    const childChangedCallback = _this.$fire.firestore
      .collection(FRAME_SIGNIN_DB_COLLECTION)
      .doc(tempId)
      .onSnapshot((snapshot: DocumentSnapshot<DocumentData>) => {
        const data = snapshot.data()
        const encryptedSignInInfo: string = data ? data.signInInfo : ''
        if (encryptedSignInInfo) {
          const bytes = CryptoJS.AES.decrypt(
            encryptedSignInInfo,
            FRAME_SIGNIN_DB_ENCRYPTION_KEY
          )
          commit(
            'setFrameSignInInfo',
            JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
          )
        }
      })
    commit('setChildChangedCallback', childChangedCallback)
  },
  observeSignOut({ rootState, dispatch }) {
    const userId: string = (rootState as any).firebase.auth.id
    if (!userId) {
      return
    }
    const _this: any = this
    _this.$fire.firestore
      .collection(FRAME_SIGNOUT_DB_COLLECTION)
      .doc(userId)
      .onSnapshot((snapshot: DocumentSnapshot<DocumentData>) => {
        const data = snapshot.data()
        const shouldSignOut: string = data ? data.signout : false
        if (shouldSignOut) {
          dispatch('auth/signout', null, {
            root: true,
          }).then(() => {
            try {
              _this.$fire.firestore.collection('users').doc(userId)
            } catch (e) {
              console.log(e)
            }
          })
        }
      })
  },
  async signIn(
    { commit, dispatch },
    payload: {
      tempId: string
      email: string
      password: string
    }
  ) {
    await dispatch(
      'auth/signInWithEmail',
      {
        email: payload.email,
        password: payload.password,
      },
      {
        root: true,
      }
    )
    const frameSignInInfo: FrameSignInInfo = {
      email: payload.email,
      password: payload.password,
    }
    const ciphertext = CryptoJS.AES.encrypt(
      JSON.stringify(frameSignInInfo),
      FRAME_SIGNIN_DB_ENCRYPTION_KEY
    ).toString()

    const _this: any = this
    // Send sign-in info
    try {
      await _this.$fire.firestore
        .collection(FRAME_SIGNIN_DB_COLLECTION)
        .doc(payload.tempId)
        .set({
          signInInfo: ciphertext,
        })
      // Delete immediately
      await _this.$fire.firestore
        .collection(FRAME_SIGNIN_DB_COLLECTION)
        .doc(payload.tempId)
        .delete()
      commit('setErrorMessage', '')
    } catch (e) {
      console.log(e)
      commit('setErrorMessage', 'Failed to send data.')
    }
  },
  async signOut({ commit, rootState, dispatch }) {
    const userId: string = (rootState as any).firebase.auth.id
    const _this: any = this
    // Send sign-in info
    try {
      console.log(userId)
      await _this.$fire.firestore
        .collection(FRAME_SIGNOUT_DB_COLLECTION)
        .doc(userId)
        .set({
          signout: true,
        })
      // Delete immediately
      await _this.$fire.firestore
        .collection(FRAME_SIGNOUT_DB_COLLECTION)
        .doc(userId)
        .delete()
      await dispatch('auth/signout', null, {
        root: true,
      })
      commit('setErrorMessage', '')
    } catch (e) {
      console.log(e)
      commit('setErrorMessage', 'Failed to send data.')
    }
  },
  clear({ state, commit }) {
    if (state.childChangedCallback) {
      state.childChangedCallback()
    }
    commit('setFrameSignInInfo', dtoProvider.getEmptyFrameSignInInfo())
    commit('setChildChangedCallback', null)
    commit('setErrorMessage', '')
  },
}
