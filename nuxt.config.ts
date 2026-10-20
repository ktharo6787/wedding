export default defineNuxtConfig({
    devtools: { enabled: false },
  css: ['~/assets/css/modern-khmer.css', '~/assets/css/admin.css'],
  compatibilityDate: '2025-05-01',
  app: {
    head: {
      title: 'ថារ៉ូ & ធានី | Wedding Invitation',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#092d29' },
        { name: 'description', content: 'Celebrate the wedding of ថារ៉ូ and ធានី on 6 December 2026.' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Battambang:wght@400;700&family=Jost:wght@400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap' }
      ]
    }
  }
})
