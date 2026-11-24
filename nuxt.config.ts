import tailwindcss from '@tailwindcss/vite'

const siteUrl = 'https://isaactsienyane.co.za'

export default defineNuxtConfig({
  compatibilityDate: '2026-11-01',
  modules: ['@nuxt/content', '@nuxt/fonts'],
  css: ['~/assets/css/main.css'],
  components: [{ path: '~/components', pathPrefix: false }],
  vite: {
    plugins: [tailwindcss()],
  },
  runtimeConfig: {
    public: { siteUrl },
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', media: '(prefers-color-scheme: light)', content: '#eef0f4' },
        { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#0e1626' },
        { property: 'og:image', content: `${siteUrl}/images/og-default.png` },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/images/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/images/favicon-16x16.png' },
        { rel: 'apple-touch-icon', href: '/images/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
      ],
      script: [
        {
          // Apply the saved theme before first paint to avoid a flash.
          innerHTML:
            "try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}",
          tagPosition: 'head',
        },
      ],
    },
  },
  content: {
    experimental: { sqliteConnector: 'native' },
    build: {
      markdown: {
        highlight: {
          theme: { default: 'github-light', dark: 'github-dark' },
          langs: ['kotlin', 'java', 'ts', 'js', 'vue', 'php', 'bash', 'json', 'swift'],
        },
      },
    },
  },
  fonts: {
    families: [
      { name: 'Bricolage Grotesque', provider: 'google', weights: ['400 800'] },
      { name: 'Source Serif 4', provider: 'google', weights: ['400 700'], styles: ['normal', 'italic'] },
    ],
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/apps', '/blog'],
    },
  },
})
