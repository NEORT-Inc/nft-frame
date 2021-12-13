<template>
  <div class="openSeaAssetContainer">
    <div v-for="(item, i) in arts" :key="i" class="innerContainer">
      <div>
        <OpenSeaAssetItem :art="item" />
        <AddArtButton :art="item" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'
import AddArtButton from '~/components/AddArtButton.vue'
import OpenSeaAssetItem from '~/basics/OpenSeaAssetItem.vue'

@Component({
  components: { OpenSeaAssetItem, AddArtButton },
})
export default class OpenSeaAssetContainer extends Vue {
  @Watch('$store.state.wallet.address')
  private onAddressChanged(address: string) {
    if (!address) {
      this.$snackbar.error('address is empty.')
      return
    }
    try {
      this.$store.dispatch('arts/fetchArts')
    } catch (e) {
      console.log(e)
      this.$snackbar.error(e.message)
    }
  }

  private get arts(): any[] {
    return this.$store.state.arts.items
  }
}
</script>

<style scoped lang="stylus">
@require '~@/assets/style/variables.styl'
@require '~@/assets/style/mixin.styl'

.openSeaAssetContainer
  gridArts()

  .innerContainer
    display flex
    justify-content center
    align-items center
    background-color $black_000
</style>
