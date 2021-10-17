<template>
  <div class="signInView" :class="{ sp: $device.isMobile }">
    <h1 class="heading">Sign In</h1>
    <p class="lead">Please sign in to use {{ appName }}</p>
    <SignInWithEmailView
      @onSignInSucceeded="onSignInSucceeded"
      @onPasswordResetButtonClicked="onPasswordResetButtonClicked"
    />
    <div class="signUpButtonContainer">
      <A class="signUpButton" @onClicked="onSignUpButtonClicked">For sign-up</A>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import A from '~/basics/A.vue'
import SignInWithEmailView from '~/components/SignInWithEmailView.vue'
@Component({
  components: {
    SignInWithEmailView,
    A,
  },
})
export default class SignInView extends Vue {
  private onSignInSucceeded() {
    this.$emit('onSignInSucceeded')
  }

  private onSignUpButtonClicked() {
    this.$emit('onSignUpButtonClicked')
  }

  private onPasswordResetButtonClicked() {
    this.$emit('onPasswordResetButtonClicked')
  }

  private get appName(): string {
    return process.env.APP_NAME || ''
  }
}
</script>

<style scoped lang="stylus">
@require '~@/assets/style/variables.styl'
@require '~@/assets/style/mixin.styl'

.signInView
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
    text-align center
    margin-top $margin_32

  .signInWithEmailView
    width 100%
    margin $margin_16 auto 0

  .signUpButtonContainer
    margin-top $margin_32
    padding-top $padding_32
    text-align center
    border-top 2px solid $gray_ededed

    .signUpButton
      color $black_212121
      font-size $font_size_14
      font-weight $font_weight_bold
</style>
