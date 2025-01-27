import { Metadata } from '@akinon/next/types';

const pwaTags: Metadata = {
  manifest: '/manifest.json',
  themeColor: '#FFFFFF',
  formatDetection: {
    telephone: false
  },
  appleWebApp: {
    capable: true,
    title: 'Project ZERO | Next',
    statusBarStyle: 'default'
  },
  other: {
    ['mobile-web-app-capable']: 'yes',
    ['application-name']: 'Project ZERO Next'
  },
  icons: [
    {
      rel: 'mask-icon',
      type: 'image/svg+xml',
      url: 'safari-pinned-tab.svg'
    },
    {
      rel: 'apple-touch-icon',
      type: 'image/png',
      sizes: '57x57',
      url: 'apple-touch-icon.png'
    },
    {
      rel: 'apple-touch-icon',
      type: 'image/png',
      sizes: '152x152',
      url: 'apple-touch-icon-152x152.png'
    },
    {
      rel: 'apple-touch-icon',
      type: 'image/png',
      sizes: '167x167',
      url: 'apple-touch-icon-167x167.png'
    },
    {
      rel: 'apple-touch-icon',
      type: 'image/png',
      sizes: '180x180',
      url: 'apple-touch-icon-180x180.png'
    },
    {
      rel: 'apple-touch-startup-image',
      type: 'image/png',
      url: 'apple-splash-2048-2732.jpg',
      media:
        '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
    },
    {
      rel: 'apple-touch-startup-image',
      type: 'image/png',
      url: 'apple-splash-2732-2048.jpg',
      media:
        '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)'
    },
    {
      rel: 'apple-touch-startup-image',
      type: 'image/png',
      url: 'apple-splash-1668-2388.jpg',
      media:
        '(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
    },
    {
      rel: 'apple-touch-startup-image',
      type: 'image/png',
      url: 'apple-splash-2388-1668.jpg',
      media:
        '(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)'
    },
    {
      rel: 'apple-touch-startup-image',
      type: 'image/png',
      url: 'apple-splash-1536-2048.jpg',
      media:
        '(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
    },
    {
      rel: 'apple-touch-startup-image',
      type: 'image/png',
      url: 'apple-splash-2048-1536.jpg',
      media:
        '(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)'
    },
    {
      rel: 'apple-touch-startup-image',
      type: 'image/png',
      url: 'apple-splash-1668-2224.jpg',
      media:
        '(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
    },
    {
      rel: 'apple-touch-startup-image',
      type: 'image/png',
      url: 'apple-splash-2224-1668.jpg',
      media:
        '(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)'
    },
    {
      rel: 'apple-touch-startup-image',
      type: 'image/png',
      url: 'apple-splash-1620-2160.jpg',
      media:
        '(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
    },
    {
      rel: 'apple-touch-startup-image',
      type: 'image/png',
      url: 'apple-splash-2160-1620.jpg',
      media:
        '(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)'
    },
    {
      rel: 'apple-touch-startup-image',
      type: 'image/png',
      url: 'apple-splash-1284-2778.jpg',
      media:
        '(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
    },
    {
      rel: 'apple-touch-startup-image',
      type: 'image/png',
      url: 'apple-splash-2778-1284.jpg',
      media:
        '(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)'
    },
    {
      rel: 'apple-touch-startup-image',
      type: 'image/png',
      url: 'apple-splash-1170-2532.jpg',
      media:
        '(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
    },
    {
      rel: 'apple-touch-startup-image',
      type: 'image/png',
      url: 'apple-splash-2532-1170.jpg',
      media:
        '(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)'
    },
    {
      rel: 'apple-touch-startup-image',
      type: 'image/png',
      url: 'apple-splash-1125-2436.jpg',
      media:
        '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
    },
    {
      rel: 'apple-touch-startup-image',
      type: 'image/png',
      url: 'apple-splash-2436-1125.jpg',
      media:
        '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)'
    },
    {
      rel: 'apple-touch-startup-image',
      type: 'image/png',
      url: 'apple-splash-1242-2688.jpg',
      media:
        '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
    },
    {
      rel: 'apple-touch-startup-image',
      type: 'image/png',
      url: 'apple-splash-2688-1242.jpg',
      media:
        '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)'
    },
    {
      rel: 'apple-touch-startup-image',
      type: 'image/png',
      url: 'apple-splash-828-1792.jpg',
      media:
        '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
    },
    {
      rel: 'apple-touch-startup-image',
      type: 'image/png',
      url: 'apple-splash-1792-828.jpg',
      media:
        '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)'
    },
    {
      rel: 'apple-touch-startup-image',
      type: 'image/png',
      url: 'apple-splash-1242-2208.jpg',
      media:
        '(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
    },
    {
      rel: 'apple-touch-startup-image',
      type: 'image/png',
      url: 'apple-splash-2208-1242.jpg',
      media:
        '(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)'
    },
    {
      rel: 'apple-touch-startup-image',
      type: 'image/png',
      url: 'apple-splash-750-1334.jpg',
      media:
        '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
    },
    {
      rel: 'apple-touch-startup-image',
      type: 'image/png',
      url: 'apple-splash-1334-750.jpg',
      media:
        '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)'
    },
    {
      rel: 'apple-touch-startup-image',
      type: 'image/png',
      url: 'apple-splash-640-1136.jpg',
      media:
        '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
    },
    {
      rel: 'apple-touch-startup-image',
      type: 'image/png',
      url: 'apple-splash-1136-640.jpg',
      media:
        '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)'
    }
  ]
};

export default pwaTags;
