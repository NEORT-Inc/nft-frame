<template>
  <div v-if="playlistArts.length > 0" class="playlistArts">
    <div
      v-for="(item, i) in playlistArts"
      :key="i"
      class="artItem"
      :class="{ editMode: isEditMode }"
      @click="onArtItemClicked(i)"
    >
      <ArtMedia :art="item" :class="{ active: isCurrentArt(item) }" />
      <div v-if="isEditMode" class="deletionButtonContainer">
        <DeletionIcon @onClicked="onDeletionButtonClicked(i)" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { Art } from '~/types/dto'
import A from '~/basics/A.vue'
import ArtMedia from '~/basics/ArtMedia.vue'
import DeletionIcon from '~/basics/DeletionIcon.vue'

@Component({
  components: { DeletionIcon, ArtMedia, A },
})
export default class Playlists extends Vue {
  @Prop({ default: false }) private isEditMode!: boolean

  private isCurrentArt(art: Art): boolean {
    return !!this.currentArt && this.currentArt.media === art.media
  }

  private onArtItemClicked(index: number) {
    if (!this.userId || this.isEditMode) {
      return
    }
    this.changeArt(index)
  }

  private async onDeletionButtonClicked(index: number): Promise<void> {
    if (!window.confirm('Are you sure to delete from playlist?')) {
      return
    }
    if (index >= this.playlistArts.length) {
      this.$snackbar.error('Invalid index.')
      return
    }
    const isPrevious = index <= this.currentArtIndex
    const art: Art = this.playlistArts[index]
    try {
      await this.$fire.firestore
        .collection('users')
        .doc(this.userId)
        .collection('playlists')
        .doc(this.currentPlaylistId)
        .collection('arts')
        .doc(art.id)
        .delete()
      if (isPrevious && this.currentArtIndex > 0) {
        await this.changeArt(this.currentArtIndex - 1)
      }
      this.$snackbar.success('deleted.')
    } catch (e) {
      console.log(e)
      this.$snackbar.error(e.message)
    }
  }

  private async changeArt(index: number): Promise<void> {
    try {
      await this.$fire.firestore.collection('users').doc(this.userId).update({
        currentArtIndex: index,
      })
      await this.$store.dispatch('firebase/analytics/sendChangeArtEvent')
    } catch (e) {
      console.error('Error updating index: ', e)
      this.$snackbar.error(e.message)
    }
  }

  private get playlistArts(): Art[] {
    return this.$store.state.playlist.arts
  }

  private get currentArt(): Art | null {
    return this.playlistArts.length > 0
      ? this.playlistArts[this.currentArtIndex]
      : null
  }

  private get currentArtIndex(): number {
    return this.$store.state.playlist.currentArtIndex
  }

  private get currentPlaylistId(): string {
    return this.$store.state.playlist.currentPlaylistId
  }

  private get userId(): string {
    return this.$store.state.firebase.auth.id
  }
}
</script>

<style scoped lang="stylus">
@require '~@/assets/style/variables.styl'
.playlistArts
  display grid
  grid-template-columns repeat(auto-fill, minmax(100px, 1fr))
  grid-gap 8px

  .artItem
    background-color $black_212121
    display flex
    align-items center
    cursor pointer

    .artMedia
      width 100%

      &.active
        border 2px $accent_color solid

      &.artIframe
        pointer-events none

    &.editMode
      position relative
      cursor initial

      .deletionButtonContainer
        width 100%
        height 100%
        position absolute
        top 0
        left 0
        display flex
        align-items center
        justify-content center
        background-color $black_212121_opa40
</style>
