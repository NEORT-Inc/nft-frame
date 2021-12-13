<template>
  <ImageView v-if="isTypeImage" class="openSeaAssetItem" :url="art.image_url" />
  <Video
    v-else-if="isTypeVideo"
    class="openSeaAssetItem"
    :url="art.animation_url"
  />
  <ArtIframe
    v-else-if="isTypeIframe"
    class="openSeaAssetItem"
    :url="art.animation_url"
  />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import ImageView from '~/basics/ImageView.vue'
import Video from '~/basics/Video.vue'
import { Art2, MediaType } from '~/types/dto'
import ArtIframe from '~/basics/ArtIframe.vue'

@Component({
  components: { ArtIframe, Video, ImageView },
})
export default class OpenSeaAssetItem extends Vue {
  @Prop({ required: true }) private art!: Art2

  mounted() {
    console.log(this.art)
  }

  private get isTypeImage(): boolean {
    return this.mediaType === MediaType.IMG
  }

  private get isTypeVideo(): boolean {
    return this.mediaType === MediaType.VIDEO
  }

  private get isTypeIframe(): boolean {
    return this.mediaType === MediaType.IFRAME
  }

  private get mediaType(): MediaType | null {
    return this.$store.getters['arts/mediaType'](this.art)
  }
}
</script>

<style scoped lang="stylus">
@require '~@/assets/style/variables.styl'
@require '~@/assets/style/mixin.styl'

.openSeaAssetItem
  width 100%
</style>
