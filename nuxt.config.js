import 'dotenv/config';
import colors from 'vuetify/es5/util/colors'
import i18n from './Vuei18n';

export default {
  // Target (https://go.nuxtjs.dev/config-target)
  target: 'server', // static 
  // this website can not be rendered by static rendering.
  // the reason for that is that for fetching last invites on the 
  // index.vue page, we need jwt auth which we dont have without login 
  // and cant be generated in build time.
  // one solution for that can be embedding adminSecret in build time but I am 
  // afraid of that


  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'share cafe',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'share cafe' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    '@/assets/scss/main.scss',
    '@/assets/scss/bootstrap.css',
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    { src: '~/plugins/auth0-lock.js', ssr: false },    
    { src: '~/plugins/vue-beautiful-chat.js', ssr: false },    
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    '@nuxtjs/dotenv',
    '@nuxt/typescript-build',
    ['@nuxtjs/fontawesome',{
      component: 'fa',
      icons: {
        solid: true
      }
    }],
    '@nuxtjs/vuetify',
    [
      'nuxt-i18n',
      {
        defaultLocale: 'de',
        locales: [
          {
            code: 'en',
            name: 'English'
          },
          {
            code: 'de',
            name: 'Deutsch'
          },
          {
            code: 'ir',
            name: 'Farsi'
          }
        ],
        vueI18n: i18n
      }
    ]
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    "@nuxtjs/apollo",
    ['cookie-universal-nuxt', { alias: 'cookiz' }],
    '@nuxtjs/pwa'
  ],

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }, defaultAssets: {
      icons: 'mdi',
    }
  },

  fontawesome: {
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    extend(config, { isDev, isClient }) {
      const svgRule = config.module.rules.find(rule => rule.test.test('.svg'));
      
      svgRule.test = /\.(png|jpe?g|gif|webp)$/;
 
      config.module.rules.push({
        test: /\.svg$/,
        use: [
          'babel-loader',
          'vue-svg-loader',
        ],
      });
    }
  },

  privateRuntimeConfig: {
  },

  router: {
    // middleware: 'auth',
  },

  apollo: {
    includeNodeModules: true,// Add GQL file recognition on node_modules
    errorHandler: '~/plugins/apollo-error-handler.js',
    clientConfigs: {
      default: '~/plugins/alternative-apollo-config.js',
    }
  },

  pwa: {
    meta: {
      theme_color: '#F8F8F8',
    }
  }  
}
