<template>
  <div class="frameSignInPage">
    <h1 class="title">SIGN IN</h1>
    <form class="cardInputForm" @submit.prevent="onSubmitForm">
      <div class="inputItemContainer">
        <p class="caption">Email</p>
        <input v-model="email" class="inputItem" type="email" />
      </div>

      <div class="inputItemContainer">
        <p class="caption">Password</p>
        <input v-model="password" class="inputItem" type="password" />
      </div>

      <p v-if="errorMessage" class="responseText errorText">
        {{ errorMessage }}
      </p>
      <p v-else-if="isUpdated" class="responseText successText">
        Successfully updated.
      </p>

      <button class="submitButton" type="submit">SIGN IN</button>
    </form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'

@Component({
  components: {},
})
export default class FrameSignInPage extends Vue {
  private email: string = ''
  private password: string = ''
  private isUpdated: boolean = false

  @Watch('$store.state.frame.signIn.frameSignInInfo')
  private onFrameSignInInfoChanged() {
    this.isUpdated = true
  }

  mounted() {
    if (!this.tempId) {
      this.$snackbar.error('Incorrect ID.')
      return
    }
    this.$store.dispatch('frame/signIn/observeSignIn', this.tempId)
  }

  beforeDestroy() {
    this.$store.dispatch('frame/signIn/clear', this.tempId)
  }

  private async onSubmitForm() {
    this.isUpdated = false

    if (!this.email) {
      window.alert('Email is invalid.')
      return
    } else if (!this.password) {
      window.alert('Password is invalid.')
      return
    } else if (this.errorMessage) {
      window.alert('There is an error.')
      return
    }
    try {
      await this.$store.dispatch('frame/signIn/signIn', {
        tempId: this.tempId,
        email: this.email,
        password: this.password,
      })
      this.$router.push('/arts')
    } catch (e) {
      console.log(e)
      this.$snackbar.error(e.message)
    }
  }

  private get tempId(): string {
    return this.$route.params.id
  }

  private get errorMessage(): string {
    return this.$store.state.frame.signIn.errorMessage
  }
}
</script>

<style scoped lang="stylus">
@require '~@/assets/style/variables.styl'
@require '~@/assets/style/mixin.styl'

.frameSignInPage
  max-width 1024px
  padding 20px
  box-sizing border-box
  margin 0 auto

  .title
    font-size 2.8rem
    text-align center

  .cardInputForm
    margin-top 40px

    .inputItemContainer
      .inputItem
        width 100%
        display block
        padding 12px
        box-sizing border-box
        background-color $white_fff
        border 2px $gray_ddd solid
        margin-top 10px

      &:nth-child(n + 2)
        margin-top 20px

    .responseText
      text-align center
      margin-top 20px
      color $alertColor

      &.errorText
        color $red_ff0000

    .submitButton
      height 40px
      display block
      color $textOnPrimaryColor
      cursor pointer
      background-color $white_fff
      border 2px $black_000 solid
      padding 0 8px
      box-sizing border-box
      margin 40px auto 0
</style>
