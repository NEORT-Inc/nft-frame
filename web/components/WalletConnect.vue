<template>
  <div class="walletConnect">
    <A @onClicked="onConnectButtonClicked">Connect</A>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { providers } from 'ethers'
import A from '~/basics/A.vue'

@Component({
  components: { A },
})
export default class WalletConnect extends Vue {
  private async onConnectButtonClicked() {
    try {
      const provider = new WalletConnectProvider({
        infuraId: 'f413740588cc49c78bd1ced2f2bdd24bs',
      })
      await provider.enable()
      const web3Provider = new providers.Web3Provider(provider)
      console.log('hoge')
      console.log(web3Provider)
    } catch (e) {
      console.log(e)
    }
  }

  private get ethereum(): any | null {
    return this.$ethereum
  }
}
</script>

<style scoped lang="stylus">
@require '~@/assets/style/variables.styl'
</style>
