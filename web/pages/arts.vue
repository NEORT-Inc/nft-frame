<template>
  <div class="artsPage" :class="{ sp: $device.isMobile }">
    <SignInView v-if="!isSignedIn" @onSignInSucceeded="onSignInSucceeded" />
    <OpenSeaAssetContainer v-else-if="isWalletConnected" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import OpenSeaAssetContainer from '~/components/OpenSeaAssetContainer.vue'
import SignInModal from '~/components/SignInModal.vue'
import SignInView from '~/components/SignInView.vue'

@Component({
  components: {
    SignInView,
    SignInModal,
    OpenSeaAssetContainer,
  },
})
export default class ArtsPage extends Vue {
  private onSignInSucceeded() {
    console.log('succeeded.')
  }

  private get isWalletConnected(): boolean {
    return this.$store.state.wallet.isWalletConnect
  }

  private get isSignedIn(): boolean {
    return this.$store.getters['auth/isSignedIn']()
  }
}
</script>

<style scoped lang="stylus">
@require '~@/assets/style/variables.styl'
@require '~@/assets/style/mixin.styl'
</style>
