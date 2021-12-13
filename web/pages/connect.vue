<template>
  <div class="connectPage">
    <div class="contentsContainer">
      <WalletConnect />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import WalletConnect from '~/components/WalletConnect.vue'
@Component({
  components: {
    WalletConnect,
  },
})
export default class ConnectPage extends Vue {}
</script>

<style scoped lang="stylus">
@require '~@/assets/style/variables.styl'
@require '~@/assets/style/mixin.styl'
</style>
