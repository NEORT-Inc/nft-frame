<template>
  <Modal
    class="signInModal"
    :class="{ sp: $device.isMobileOrTablet }"
    :hide-close-button="hideCloseButton"
    @onCloseAreaClicked="onCloseAreaClicked"
  >
    <PasswordResetView
      v-if="showPasswordReset"
      @onRequestSent="onRequestSent"
      @onBackButtonClicked="onBackButtonForPasswordResetClicked"
    />
    <SignInView
      v-else
      @onSignInSucceeded="onSignInSucceeded"
      @onSignUpButtonClicked="onSignUpButtonClicked"
      @onPasswordResetButtonClicked="onPasswordResetButtonClicked"
    />
    <div v-if="isLoading" class="loadingContainer">loading...</div>
  </Modal>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import Modal from '~/basics/Modal.vue'
import A from '~/basics/A.vue'
import SignInWithEmailView from '~/components/SignInWithEmailView.vue'
import SignInView from '~/components/SignInView.vue'
import PasswordResetView from '~/components/PasswordResetView.vue'

@Component({
  components: {
    PasswordResetView,
    SignInView,
    Modal,
    A,
    SignInWithEmailView,
  },
})
export default class SignInModal extends Vue {
  @Prop({ default: false }) private hideCloseButton!: boolean
  private showPasswordReset: boolean = false

  private get isLoading(): boolean {
    return this.$store.state.firebase.auth.loading
  }

  private onCloseAreaClicked() {
    this.closeModal()
  }

  private onSignInSucceeded() {
    this.closeModal()
  }

  private closeModal() {
    this.$store.dispatch('modal/signInModal/close')
  }

  private onSignUpButtonClicked() {
    this.closeModal()
    this.$store.dispatch('modal/signUpModal/open')
  }

  private onPasswordResetButtonClicked(): void {
    this.showPasswordReset = true
  }

  private onRequestSent(): void {
    this.showPasswordReset = false
  }

  private onBackButtonForPasswordResetClicked(): void {
    this.showPasswordReset = false
  }
}
</script>

<style scoped lang="stylus">
@require '~@/assets/style/variables.styl'

.signInModal
  .loadingContainer
    width 100%
    height 100%
    position absolute
    top 0
    background-color $black_000_opa60
    z-index $z_index_loading
    text-align center
    display flex
    align-items center
    justify-content center
</style>
