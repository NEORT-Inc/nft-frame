<template>
  <div v-if="playlists.length > 0" class="playlists">
    <p>Choose playlist to show</p>
    <div class="container">
      <div
        class="playlistItem dailyPlaylist"
        :class="{ active: isCurrentPlaylist(dailyPlaylist) }"
      >
        <A @onClicked="onPlaylistClicked(dailyPlaylist)">{{
          dailyPlaylist.name
        }}</A>
        <p class="caption">毎日更新される日替わりプレイリストです。</p>
      </div>
      <div
        v-for="(item, i) in playlists"
        :key="i"
        class="playlistItem"
        :class="{ active: isCurrentPlaylist(item) }"
      >
        <A @onClicked="onPlaylistClicked(item)">{{ item.name }}</A>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'
import firebase from 'firebase/app'
import { DAILY_PLAYLIST, Playlist } from '~/types/dto'
import QuerySnapshot = firebase.firestore.QuerySnapshot
import DocumentData = firebase.firestore.DocumentData
import QueryDocumentSnapshot = firebase.firestore.QueryDocumentSnapshot
import A from '~/basics/A.vue'

@Component({
  components: { A },
})
export default class Playlists extends Vue {
  private functionForObserveUserPlaylistUnsubscribe: any = null

  @Watch('userId')
  onUserIdChanged(newValue) {
    if (newValue) {
      this.observeUserPlaylists()
    }
  }

  mounted() {
    this.observeUserPlaylists()
  }

  private observeUserPlaylists() {
    if (this.userId) {
      this.unsubscribeUserPlaylist()
      this.functionForObserveUserPlaylistUnsubscribe = this.$fire.firestore
        .collection('users')
        .doc(this.userId)
        .collection('playlists')
        .onSnapshot((snapshot: QuerySnapshot<DocumentData>) => {
          if (!snapshot.empty) {
            const playlists: any[] = []
            snapshot.forEach((i: QueryDocumentSnapshot<DocumentData>) => {
              playlists.push(i.data())
            })
            if (playlists.length > 0) {
              this.$store.dispatch('playlist/setPlaylists', playlists)
            }
          }
        })
    }
  }

  private unsubscribeUserPlaylist() {
    if (this.functionForObserveUserPlaylistUnsubscribe) {
      this.functionForObserveUserPlaylistUnsubscribe()
    }
  }

  private isCurrentPlaylist(playlist: Playlist): boolean {
    return playlist.id === this.currentPlaylistId
  }

  private async onPlaylistClicked(playlist: Playlist) {
    if (!window.confirm('Are you sure to change playlist?')) {
      return
    }
    if (!playlist.id) {
      return
    }
    try {
      await this.$store.dispatch(
        'firebase/analytics/sendChangePlaylistEvent',
        playlist.name
      )
      await this.$fire.firestore.collection('users').doc(this.userId).update({
        currentPlaylistId: playlist.id,
        currentArtIndex: 0,
      })
    } catch (e) {
      console.log(e)
      this.$snackbar.error(e.message)
    }
  }

  private get userId(): string {
    return this.$store.state.firebase.auth.id
  }

  private get currentPlaylistId(): string {
    return this.$store.state.playlist.currentPlaylistId
  }

  private get playlists(): Playlist[] {
    return this.$store.state.playlist.playlists
  }

  private get dailyPlaylist(): Playlist {
    return DAILY_PLAYLIST
  }
}
</script>

<style scoped lang="stylus">
@require '~@/assets/style/variables.styl'
.playlists
  .container
    padding 8px

    .playlistItem
      &.active
        a
          color $accent_text_color

      &.dailyPlaylist
        margin-bottom 8px

      &:nth-child(n + 2)
        margin-top $margin_4

      .caption
        font-size 1.1rem
        margin-top $margin_4
</style>
