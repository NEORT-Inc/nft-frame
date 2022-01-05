<template>
  <div class="signInOrSignUpView" :class="{ sp: $device.isMobile }">
    <PasswordResetView
      v-if="showPasswordReset"
      @onRequestSent="onPasswordResetRequestSent"
      @onBackButtonClicked="onBackButtonForPasswordResetClicked"
    />
    <SignInView
      v-else-if="showSignInView"
      @onSignUpButtonClicked="onSignUpButtonClicked"
      @onPasswordResetButtonClicked="onPasswordResetButtonClicked"
    />
    <SignUpView
      v-else-if="showSignUpView"
      @onSignInButtonClicked="onSignInButtonClicked"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import SignInView from '~/components/SignInView.vue'
import SignUpView from '~/components/SignUpView.vue'
import PasswordResetView from '~/components/PasswordResetView.vue'

enum Type {
  SIGN_IN = 'sign_in',
  SIGN_UP = 'sign_up',
}

@Component({
  components: {
    PasswordResetView,
    SignUpView,
    SignInView,
  },
})
export default class SignInOrSignUpView extends Vue {
  private currentType: Type = Type.SIGN_IN
  private showPasswordReset: boolean = false

  private onSignUpButtonClicked() {
    this.currentType = Type.SIGN_UP
  }

  private onSignInButtonClicked() {
    this.currentType = Type.SIGN_IN
  }

  private onPasswordResetButtonClicked() {
    this.showPasswordReset = true
  }

  private onPasswordResetRequestSent() {
    this.showPasswordReset = false
  }

  private onBackButtonForPasswordResetClicked() {
    this.showPasswordReset = false
  }

  private get isSignedIn(): boolean {
    return this.$store.getters['auth/isSignedIn']()
  }

  private get showSignInView(): boolean {
    return !this.isSignedIn && this.currentType === Type.SIGN_IN
  }

  private get showSignUpView(): boolean {
    return !this.isSignedIn && this.currentType === Type.SIGN_UP
  }
}
</script>

<style scoped lang="stylus">
@require '~@/assets/style/variables.styl'
@require '~@/assets/style/mixin.styl'
</style>
