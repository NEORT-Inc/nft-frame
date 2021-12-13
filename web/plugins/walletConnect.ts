import { Plugin } from '@nuxt/types'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { statProvider } from '~/util/statProvider'

// Define so an error cannot be thrown in Vue components
declare module 'vue/types/vue' {
  interface Vue {
    $walletConnect: any
  }
}

const _createProvider = () => {
  const opt = {
    rpc: {},
  }
  opt.rpc[statProvider.networkId()] = process.env.RPC_NODE_URL
  return new WalletConnectProvider(opt)
}

// eslint-disable-next-line no-empty-pattern
const walletConnectPlugin: Plugin = ({ store }, inject) => {
  class WalletConnectObj {
    constructor(public provider: WalletConnectProvider | null = null) {}

    setProvider(_provider: WalletConnectProvider) {
      this.provider = _provider
    }

    getNewProvider(): WalletConnectProvider {
      const _provider = _createProvider()
      this.setProvider(_provider)
      store.dispatch('wallet/updateWalletConnectProviderId')
      return _provider
    }

    getProvider(): WalletConnectProvider {
      if (!this.provider) {
        this.provider = _createProvider()
      }
      return this.provider
    }
  }
  inject('walletConnect', new WalletConnectObj())
}

export default walletConnectPlugin
