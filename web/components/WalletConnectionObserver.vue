<template>
  <div class="walletConnectionObserver"></div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'
import WalletConnectProvider from '@walletconnect/web3-provider'

@Component({
  components: {},
})
export default class WalletConnectionObserver extends Vue {
  @Watch('$store.state.wallet.walletConnectProviderId')
  private onWalletConnectProviderChanged(id: number) {
    console.log(`onWalletConnectProviderChanged: ${id}`)

    const provider = this.walletConnectProvider()
    const isWalletConnect = provider.connected
    this.$store.dispatch('wallet/setIsWalletConnect', isWalletConnect)
    this.observeWalletConnect(provider.connector)
  }

  mounted() {
    try {
      let isWalletConnect = false
      const _walletConnectProvider = this.walletConnectProvider()
      if (_walletConnectProvider) {
        const connector = _walletConnectProvider.connector
        this.observeWalletConnect(connector)
        isWalletConnect = connector.connected
        this.$store.dispatch('wallet/setIsWalletConnect', isWalletConnect)

        if (isWalletConnect) {
          if (connector.accounts.length > 0) {
            this.setAddress(connector.accounts[0])
            this.setNetworkId(connector.chainId)
          }
          console.log(`connector.connected: ${connector.connected}`)
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  private observeWalletConnect(connector: any) {
    connector.on('connect', (error, payload) => {
      if (error) {
        this.$snackbar.error(error)
        return
      }
      const result = payload.params[0]
      console.log('connected.')
      const address = result.accounts.length > 0 ? result.accounts[0] : ''
      const chainId = result.chainId
      this.setAddress(address)
      this.setNetworkId(chainId)
      this.$store.dispatch('wallet/setIsWalletConnect', true)
    })

    connector.on('session_update', (error, _payload) => {
      if (error) {
        this.$snackbar.error(error)
        return
      }
      console.log('session updated.')
    })

    connector.on('disconnect', (error, _payload) => {
      if (error) {
        this.$snackbar.error(error)
        return
      }
      console.log('disconnect')
      this.setAddress('')
      this.$store.dispatch('wallet/setIsWalletConnect', false)
    })
  }

  private setAddress(address: string) {
    this.$store.dispatch('wallet/setAddress', address)
  }

  private setNetworkId(chainId: number) {
    this.$store.dispatch('wallet/setNetworkId', chainId)
  }

  private walletConnectProvider(): WalletConnectProvider {
    return this.$walletConnect.getProvider()
  }
}
</script>
