<template>
  <Button
    class="emailButton"
    :button-style="buttonStyle"
    @onClicked="onClicked"
  >
    <span class="label">{{ label }}</span>
  </Button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import Button from './Button.vue'
import { ButtonStyle } from '~/types/dto'

@Component({
  components: { Button },
})
export default class EmailButton extends Vue {
  @Prop({ default: '' }) private label!: string
  @Prop({ default: ButtonStyle.FILL_BLACK })
  private buttonStyle!: ButtonStyle

  private onClicked(): void {
    this.$emit('onClicked')
  }
}
</script>

<style scoped lang="stylus">
@require '~@/assets/style/variables.styl'

.emailButton
  .label
    margin-left $margin_8

  &.fillWhite
    color $email_color
    border 2px $email_color solid
</style>
