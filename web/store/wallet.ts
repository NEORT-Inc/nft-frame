import { WalletState } from '~/types/state'
import { statProvider } from '~/util/statProvider'

export const state = (): WalletState => ({
  address: '',
  networkId: -1,
  isWalletConnect: false,
  walletConnectProviderId: 0,
})

export const mutations = {
  setAddress(state: WalletState, address: string) {
    state.address = address
  },
  setNetworkId(state: WalletState, networkId: number) {
    state.networkId = networkId
  },
  setIsWalletConnect(state: WalletState, isWalletConnect: boolean) {
    state.isWalletConnect = isWalletConnect
  },
  setWalletConnectProviderId(state: WalletState, id: number) {
    state.walletConnectProviderId = id
  },
}

export const actions = {
  setAddress({ commit }, address: string) {
    commit('setAddress', address)
  },
  setNetworkId({ commit }, networkId: number) {
    commit('setNetworkId', networkId)
  },
  setIsWalletConnect({ commit }, isWalletConnect) {
    commit('setIsWalletConnect', isWalletConnect)
  },
  updateWalletConnectProviderId({ commit }) {
    commit('setWalletConnectProviderId', Math.floor(new Date().getTime()))
  },
}

export const getters = {
  isWalletConnected: (state: WalletState) => (): boolean => {
    return !!state.address
  },
  isCorrectNetwork: (state: WalletState) => (): boolean => {
    return state.networkId === statProvider.networkId()
  },
}
