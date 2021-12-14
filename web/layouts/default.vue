<template>
  <div>
    <div>
      <Header v-if="showHeader" />
      <Nuxt />
      <WalletConnectionObserver />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import WalletConnectionObserver from '~/components/WalletConnectionObserver.vue'
import Header from '~/components/Header.vue'

@Component({
  components: { Header, WalletConnectionObserver },
})
export default class extends Vue {
  private get showHeader(): boolean {
    console.log(this.$route.name)
    return this.$route.name !== 'index' && this.$route.name !== 'signin-id'
  }
}
</script>

<style lang="stylus">
@require '~@/assets/style/common.styl'
</style>
