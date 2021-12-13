<template>
  <div>
    <div>
      <Nuxt />
      <WalletConnectionObserver />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import WalletConnectionObserver from '~/components/WalletConnectionObserver.vue'

@Component({
  components: { WalletConnectionObserver },
})
export default class extends Vue {}
</script>

<style lang="stylus">
@require '~@/assets/style/common.styl'
</style>
