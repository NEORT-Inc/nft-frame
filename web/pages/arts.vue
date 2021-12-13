<template>
  <div class="artsPage" :class="{ sp: $device.isMobile }">
    <OpenSeaAssetContainer />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import OpenSeaAssetContainer from '~/components/OpenSeaAssetContainer.vue'

@Component({
  components: {
    OpenSeaAssetContainer,
  },
})
export default class ArtsPage extends Vue {}
</script>

<style scoped lang="stylus">
@require '~@/assets/style/variables.styl'
@require '~@/assets/style/mixin.styl'
</style>
