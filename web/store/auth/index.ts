import Cookies from 'js-cookie'
import firebase from 'firebase/app'
import { AuthState } from '~/types/state'
import {
  signInToWithEmail,
  signUpWithEmail,
  resetPassword,
} from '~/api/emailSigninApiClient'
import { AppError, ErrorType } from '~/types/dto'
import UserCredential = firebase.auth.UserCredential
import { encryptionUtil } from '~/util/encryptionUtil'

const PASSWORD_LIMIT_MIN = 10
const EMAIL_SIGNIN_ENCRYPTION_KEY = 'email_signin_encryption_key'
const COOKIE_KEY_EMAIL_SIGNIN_INFO = `__ckesi`

const initialState = (): AuthState => {
  return {
    loading: false,
    emailName: '',
  }
}

export const state = (): AuthState => initialState()

export const mutations = {
  RESET_STORE: (state: AuthState) => {
    Object.assign(state, initialState(), { loading: false })
  },
  SET_LOADING(state: AuthState, loading: boolean) {
    state.loading = loading
  },
  SET_EMAIL_NAME(state: AuthState, emailName: string) {
    state.emailName = emailName
  },
}

export const actions = {
  async signUpWithEmail(
    { commit },
    payload: { email: string; password: string }
  ): Promise<void> {
    const _this: any = this
    try {
      commit('SET_LOADING', true)
      const data: UserCredential = await signUpWithEmail(
        _this.$fire,
        payload.email,
        payload.password
      )
      if (data.user) {
        await data.user.sendEmailVerification({
          url: `${process.env.BASE_URL}/welcome`,
          handleCodeInApp: false,
        })
      }
      if (data.additionalUserInfo && data.additionalUserInfo.isNewUser) {
        // TODO: wait for email verification.
      } else {
        console.log('It is not new user.')
      }
    } finally {
      commit('SET_LOADING', false)
    }
  },
  async signUpAfterEmailVerification({ rootGetters }): Promise<boolean> {
    const isEmailVerified = rootGetters['firebase/auth/isEmailVerified']()
    return await Promise.resolve(isEmailVerified)
  },
  async signInWithEmail(
    { commit },
    payload: { email: string; password: string; shouldStore: boolean }
  ): Promise<void> {
    const _this: any = this
    try {
      commit('SET_LOADING', true)
      const data: UserCredential = await signInToWithEmail(
        _this.$fire,
        payload.email,
        payload.password
      )
      if (data.additionalUserInfo && data.additionalUserInfo.isNewUser) {
        // TODO: Sign up
      } else {
        // TODO: Sign in
      }
      if (payload.shouldStore) {
        // Save info to cookie so that the user can be restored when it was logged out unintentionally on frame
        const emailSigninInfo = encryptionUtil.encrypt(
          {
            email: payload.email,
            password: payload.password,
          },
          EMAIL_SIGNIN_ENCRYPTION_KEY
        )
        Cookies.set(COOKIE_KEY_EMAIL_SIGNIN_INFO, emailSigninInfo, {
          expires: 365,
        })
      }
    } finally {
      commit('SET_LOADING', false)
    }
  },
  async signInWithEmailFromCookie({ dispatch }): Promise<void> {
    const emailSigninInfoString: string = Cookies.get(
      COOKIE_KEY_EMAIL_SIGNIN_INFO
    )
    if (!emailSigninInfoString) {
      return
    }
    const decryptedInfo: any = encryptionUtil.decrypt(
      emailSigninInfoString,
      EMAIL_SIGNIN_ENCRYPTION_KEY
    )
    return await dispatch('signInWithEmail', {
      email: decryptedInfo.email,
      password: decryptedInfo.password,
      shouldStore: false,
    })
  },
  async syncEmailLinkedState({ commit, rootGetters }): Promise<void> {
    const _this: any = this
    const accountName = rootGetters['firebase/auth/getEmailName'](_this.$fire)
    commit('SET_EMAIL_NAME', accountName)
    await null
  },
  clear({ commit }) {
    commit('RESET_STORE')
  },
  validateEmailAndPassword(
    { _ },
    payload: { email: string; password: string; passwordConfirmation: string }
  ) {
    if (!payload.email || !payload.password || !payload.passwordConfirmation) {
      throw new AppError('空の項目があります。', ErrorType.INVALID_SIGNUP)
    }
    if (payload.password !== payload.passwordConfirmation) {
      throw new AppError('パスワードが一致しません。', ErrorType.INVALID_SIGNUP)
    }
    if (payload.password.length < PASSWORD_LIMIT_MIN) {
      throw new AppError(
        `パスワードは${PASSWORD_LIMIT_MIN}文字以上にしてください。`,
        ErrorType.INVALID_SIGNUP
      )
    }
  },
  async resetPassword({ _ }, email: string): Promise<void> {
    if (!email) {
      throw new AppError('Email is empty.', ErrorType.EMPTY_EMAIL_OR_PASSWORD)
    }
    return await resetPassword(email).catch((error: AppError) => {
      console.log(error)
      throw new AppError(error.message, ErrorType.EMPTY_EMAIL_OR_PASSWORD)
    })
  },
}

export const getters = {
  isSignedIn: (_state: AuthState, _getters, rootState) => (): boolean => {
    return !!(rootState as any).firebase.auth.id
  },
  isEmailLinked: (state: AuthState) => (): boolean => {
    return !!state.emailName
  },
  canUnlink: (_: AuthState, getters) => (): boolean => {
    const accountStates = [getters.isEmailLinked()]
    const linkedCount = accountStates.filter((value: boolean) => {
      return value
    }).length

    return linkedCount > 1
  },
}
