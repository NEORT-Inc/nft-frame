<template>
  <header class="header" :class="{ sp: $device.isMobile }">
    <div class="container">
      <div class="logoContainer"></div>
      <WalletConnectButton />
    </div>
  </header>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import WalletConnectButton from '~/components/WalletConnectButton.vue'

@Component({
  components: { WalletConnectButton },
})
export default class Header extends Vue {}
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
