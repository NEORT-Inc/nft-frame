<template>
  <div class="qrSignInView" :class="{ sp: $device.isMobile }">
    <h1>Sign in from Your phone</h1>
    <VueQrcode
      class="qrCode"
      :value="url"
      :options="{ width: 300, margin: 2 }"
    ></VueQrcode>
    <p>Please read the QR code from smart phone to sign in.</p>
    <div class="urlContainer">
      <a :href="url">{{ url }}</a>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'nuxt-property-decorator'
import VueQrcode from '@chenfengyuan/vue-qrcode'
import { FrameSignInInfo } from '~/types/dto'
@Component({
  components: {
    VueQrcode,
  },
})
export default class QRSignInView extends Vue {
  private static RANDOM_ID = (() => {
    return (
      new Date().getTime().toString(16) +
      Math.floor(100000 * Math.random()).toString(16)
    )
  })()

  @Watch('$store.state.frame.signIn.frameSignInInfo')
  private onFrameSignInInfoChanged(frameSignInInfo: FrameSignInInfo) {
    if (frameSignInInfo.email && frameSignInInfo.password) {
      this.signInWithEmail(frameSignInInfo.email, frameSignInInfo.password)
    }
  }

  private async signInWithEmail(email: string, password: string) {
    try {
      await this.$store.dispatch('auth/signInWithEmail', {
        email,
        password,
        shouldStore: true,
      })
      this.$snackbar.success('Sign-in successful')
      location.reload()
    } catch (e) {
      console.log(e)
      this.$snackbar.error(e.message)
    }
  }

  mounted() {
    this.$store.dispatch('frame/signIn/observeSignIn', QRSignInView.RANDOM_ID)
  }

  beforeDestroy() {
    this.$store.dispatch('frame/signIn/clear')
  }

  private get url(): string {
    return `${process.env.BASE_URL}/signin/${QRSignInView.RANDOM_ID}`
  }
}
</script>

<style scoped lang="stylus">
@require '~@/assets/style/variables.styl'
@require '~@/assets/style/mixin.styl'

.qrSignInView
  height 100%
  display flex
  flex-direction column
  align-items center
  justify-content center
  background-color $white_fff

  .urlContainer
    margin-top $margin_16
</style>
