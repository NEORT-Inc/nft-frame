<template>
  <div class="observeData"></div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'
import firebase from 'firebase/app'
import QuerySnapshot = firebase.firestore.QuerySnapshot
import DocumentData = firebase.firestore.DocumentData
import DocumentSnapshot = firebase.firestore.DocumentSnapshot
import { dtoProvider } from '~/util/dtoProvider'
import { DAILY_PLAYLIST } from '~/types/dto'

@Component({
  components: {},
})
export default class ObserveData extends Vue {
  private functionForObserveUserPlaylistUnsubscribe: any = null
  private functionForObserveUserUnsubscribe: any = null

  @Watch('userId')
  onUserIdChanged(newValue) {
    if (newValue) {
      this.observeUser()
    }
  }

  @Watch('$store.state.playlist.currentPlaylistId')
  onCurrentPlaylistIdChanged(newValue: string, oldValue: string) {
    if (newValue !== oldValue) {
      this.observeArts()
    }
  }

  mounted() {
    this.observeUser()
  }

  private observeArts() {
    this.observeUserPlaylist()
  }

  private observeUser() {
    if (this.userId) {
      if (this.functionForObserveUserUnsubscribe) {
        this.functionForObserveUserUnsubscribe()
      }
      this.functionForObserveUserUnsubscribe = this.$fire.firestore
        .collection('users')
        .doc(this.userId)
        .onSnapshot((snapshot: DocumentSnapshot<DocumentData>) => {
          const data: any = snapshot.data()
          if (data) {
            this.$store.dispatch(
              'playlist/setCurrentArtIndex',
              data.currentArtIndex
            )
            this.$store.dispatch(
              'playlist/setCurrentPlaylistId',
              data.currentPlaylistId
            )
          } else {
            this.setPlaylistToDaily()
          }
        })
    }
  }

  private observeUserPlaylist() {
    if (this.userId) {
      this.unsubscribeUserPlaylist()
      this.functionForObserveUserPlaylistUnsubscribe = this.$fire.firestore
        .collection('users')
        .doc(this.userId)
        .collection('playlists')
        .doc(this.currentPlaylistId)
        .collection('arts')
        .orderBy('createdAt', 'desc')
        .onSnapshot((query: QuerySnapshot<DocumentData>) => {
          this.$store.dispatch('playlist/setCurrentPlaylistName', '')
          this.updateArts(query)
        })
    }
  }

  private unsubscribeUserPlaylist() {
    if (this.functionForObserveUserPlaylistUnsubscribe) {
      this.functionForObserveUserPlaylistUnsubscribe()
    }
  }

  private updateArts(query: QuerySnapshot<DocumentData>) {
    const arts: any = []
    query.forEach((i) => {
      const art: any = dtoProvider.getArt(i.id, i.data())
      arts.push(art)
    })
    this.$store.dispatch('playlist/setArts', arts)
  }

  private async setPlaylistToDaily() {
    if (!this.userId) {
      return
    }
    try {
      await this.$fire.firestore.collection('users').doc(this.userId).set({
        id: this.userId,
        currentPlaylistId: DAILY_PLAYLIST.id,
        currentArtIndex: 0,
      })
    } catch (e) {
      console.log(e)
    }
  }

  private get userId(): string {
    return this.$store.state.firebase.auth.id
  }

  private get currentPlaylistId(): string {
    return this.$store.state.playlist.currentPlaylistId
  }
}
</script>
