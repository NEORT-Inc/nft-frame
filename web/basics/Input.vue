<template>
  <label class="input">
    <span v-if="$slots.label" class="label">
      <slot name="label"></slot>
    </span>
    <span v-else-if="label" class="label">{{ label }}</span>

    <input
      :id="id"
      ref="input"
      :class="{ hasError: isError }"
      :type="type"
      :name="name"
      :placeholder="placeholder"
      :value="value"
      @input="onValueUpdated"
    />
  </label>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import A from '~/basics/A.vue'

@Component({
  components: { A },
})
export default class Input extends Vue {
  @Prop() private label!: string
  @Prop({ default: 'text' }) private type!: string
  @Prop({ default: '' }) private name!: string
  @Prop({ default: '' }) private placeholder!: string
  @Prop({ default: '' }) private value!: string
  @Prop({ default: false }) private isError!: boolean
  @Prop({
    default: () =>
      new Date().getTime().toString() + Math.floor(Math.random() * 10000),
  })
  private id!: string

  public clear() {
    ;(this.$refs.input as any).value = ''
  }

  public set(value: string) {
    const previousValue: string = (this.$refs.input as any).value
    ;(this.$refs.input as any).value = value

    if (previousValue !== value) {
      this.$emit('input', value)
      this.$emit('change', value)
    }
  }

  private onValueUpdated(e: any) {
    let value = e.target.value
    switch (this.type) {
      case 'number':
        if (value === '') {
          this.$emit('input', 0)
          this.$emit('change', 0)
          return
        }
        value = parseFloat(value)
        if (!isNaN(value)) {
          this.$emit('input', value)
          this.$emit('change', value)
        }
        break

      default:
        this.$emit('input', value)
        this.$emit('change', value)
        break
    }
  }
}
</script>

<style scoped lang="stylus">
@require '~@/assets/style/variables.styl'

label
  display block

  .label
    display inline-block
    margin-bottom 8px

    span
      color $black_212121
      margin-left 12px
      font-size $font_size_14

  input
    width 100%
    height 48px
    display block
    box-sizing border-box
    background-color $white_fff
    border 1px $gray_bcbcbc solid
    border-radius 4px
    font-size $font_size_16
    font-family $font_family_ja
    padding 0 $padding_12

  &.hasError
    border 2px $red_ff0000 solid
</style>
