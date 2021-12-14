<template>
  <Modal
    class="signUpModal"
    :class="{ sp: $device.isMobileOrTablet }"
    :hide-close-button="hideCloseButton"
    @onCloseAreaClicked="onCloseAreaClicked"
  >
    <SignUpView
      :show-sign-in-link="showSignInLink"
      @onSignUpSucceeded="onSignUpSucceeded"
      @onSignInButtonClicked="onSignInButtonClicked"
    />
    <div v-if="isLoading" class="loadingContainer">loading...</div>
  </Modal>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import Modal from '~/basics/Modal.vue'
import A from '~/basics/A.vue'
import SignUpView from '~/components/SignUpView.vue'

@Component({
  components: {
    SignUpView,
    Modal,
    A,
  },
})
export default class SignUpModal extends Vue {
  @Prop({ default: false }) private hideCloseButton!: boolean
  @Prop({ default: true }) private showSignInLink!: boolean

  private get isLoading(): boolean {
    return this.$store.state.firebase.auth.loading
  }

  private onCloseAreaClicked() {
    this.closeModal()
  }

  private onSignUpSucceeded() {
    this.closeModal()
  }

  private closeModal() {
    this.$store.dispatch('modal/signUpModal/close')
  }

  private onSignInButtonClicked() {
    this.closeModal()
    this.$store.dispatch('modal/signInModal/open')
  }
}
</script>

<style scoped lang="stylus">
@require '~@/assets/style/variables.styl'

.signUpModal
  .contents
    height 100%
    overflow scroll
    .heading
      text-align center
      font-size $font_size_24
    .lead
      font-size $font_size_14
      font-weight $font_weight_bold
      text-align center
      margin-top $margin_32
    .signUpWithSNS
      margin-top $margin_32
      .buttonList
        display flex
        max-width 320px
        width 100%
        margin auto
        .item
          flex 1
    .divider
      font-size $font_size_14
      text-align center
      margin-top $margin_16
    .signUpWithEmailView
      max-width 320px
      width 100%
      margin $margin_16 auto 0
    .termsAndPolicyText
      margin-top $margin_32
    .signInButtonContainer
      margin-top $margin_32
      padding-top $padding_32
      text-align center
      border-top 2px solid $gray_ededed
      .signInButton
        color $black_212121
        font-size $font_size_14
        font-weight $font_weight_bold

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
