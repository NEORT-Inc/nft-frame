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
  private functionForObserveDailyPlaylistUnsubscribe: any = null
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
    if (this.isDailyPlaylist) {
      this.unsubscribeUserPlaylist()
      this.observeDailyPlaylist()
    } else {
      this.unsubscribeDailyPlaylist()
      this.observeUserPlaylist()
    }
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

  private observeDailyPlaylist() {
    this.unsubscribeDailyPlaylist()
    this.functionForObserveDailyPlaylistUnsubscribe = this.$fire.firestore
      .collection('curations')
      .doc('daily')
      .collection('playlists')
      .onSnapshot((snapshot: QuerySnapshot<DocumentData>) => {
        if (!snapshot.empty) {
          const index = snapshot.docs.length - 1
          const date = snapshot.docs[index].id
          // date
          console.log(date)
          const playlistRef = snapshot.docs[index].data()

          playlistRef.playlist.get().then((item) => {
            console.log(item.data().name)
            this.$store.dispatch(
              'playlist/setCurrentPlaylistName',
              item.data().name
            )
          })

          playlistRef.playlist
            .collection('arts')
            .orderBy('createdAt', 'desc')
            .onSnapshot((query: QuerySnapshot<DocumentData>) => {
              this.updateArts(query)
            })
        }
      })
  }

  private unsubscribeDailyPlaylist() {
    if (this.functionForObserveDailyPlaylistUnsubscribe) {
      this.functionForObserveDailyPlaylistUnsubscribe()
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

  private get isDailyPlaylist(): boolean {
    return this.$store.getters['playlist/isDailyPlaylist']()
  }
}
</script>
