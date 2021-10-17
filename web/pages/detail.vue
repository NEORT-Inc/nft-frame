<template>
  <div class="detailPage" :class="{ sp: $device.isMobile }">
    <client-only>
      <div v-if="isLoadingForSignIn">loading...</div>
      <div v-else-if="isSignedIn" class="container">
        <div v-if="currentArt" class="artMediaContainer">
          <ArtMedia :art="currentArt" />
          <p class="title">{{ currentArt.siteTitle }}</p>
          <a class="link" :href="currentArt.siteUrl" target="_blank">{{
            currentArt.siteUrl
          }}</a>
        </div>
        <div v-else class="emptyContainer">
          <div class="emptyMessage">
            <p class="message">No Art</p>
          </div>
        </div>
        <div v-if="currentPlaylistName" class="playlistDetailContainer">
          <h2 class="subTitle">{{ currentPlaylistName }}</h2>
        </div>
        <div class="playlistArtContainer">
          <h2 class="subTitle">
            <span>Art's in this playlist</span>
            <A
              v-if="shouldShowEditButton"
              class="editButton"
              @onClicked="onEditButtonClicked"
            >
              {{ isEditMode ? `Cancel` : `Edit` }}
            </A>
          </h2>
          <PlaylistArts :is-edit-mode="isEditMode" />
        </div>
        <Playlists />
        <ObserveData />
      </div>
      <div v-else>
        <SignInModal v-if="shouldShowSignInModel" :hide-close-button="true" />
        <SignUpModal v-if="shouldShowSignUpModel" :hide-close-button="true" />
      </div>
    </client-only>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import ArtMedia from '~/basics/ArtMedia.vue'
import ObserveData from '~/components/ObserveData.vue'
import { Art, GAEventPage } from '~/types/dto'
import Playlists from '~/components/Playlists.vue'
import PlaylistArts from '~/components/PlaylistArts.vue'
import SignInModal from '~/components/SignInModal.vue'
import SignUpModal from '~/components/SignUpModal.vue'
import A from '~/basics/A.vue'

@Component({
  components: {
    A,
    Playlists,
    ArtMedia,
    ObserveData,
    SignInModal,
    SignUpModal,
    PlaylistArts,
  },
})
export default class DetailPage extends Vue {
  private isEditMode: boolean = false

  mounted() {
    if (!this.isSignedIn) {
      this.$store.dispatch('modal/signInModal/open')
    }
    this.$store.dispatch('firebase/analytics/sendPageEvent', GAEventPage.DETAIL)
  }

  private onEditButtonClicked() {
    this.isEditMode = !this.isEditMode
  }

  private get isSignedIn(): boolean {
    return this.$store.getters['auth/isSignedIn']()
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

  private get currentPlaylistName(): string {
    return this.$store.state.playlist.currentPlaylistName
  }

  private get isLoadingForSignIn(): boolean {
    return this.$store.state.firebase.auth.loading
  }

  private get isDailyPlaylist(): boolean {
    return this.$store.getters['playlist/isDailyPlaylist']()
  }

  private get shouldShowSignInModel(): boolean {
    return this.$store.state.modal.signInModal.isModalShowing
  }

  private get shouldShowSignUpModel(): boolean {
    return this.$store.state.modal.signUpModal.isModalShowing
  }

  private get shouldShowEditButton(): boolean {
    return !!this.currentArt && !this.isDailyPlaylist
  }
}
</script>

<style scoped lang="stylus">
@require '~@/assets/style/variables.styl'
@require '~@/assets/style/mixin.styl'

.detailPage
  background $white_fff
  padding $padding_24 $padding_8

  .container
    display flex
    flex-direction column
    align-items center

    .artMediaContainer
      object-fit contain
      display flex
      justify-items center
      flex-direction column

      .artMedia
        max-width 100%
        height 250px
        display block
        object-fit contain

      .title
        margin-top 8px

      .link
        margin-top 8px

    .emptyContainer
      width 320px
      height 180px
      display flex
      align-items center
      justify-content center
      background $black_212121

      .emptyMessage
        text-align center

        .message
          color $white_fff
          font-size $font_size_16

    .playlistDetailContainer
      margin-top $margin_24

      .subTitle
        font-size 1.8rem
        text-align center

    .playlistArtContainer
      margin-top $margin_24

      .subTitle
        position relative
        font-size 1.4rem
        text-align center

        .editButton
          position absolute
          top 0
          right 0
          padding-right $padding_8

      .playlistArts
        padding-top $padding_8

    .playlists
      margin-top $margin_48
</style>
