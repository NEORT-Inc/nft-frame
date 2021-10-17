<template>
  <div class="passwordResetView" :class="{ sp: $device.isMobile }">
    <h1 class="heading">Password Reset</h1>
    <div class="inputItem">
      <Input
        id="email"
        v-model="email"
        type="email"
        label="Email"
        placeholder="Email"
      />
    </div>
    <div class="sendButtonContainer">
      <Button :button-style="sendButtonStyle" @onClicked="onSendButtonClicked">
        Send email
      </Button>
      <A class="backButton" @onClicked="onBackButtonClicked">
        Go back to sign-in page
      </A>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import Button from '~/basics/Button.vue'
import { ButtonStyle } from '~/types/dto'
import Input from '~/basics/Input.vue'
import A from '~/basics/A.vue'

@Component({
  components: {
    A,
    Button,
    Input,
  },
})
export default class PasswordResetView extends Vue {
  private email: string = ''

  private async onSendButtonClicked(): Promise<void> {
    try {
      await this.$store.dispatch('auth/resetPassword', this.email)
      window.alert("We've sent an email to reset password.")
      this.$emit('onRequestSent')
    } catch (e) {
      this.$snackbar.error(e.message)
    }
  }

  private onBackButtonClicked() {
    this.$emit('onBackButtonClicked')
  }

  private get sendButtonStyle(): ButtonStyle {
    return ButtonStyle.FILL_BLACK
  }
}
</script>

<style scoped lang="stylus">
@require '~@/assets/style/variables'
@require '~@/assets/style/mixin'

.passwordResetView
  max-width 600px
  height 100%
  margin 0 auto
  overflowYScroll()

  .heading
    text-align center
    font-size $font_size_24

  .inputItem
    margin-top $margin_16
    display flex
    flex-direction column

  .sendButtonContainer
    margin-top $margin_32
    display flex
    flex-direction column
    align-items center
    justify-content center

    .backButton
      margin-top $margin_32
      color $black_212121
</style>
