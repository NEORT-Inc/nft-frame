// @ts-ignore
import { ENV_DEV } from './configs/env.development'
// @ts-ignore
import { ENV_PRD } from './configs/env.production'
const environment = process.env.PROJECT_ENV || 'development'
const ENV =
  environment === 'local'
    ? require(`./configs/env.local.ts`).ENV_LOCAL
    : environment === 'development'
    ? ENV_DEV
    : ENV_PRD
export default {
  ssr: true,
  srcDir: 'web/',
  head: {
    title: 'nft-frame',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  css: ['@/assets/style/common.styl', '@mdi/font/css/materialdesignicons.css'],
  plugins: [
    { src: '~plugins/snackbar', ssr: false },
    { src: '~plugins/ethereum', ssr: false },
    { src: '~plugins/walletConnect', ssr: false },
  ],
  components: true,
  buildModules: ['@nuxt/typescript-build'],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/firebase',
    '@nuxtjs/device',
    '@nuxtjs/toast',
  ],
  axios: {},
  firebase: {
    config: {
      apiKey: ENV.API_KEY,
      authDomain: ENV.AUTH_DOMAIN,
      projectId: ENV.PROJECT_ID,
      storageBucket: ENV.STORAGE_BUCKET,
      messagingSenderId: ENV.MESSAGING_SENDER_ID,
      appId: ENV.APP_ID,
    },
    services: {
      auth: {
        initialize: {
          onAuthStateChangedAction: 'firebase/auth/onAuthStateChanged',
        },
        ssr: false,
      },
      firestore: {
        enablePersistence: false,
      },
      analytics: {
        collectionEnabled: true,
      },
    },
  },
  toast: {
    position: 'bottom-right',
    register: [
      {
        name: 'success',
        message: (payload) => {
          return payload.message || '成功しました'
        },
        options: {
          type: 'success',
          duration: 5000,
        },
      },
      {
        name: 'error',
        message: (payload) => {
          return payload.message || 'エラーが発生しました'
        },
        options: {
          type: 'error',
          duration: 5000,
          keepOnHover: true,
        },
      },
    ],
  },
  build: {},
  env: ENV,
}
