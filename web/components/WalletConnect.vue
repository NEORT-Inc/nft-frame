<template>
  <div class="walletConnect">
    <div v-if="address">{{ address }}</div>
    <Button
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

  private get buttonStyle(): ButtonStyle {
    return ButtonStyle.FILL_BLACK
  }
}
</script>

<style scoped lang="stylus">
@require '~@/assets/style/variables.styl'
</style>
