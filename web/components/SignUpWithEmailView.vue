<template>
  <div class="signUpWithEmailView">
    <div class="container">
      <p class="inputItem">
        <Input
          id="email"
          v-model="email"
          class="item"
          type="email"
          label="Email"
          placeholder="Email"
        />
      </p>
      <p class="inputItem">
        <Input
          v-model="password"
          class="item"
          type="password"
          label="Password"
          placeholder="Password"
        />
      </p>
      <p class="inputItem">
        <Input
          v-model="passwordConfirmation"
          class="item"
          type="password"
          label="Password（Confirm）"
          placeholder="Password"
        />
      </p>
      <div class="signUpButtonContainer">
        <Button
          :button-style="signUpButtonStyle"
          @onClicked="onSignUpButtonClicked"
          >Sign Up</Button
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import Button from '~/basics/Button.vue'
import { ButtonStyle } from '~/types/dto'
import Input from '~/basics/Input.vue'

@Component({
  components: {
    Input,
    Button,
  },
})
export default class SignUpWithEmailView extends Vue {
  private email: string = ''
  private password: string = ''
  private passwordConfirmation: string = ''
  private isLoading: boolean = false

  private async onSignUpButtonClicked() {
    if (this.isLoading) {
      return
    }
    try {
      this.isLoading = true
      await this.$store.dispatch('auth/validateEmailAndPassword', {
        email: this.email,
        password: this.password,
        passwordConfirmation: this.passwordConfirmation,
      })
      if (!window.confirm('Are you sure to register user?')) {
        return
      }
      await this.$store.dispatch('auth/signUpWithEmail', {
        email: this.email,
        password: this.password,
      })
      window.alert('Please check an email to verify your account.')
      this.$emit('onSignUpSucceeded')
    } catch (e) {
      console.log(e)
      this.$snackbar.error(e.message)
    } finally {
      this.isLoading = false
    }
  }

  private get signUpButtonStyle(): ButtonStyle {
    return ButtonStyle.FILL_BLACK
  }
}
</script>

<style scoped lang="stylus">
@require '~@/assets/style/variables.styl'

.signUpWithEmailView
  .container
    .inputItem
      margin-top $margin_16
      display flex
      flex-direction column

    .signUpButtonContainer
      margin-top $margin_32
      text-align center
</style>
