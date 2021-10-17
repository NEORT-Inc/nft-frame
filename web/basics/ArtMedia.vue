<template>
  <ImageView v-if="isTypeImage" class="artMedia" :url="art.media" />
  <Video
    v-else-if="isTypeVideo"
    class="artMedia"
    :url="art.media"
    :is-main="isVideoModeMain"
  />
  <ArtIframe v-else-if="isTypeIframe" class="artMedia" :url="art.media" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import ImageView from '~/basics/ImageView.vue'
import Video from '~/basics/Video.vue'
import { Art, MediaType } from '~/types/dto'
import ArtIframe from '~/basics/ArtIframe.vue'

@Component({
  components: { ArtIframe, Video, ImageView },
})
export default class ArtMedia extends Vue {
  @Prop({ required: true }) private art!: Art
  @Prop({ default: false }) private isVideoModeMain!: boolean

  private get isTypeImage(): boolean {
    return this.art.mediaType === MediaType.IMG
  }

  private get isTypeVideo(): boolean {
    return this.art.mediaType === MediaType.VIDEO
  }

  private get isTypeIframe(): boolean {
    return this.art.mediaType === MediaType.IFRAME
  }
}
</script>
