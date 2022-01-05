<template>
  <div class="artsPage" :class="{ sp: $device.isMobile }">
    <SignInOrSignUpView v-if="!isSignedIn" />
    <OpenSeaAssetContainer v-else-if="isWalletConnected" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import OpenSeaAssetContainer from '~/components/OpenSeaAssetContainer.vue'
import SignInOrSignUpView from '~/components/SignInOrSignUpView.vue'

@Component({
  components: {
    SignInOrSignUpView,
    OpenSeaAssetContainer,
  },
})
export default class ArtsPage extends Vue {
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
