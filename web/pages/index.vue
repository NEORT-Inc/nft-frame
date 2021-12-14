<template>
  <div class="framePage" :class="{ sp: $device.isMobile }">
    <div is="style" v-if="shouldHideCursor">* { cursor: none !important; }</div>

    <div v-if="isSignedIn">
      <ImageView
        v-if="currentArt && !isIframe && currentArt.image"
        class="overlay"
        :url="currentArt.image"
      />
      <ArtMedia
        v-if="currentArt"
        class="media"
        :art="currentArt"
        :is-video-mode-main="true"
      />
      <div v-else class="emptyContainer">
        <div class="emptyMessage">
          <p class="message">No Art</p>
        </div>
      </div>
    </div>
    <QRSignInView v-else />
    <ObserveData />
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'nuxt-property-decorator'
import ImageView from '~/basics/ImageView.vue'
import ArtMedia from '~/basics/ArtMedia.vue'
import QRSignInView from '~/components/QRSignInView.vue'
import ObserveData from '~/components/ObserveData.vue'
import { Art, GAEventPage, MediaType } from '~/types/dto'

@Component({
  components: {
    ObserveData,
    QRSignInView,
    ImageView,
    ArtMedia,
  },
})
export default class FramePage extends Vue {
  private static MOUSE_VISIBLE_DURATION = 2 * 1000

  private slideShowTimer: any = null
  private cursorTimer: any | null = null
  private shouldHideCursor: boolean = true
  private slideShowDuration: number = 3 * 60 * 1000

  @Watch('currentArt')
  onCurrentArtChanged(newValue: Art | null) {
    if (newValue) {
      this.setSlideShowTimer()
    }
  }

  mounted() {
    window.addEventListener('mousemove', this.onMouseMoveHandle)
    window.addEventListener('resize', this.resizeHandle)
    this.setSlideShowTimer()
    this.setFillHeight()

    setTimeout(() => {
      this.$store.dispatch('firebase/analytics/sendPageEvent', GAEventPage.TOP)
    }, 3000)
  }

  beforeDestroy() {
    window.removeEventListener('mousemove', this.onMouseMoveHandle)
    window.removeEventListener('resize', this.resizeHandle)
    this.clearSlideShowTimer()
  }

  private setSlideShowTimer() {
    this.clearSlideShowTimer()
    this.slideShowTimer = setTimeout(() => {
      this.changeArt()
    }, this.slideShowDuration)
  }

  private clearSlideShowTimer() {
    if (this.slideShowTimer) {
      clearTimeout(this.slideShowTimer)
    }
  }

  private clearCursorTimer() {
    if (this.cursorTimer) {
      clearTimeout(this.cursorTimer)
    }
  }

  private onMouseMoveHandle(): void {
    this.shouldHideCursor = false
    this.clearCursorTimer()
    this.cursorTimer = setTimeout(() => {
      this.shouldHideCursor = true
    }, FramePage.MOUSE_VISIBLE_DURATION)
  }

  private changeArt() {
    let next = this.currentIndex + 1
    if (next > this.arts.length - 1) {
      next = 0
    }

    this.$fire.firestore
      .collection('users')
      .doc(this.userId)
      .set({
        id: this.userId,
        currentPlaylistId: this.currentPlaylistId,
        currentArtIndex: next,
      })
      .catch((error) => {
        console.error('Error updating index: ', error)
      })
  }

  private resizeHandle(): void {
    this.setFillHeight()
  }

  private setFillHeight(): void {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }

  private get isSignedIn(): boolean {
    return this.$store.getters['auth/isSignedIn']()
  }

  private get userId(): string {
    return this.$store.state.firebase.auth.id
  }

  private get arts(): Art[] {
    return this.$store.state.playlist.arts
  }

  private get currentArt(): Art | null {
    return this.arts.length > 0 ? this.arts[this.currentIndex] : null
  }

  private get currentIndex(): number {
    return this.$store.state.playlist.currentArtIndex
  }

  private get currentPlaylistId(): string {
    return this.$store.state.playlist.currentPlaylistId
  }

  private get isIframe(): boolean {
    return !!this.currentArt && this.currentArt.mediaType === MediaType.IFRAME
  }
}
</script>

<style scoped lang="stylus">
@require '~@/assets/style/variables.styl'
@require '~@/assets/style/mixin.styl'

$blur_size = 20px

.framePage
  height 100%
  width 100%
  position fixed
  overflow hidden
  background $black_000

  .overlay
    position fixed
    top $blur_size * -2
    left $blur_size * -2
    width "calc(100vw + (%s * 4))" % $blur_size
    height "calc(100vh + (%s * 4))" % $blur_size
    object-fit cover
    filter blur($blur_size)
    opacity 0.6

  .media
    &.imageView
      position fixed
      object-fit contain
      max-width 100%
      max-height 100%
      centerAbsContent()

    &.artIframe
      position fixed
      width 100%
      height 100%

  .emptyContainer
    position fixed
    display flex
    top 0
    left 0
    right 0
    bottom 0
    align-items center
    justify-content center
    background $black_000

    .emptyMessage
      text-align center

      .message
        color $white_fff
        font-size $font_size_16
        margin-bottom $margin_16

      .link
        font-size $font_size_14
        font-weight $font_weight_bold
        color $white_fff
</style>
