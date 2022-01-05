<template>
  <div class="welcomePage">
    <div class="contentsContainer">
      <h1 class="heading">Welcome</h1>
      <div>
        <p class="message">Enjoy displaying Digital Art.</p>
      </div>
      <div class="detailContainer">
        <n-link to="/arts">Go to arts page</n-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
@Component({
  components: {},
})
export default class WelcomePage extends Vue {}
</script>

<style scoped lang="stylus">
@require '~@/assets/style/variables.styl'
@require '~@/assets/style/mixin.styl'

.welcomePage
  .contentsContainer
    max-width 640px
    margin $margin_48 auto $margin_96
    padding 0 $padding_24

    .heading
      font-size $font_size_32
      font-weight $font_weight_bold
      text-align center

    .message
      background $gray_f8f8f8
      padding $padding_32
      font-size $font_size_16
      text-align center
      margin-top $margin_32

    .detailContainer
      text-align center
      margin-top $margin_24
</style>
