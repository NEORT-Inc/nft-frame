<template>
  <div class="signInWithEmailView">
    <div class="container">
      <p class="inputItem">
        <label class="label" for="email">Email</label>
        <input
          id="email"
          v-model="email"
          class="inputText"
          placeholder="Email"
          type="email"
        />
      </p>
      <p class="inputItem">
        <label class="label" for="password">Password</label>
        <input
          id="password"
          v-model="password"
          class="inputText"
          placeholder="Password"
          type="password"
          autocomplete="current-password"
        />
      </p>
      <div class="signInButtonContainer">
        <A class="passwordResetButton" @onClicked="onPasswordResetButtonClicked"
          >Forgot password?</A
        >
        <Button
          class="signInButton"
          :button-style="signInButtonStyle"
          @onClicked="onSignInButtonClicked"
          >Sign In</Button
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import Button from '~/basics/Button.vue'
import { ButtonStyle } from '~/types/dto'
import A from '~/basics/A.vue'

@Component({
  components: {
    A,
    Button,
  },
})
export default class SignInWithEmailView extends Vue {
  private email: string = ''
  private password: string = ''
  private isLoading: boolean = false

  private onPasswordResetButtonClicked() {
    this.$emit('onPasswordResetButtonClicked')
  }

  private async onSignInButtonClicked() {
    if (this.isLoading) {
      return
    }
    try {
      this.isLoading = true
      await this.$store.dispatch('auth/signInWithEmail', {
        email: this.email,
        password: this.password,
      })
      this.$emit('onSignInSucceeded')
    } catch (e) {
      console.log(e)
      this.$snackbar.error(e.message)
    } finally {
      this.isLoading = false
    }
  }

  private get signInButtonStyle(): ButtonStyle {
    return ButtonStyle.FILL_BLACK
  }
}
</script>

<style scoped lang="stylus">
@require '~@/assets/style/variables.styl'

.signInWithEmailView
  .container
    .inputItem
      margin-top $margin_16
      display flex
      flex-direction column

      .label
        font-size $font_size_14

      .inputText
        font-size $font_size_16
        display inline-flex
        align-items center
        border 1px $gray_bcbcbc solid
        background $white_fff
        height 48px
        padding 0 $padding_12
        margin-top $margin_4
        border-radius 4px

    .signInButtonContainer
      margin-top $margin_32
      display flex
      flex-direction column
      align-items center
      justify-content center

      .passwordResetButton
        color $black_212121

      .signInButton
        margin-top $margin_24
</style>
