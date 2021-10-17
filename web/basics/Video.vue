<template>
  <div class="video" :class="{ main: isMain }">
    <video
      autoplay
      muted
      loop
      :controls="showControls"
      :src="url"
      @loadeddata="onDataLoaded"
      @error="onError"
    ></video>
    <img v-if="isLoading" class="loadingIcon" src="/img/loading.gif" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component({})
export default class Video extends Vue {
  @Prop({ default: '' }) private url!: string
  @Prop({ default: false }) private showControls!: boolean
  @Prop({ default: false }) private isMain!: boolean

  private isLoading: boolean = true

  private onDataLoaded() {
    this.isLoading = false
  }

  private onError(e: any) {
    this.isLoading = false
    console.log(e.target.error)
  }
}
</script>

<style scoped lang="stylus">
@require '~@/assets/style/variables.styl'
@require '~@/assets/style/mixin.styl'

.video
  position relative

  video
    width 100%
    height 100%

  .loadingIcon
    position absolute
    centerAbsContent()

  &.main
    video
      position fixed
      object-fit contain
      max-width 100%
      max-height 100%
      centerAbsContent()

    .loadingIcon
      position fixed
</style>
