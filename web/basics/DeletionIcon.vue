<template>
  <i class="deletionIcon" @click="onClicked">-</i>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({})
export default class DeletionIcon extends Vue {
  private onClicked() {
    this.$emit('onClicked')
  }
}
</script>

<style scoped lang="stylus">
@require '~@/assets/style/variables.styl'

.deletionIcon
  background $red_ff0000
  color $white_fff
  width 24px
  height 24px
  display flex
  border-radius 100%
  justify-content center
  align-items center
  font-size $font_size_24
  cursor pointer

  &:hover
    opacity 0.75
</style>
