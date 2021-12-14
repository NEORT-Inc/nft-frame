<template>
  <div class="signUpView" :class="{ sp: $device.isMobile }">
    <h1 class="heading">Sign Up</h1>
    <p class="lead">Enjoy {{ appName }} by registration</p>
    <SignUpWithEmailView @onSignUpSucceeded="onSignUpSucceeded" />
    <div v-if="showSignInLink" class="signInButtonContainer">
      <A class="signInButton" @onClicked="onSignInButtonClicked"
        >Already have an account?</A
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import A from '~/basics/A.vue'
import SignUpWithEmailView from '~/components/SignUpWithEmailView.vue'
@Component({
  components: {
    SignUpWithEmailView,
    A,
  },
})
export default class SignUpView extends Vue {
  @Prop({ default: true }) private showSignInLink!: boolean

  private onSignUpSucceeded() {
    this.$emit('onSignUpSucceeded')
  }

  private onSignInButtonClicked() {
    this.$emit('onSignInButtonClicked')
  }

  private get appName(): string {
    return process.env.APP_NAME || ''
  }
}
</script>

<style scoped lang="stylus">
@require '~@/assets/style/variables.styl'
@require '~@/assets/style/mixin.styl'

.signUpView
  max-width 600px
  height 100%
  margin 0 auto
  overflowYScroll()

  .heading
    text-align center
    font-size $font_size_24

  .lead
    font-size $font_size_14
    font-weight $font_weight_bold
    margin-top $margin_32
    text-align center

  .signUpWithEmailView
    width 100%
    margin $margin_16 auto 0

  .signInButtonContainer
    margin-top $margin_32
    padding-top $padding_32
    text-align center
    border-top 2px solid $gray_ededed

    .signInButton
      color $black_212121
      font-size $font_size_14
      font-weight $font_weight_bold
</style>
