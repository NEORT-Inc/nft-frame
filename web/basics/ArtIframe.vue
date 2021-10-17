<template>
  <iframe
    ref="artIframe"
    class="artIframe"
    frameborder="0"
    sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-same-origin allow-scripts"
    :allow="allowSettings"
    allowfullscreen="true"
    allowtransparency="true"
  ></iframe>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator'
// eslint-disable-next-line no-undef
import Timeout = NodeJS.Timeout

@Component({})
export default class ArtIframe extends Vue {
  @Prop({ default: null }) private url!: string | null
  @Prop({ default: true }) private enableAccessToUserMedia!: boolean

  private timerId: Timeout | null = null

  @Watch('url')
  onUrlChanged(newValue: string, oldValue: string): void {
    if (newValue !== oldValue) {
      this.replaceUrl(newValue)
    }
  }

  async mounted() {
    await this.$nextTick()

    // To resolve the problem that sometimes artwork is not shown after browser refresh.
    // Looks window size inside iframe becomes 0.
    // FIXME: This is a terrible workaround for the problem above...
    this.timerId = setTimeout(() => {
      this.replaceUrl(this.url)
    }, 500)
  }

  beforeDestroy() {
    if (this.timerId) {
      clearTimeout(this.timerId)
    }
  }

  private replaceUrl(url: string | null): void {
    if (url) {
      if (this.enableAccessToUserMedia) {
        // This allows iframe changing to add to history.
        ;(this.$refs.artIframe as any).src = this.url
        this.$emit('onSrcUpdated')
      } else {
        // Replace URL manually since the history is stacked if the url of iframe is changed.
        // This means history back navigate you to not previous page but previous iframe state.
        // But this makes microphone access disable...
        ;(this.$refs.artIframe as any).contentWindow.location.replace(url)
      }
    }
  }

  private get allowSettings(): string {
    return this.enableAccessToUserMedia
      ? 'geolocation; microphone; camera; midi; vr; xr-spatial-tracking'
      : ''
  }
}
</script>
