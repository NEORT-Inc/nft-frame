<template>
  <div class="walletConnect">
    <div v-if="address">{{ address }}</div>
    <A @onClicked="onConnectButtonClicked">Connect</A>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { Web3Provider } from '@ethersproject/providers'
import { providers } from 'ethers'
import A from '~/basics/A.vue'

@Component({
  components: { A },
})
export default class WalletConnect extends Vue {
  private address: string = ''

  private async onConnectButtonClicked() {
    try {
      const provider = await this.getProvider()
      const signer = provider.getSigner()
      this.address = await signer.getAddress()
    } catch (e) {
      console.log(e)
    }
  }

  private async getProvider(): Promise<Web3Provider> {
    try {
      if (this.isSP) {
        const provider = new WalletConnectProvider({
          infuraId: 'f413740588cc49c78bd1ced2f2bdd24bs',
        })
        await provider.enable()
        return new providers.Web3Provider(provider)
      } else {
        return new providers.Web3Provider(this.ethereum)
      }
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  private get ethereum(): any | null {
    return this.$ethereum
  }

  private get isSP(): boolean {
    return (this as any).$device.isMobile
  }
}
</script>

<style scoped lang="stylus">
@require '~@/assets/style/variables.styl'
</style>
