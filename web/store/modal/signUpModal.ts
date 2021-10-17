import { SignUpModalState } from '~/types/state'

export const state = (): SignUpModalState => ({
  isModalShowing: false,
  pendingAction: null,
})

export const mutations = {
  setModalShowing(state: SignUpModalState, isShowing: boolean) {
    state.isModalShowing = isShowing
  },
  setPendingAction(
    state: SignUpModalState,
    pendingAction: (() => void) | null
  ) {
    state.pendingAction = pendingAction
  },
}

export const actions = {
  open({ commit }, pendingAction: (() => void) | null) {
    commit('setModalShowing', true)

    if (pendingAction) {
      commit('setPendingAction', pendingAction)
    }
  },
  close({ commit, state }) {
    const pendingAction: (() => void) | null = state.pendingAction
    if (pendingAction) {
      pendingAction()
    }
    commit('setModalShowing', false)
    commit('setPendingAction', null)
  },
}
