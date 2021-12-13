<template>
  <div class="walletConnect">
    <div v-if="address">{{ address }}</div>
    <A @onClicked="onConnectButtonClicked">Connect</A>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import WalletConnectProvider from '@walletconnect/web3-provider'
import A from '~/basics/A.vue'

@Component({
  components: { A },
})
export default class WalletConnect extends Vue {
  private async onConnectButtonClicked() {
    try {
      const provider = this.getProvider()
      await provider.enable()
    } catch (e) {
      console.log(e)
    }
  }

  private getProvider(): WalletConnectProvider {
    return this.$walletConnect.getNewProvider()
  }

  private get address(): string {
    return this.$store.state.wallet.address
  }
}
</script>

<style scoped lang="stylus">
@require '~@/assets/style/variables.styl'
</style>
