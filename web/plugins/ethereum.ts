import { Plugin } from '@nuxt/types'

// Define so an error cannot be thrown in Vue components
declare module 'vue/types/vue' {
  interface Vue {
    $ethereum: any
  }
}

// eslint-disable-next-line no-empty-pattern
const ethereumPlugin: Plugin = ({}, inject) => {
  const { ethereum } = window as any
  inject('ethereum', ethereum || {})
}

export default ethereumPlugin
