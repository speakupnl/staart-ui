import { Configuration } from "@nuxt/types";

const config: Configuration = {
  mode: "universal",
  generate: {
    dir: "public"
  },
  head: {
    title: "Speakup Developer Portal",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: "Developer API platform by Speakup"
      }
    ],
    link: [
      { rel: "mask-icon", color: "#673ab7", href: "/safari-pinned-tab.svg" },
      {
        rel: "apple-touch-icon",
        sizes: "76x76",
        href: "/apple-touch-icon.png"
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png"
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png"
      },
      {
        rel: "stylesheet",
        href:
          "https://cdnjs.cloudflare.com/ajax/libs/balloon-css/1.0.3/balloon.min.css"
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css?family=Lato:400,700&display=swap"
      }
    ],
    script: [
      {
        type: "text/javascript",
        src:
          "https://polyfill.io/v3/polyfill.min.js?features=es5%2Ces6%2Ces7%2CrequestIdleCallback%2CBlob%2CIntersectionObserver%2CHTMLPictureElement%2CIntersectionObserverEntry%2CMutationObserver%2Cfetch%2ClocalStorage%2CPromise%2CPromise.prototype.finally"
      },
      {
        type: "text/javascript",
        src: "https://public-cdn.oswaldlabs.com/focus-visible.js",
        async: true
      },
      {
        type: "text/javascript",
        src: "https://platform-beta.oswaldlabs.com/v1/agastya/load/speakup-staart-3d14a.js",
        async: true
      }
    ]
  },
  loading: { color: "#492257" },
  css: [],
  plugins: [
    "~/plugins/axios",
    { src: "~/plugins/vue-notification", ssr: false },
    "~/plugins/vue-timeago",
    "~/plugins/meta-ctrl-enter",
    "~/plugins/filters",
    { src: "~/plugins/vuex-persist", ssr: false }
  ],
  modules: [
    "@nuxtjs/dotenv",
    "@nuxtjs/axios",
    "@nuxtjs/pwa",
    "@nuxtjs/markdownit",
    "@nuxtjs/sitemap",
    "@bazzite/nuxt-netlify",
    [
      "@nuxtjs/google-analytics",
      {
        id: "UA-79176349-16"
      }
    ]
  ],
  buildModules: ["@nuxt/typescript-build"],
  axios: {
    baseURL:
      process.env.NODE_ENV === "production"
        ? "https://speakup-staart.caprover.oswaldlabs.com/v1"
        : "http://localhost:7005/v1"
  },
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
  build: {
    extend(config, ctx) {
      if (ctx.isDev && ctx.isClient && config && config.module) {
        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /(node_modules)/,
          options: {
            fix: true
          }
        });
      }
    }
  },
  typescript: {
    typeCheck: true,
    ignoreNotFoundWarnings: true
  }
};

export default config;
