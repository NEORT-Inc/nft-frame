<template>
  <div class="walletConnectButton">
    <div v-if="address">
      <div>{{ address }}</div>
      <A v-if="isWalletConnected" @onClicked="onDisconnectButtonClicked"
        >Disconnect</A
      >
    </div>
    <Button
      v-else
      class="addArtButton"
      :button-style="buttonStyle"
      @onClicked="onConnectButtonClicked"
    >
      <span class="label">Connect</span>
    </Button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import WalletConnectProvider from '@walletconnect/web3-provider'
import A from '~/basics/A.vue'
import Button from '~/basics/Button.vue'
import { ButtonStyle } from '~/types/dto'

@Component({
  components: { Button, A },
})
export default class WalletConnectButton extends Vue {
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

  private onDisconnectButtonClicked() {
    if (this.isWalletConnected) {
      this.getProvider().connector.killSession()
    }
  }

  private get address(): string {
    return this.$store.state.wallet.address
  }

  private get buttonStyle(): ButtonStyle {
    return ButtonStyle.FILL_BLACK
  }

  private get isWalletConnected(): boolean {
    return this.$store.state.wallet.isWalletConnect
  }
}
</script>

<style scoped lang="stylus">
@require '~@/assets/style/variables.styl'
</style>
