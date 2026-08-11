import { defineConfig } from 'vitepress';

export default defineConfig({
  base: '/openapply/',
  title: 'OpenApply',
  description: 'The Open-Source, Privacy-First LinkedIn Copilot & Unemployment Log Engine',
  lang: 'en-US',
  cleanUrls: true,
  appearance: 'dark',
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/openapply/logo.png' }],
    ['meta', { name: 'theme-color', content: '#059669' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'en_US' }],
    ['meta', { property: 'og:title', content: 'OpenApply | Privacy-First LinkedIn Copilot & Work-Search Log' }],
    ['meta', { property: 'og:site_name', content: 'OpenApply' }],
    ['meta', { property: 'og:url', content: 'https://olakra.github.io/openapply/' }],
    ['meta', { property: 'og:image', content: 'https://olakra.github.io/openapply/logo.png' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:site', content: '@openapply' }],

    // Google Analytics (GA4) Boilerplate
    [
      'script',
      {
        async: '',
        src: 'https://www.googletagmanager.com/gtag/js?id=G-OPENAPPLY2026'
      }
    ],
    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-OPENAPPLY2026', { 'anonymize_ip': true });`
    ]
  ],

  themeConfig: {
    logo: '/logo.png',
    siteTitle: 'OpenApply',
    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'Features', link: '/#features' },
      { text: 'Roadmap', link: '/roadmap' },
      { text: 'Releases', link: '/releases' },
      { text: 'GitHub', link: 'https://github.com/olakra/openapply' }
    ],

    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Overview & Quickstart', link: '/guide/' },
          { text: 'Installation & MV3 Setup', link: '/guide/installation' },
          { text: 'BYOK Security & Privacy', link: '/guide/privacy-security' }
        ]
      },
      {
        text: 'Core Modules',
        items: [
          { text: 'LinkedIn Job Filtering', link: '/guide/job-filtering' },
          { text: '1-Click ATS Scorecards', link: '/guide/ats-scorecard' },
          { text: 'AI Cover Letter Generator', link: '/guide/cover-letters' },
          { text: 'Unemployment Log & Drive Sync', link: '/guide/unemployment-log' }
        ]
      },
      {
        text: 'Project & Community',
        items: [
          { text: 'Feature Roadmap', link: '/roadmap' },
          { text: 'Release Changelog', link: '/releases' },
          { text: 'Support & Sponsorship', link: '/guide/support' }
        ]
      }
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/olakra/openapply' }],

    footer: {
      message: 'Made with ❤️ in Seattle | Licensed under GNU General Public License v3.0 (GPL-3.0)',
      copyright: 'Copyright © 2026 OpenApply. Open-source, client-side, privacy-first software.'
    },

    search: {
      provider: 'local'
    }
  }
});
