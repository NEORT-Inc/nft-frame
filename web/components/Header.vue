<template>
  <header class="header" :class="{ sp: $device.isMobile }">
    <div class="container">
      <div class="logoContainer"></div>
      <WalletConnectButton />
      <div v-if="isSignedIn">
        <A @onClicked="onSignOutButtonClicked">Sign-Out</A>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import WalletConnectButton from '~/components/WalletConnectButton.vue'
import A from '~/basics/A.vue'

@Component({
  components: { A, WalletConnectButton },
})
export default class Header extends Vue {
  private onSignOutButtonClicked() {
    if (!window.confirm('Are you sure to sign out?')) {
      return
    }
    this.$store.dispatch('frame/signIn/signOut')
  }

  private get isSignedIn(): boolean {
    return this.$store.getters['auth/isSignedIn']()
  }
}
</script>

<style scoped lang="stylus">
@require '~@/assets/style/variables'
@require '~@/assets/style/mixin.styl'

.header
  width 100%
  height $header_height
  padding 0 $padding_48
  background $white_fff

  .container
    height: 100%;
    display flex
    align-items center
    margin 0 auto

    .logoContainer
      flex 1

    .connectionButton
      padding-left $padding_16

  &.sp
    padding 0 $padding_16
</style>
