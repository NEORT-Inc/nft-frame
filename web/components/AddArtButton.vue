<template>
  <Button
    class="addArtButton"
    :button-style="buttonStyle"
    @onClicked="onClicked"
  >
    <span class="label">Add</span>
  </Button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import firebase from 'firebase'
import DocumentSnapshot = firebase.firestore.DocumentSnapshot
import DocumentData = firebase.firestore.DocumentData
import { Art2, ButtonStyle, Media, MediaType, Playlist } from '~/types/dto'
import Button from '~/basics/Button.vue'

@Component({
  components: { Button },
})
export default class AddArtButton extends Vue {
  @Prop({ required: true }) private art!: Art2
  @Prop({ default: ButtonStyle.FILL_BLACK })
  private buttonStyle!: ButtonStyle

  private onClicked() {
    if (!this.mediaType) {
      return
    }
    const playlist: Playlist = {
      id: '0',
      name: 'default',
    }
    const url = this.isTypeImage ? this.art.image_url : this.art.animation_url
    const media: Media = {
      type: this.mediaType,
      src: url,
    }
    this.addArt(playlist, media, this.art.name)
  }

  private async addArt(playlist: Playlist, media: Media, title: string) {
    try {
      const _userId = this.userId
      const db = this.$fire.firestore

      const snapshot: DocumentSnapshot<DocumentData> = await db
        .collection('users')
        .doc(_userId)
        .get()

      const user = snapshot.data()

      if (user) {
        await db.collection('users').doc(_userId).update({
          id: _userId,
          currentPlaylistId: playlist.id,
          currentArtIndex: 0,
        })
      } else {
        await db.collection('users').doc(_userId).set({
          id: _userId,
          currentPlaylistId: playlist.id,
          currentArtIndex: 0,
        })
      }
      await db
        .collection('users')
        .doc(_userId)
        .collection('playlists')
        .doc(playlist.id)
        .set(playlist)

      await db
        .collection('users')
        .doc(_userId)
        .collection('playlists')
        .doc(playlist.id)
        .collection('arts')
        .doc(this.art.id.toString())
        .set({
          media: media.src,
          mediaType: media.type,
          title,
          createdAt: new Date().getTime(),
        })
    } catch (e) {
      console.error('Error adding document: ', e)
      this.$snackbar.error(e)
    }
  }

  private get userId(): string {
    return this.$store.state.firebase.auth.id
  }

  private get mediaType(): MediaType | null {
    return this.$store.getters['arts/mediaType'](this.art)
  }

  private get isTypeImage(): boolean {
    return this.mediaType === MediaType.IMG
  }
}
</script>

<style scoped lang="stylus">
@require '~@/assets/style/variables.styl'
@require '~@/assets/style/mixin.styl'

.addArtButton
  min-height 32px
  font-size $font_size_14
</style>
