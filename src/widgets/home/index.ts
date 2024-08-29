import 'server-only';

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';
import { WidgetResultType } from '@akinon/next/types';

export const HOME_WIDGETS: {
  [key: string]: ComponentType<WidgetResultType<unknown>>;
} = {
  // 'home-hero-slider2': dynamic(
  //   async () => import('@theme/widgets/home/home-hero-slider')
  // ),

  // 'home-discovery': dynamic(
  //   async () => import('@theme/widgets/home-discovery')
  // ),
  // 'product-pointer-banners': dynamic(
  //   async () => import('@theme/widgets/product-pointer-banners')
  // ),
  // 'home-storieseng': dynamic(
  //   async () => import('@theme/widgets/home/home-stories-eng')
  // ),
  // 'home-image-leap': dynamic(
  //   async () => import('@theme/widgets/home-images')
  // ),
  // 'sales-on-now': dynamic(
  //   async () => import('@theme/widgets/home/home-sales')
  // ),
  // 'valentines-offer': dynamic(
  //   async () => import('@theme/widgets/home/home-valentine')
  // ),
  // 'leap-banner': dynamic(
  //   async () => import('@theme/widgets/home/home-leap')
  // ),
  // 'feature-intimate': dynamic(
  //   async () => import('@theme/widgets/home/feature/feature-intimate-1')
  // ),
  // 'home-product-recommendation': dynamic(
  //   async () => import('@theme/widgets/home/recommendation/recommendation-one')
  // ),
  // 'feature-product': dynamic(
  //   async () => import('@theme/widgets/home/home-feature-product')
  // ),
  // 'high-performance': dynamic(
  //   async () => import('@theme/widgets/home/home-high-performance')
  // ),

  // 'feature-intimate-2': dynamic(
  //   async () => import('@theme/widgets/home/feature/feature-intimate-2')
  // ),
  // 'featured-in-evening-wear': dynamic(
  //   async () => import('@theme/widgets/home/recommendation/recommendation-two')
  // ),
  // 'finance-plus': dynamic(
  //   async () => import('@theme/widgets/home/home-finance-plus')
  // ),
  // 'featured-in-shoes': dynamic(
  //   async () => import('@theme/widgets/home/recommendation/recommendation-four')
  // ),
  // 'power-on': dynamic(
  //   async () => import('@theme/widgets/home/home-power-on')
  // ),
  // 'featured-in-accessories': dynamic(
  //   async () => import('@theme/widgets/home/recommendation/recommendation-three')
  // ),
  // 'samsung-endless': dynamic(
  //   async () => import('@theme/widgets/home/home-samsung-endless')
  // ),
  // 'lucmo-wines': dynamic(
  //   async () => import('@theme/widgets/home/home-lucmo-wines')
  // ),
  // 'exclusive-discount': dynamic(
  //   async () => import('@theme/widgets/home/home-exclusive-discount')
  // ),
  // 'news': dynamic(
  //   async () => import('@theme/widgets/home/home-news')contact
  // ),
  // 'home-partners': dynamic(
  //   async () => import('@theme/widgets/home/home-partners')
  // ),
  // 'testimonials': dynamic(
  //   async () => import('@theme/widgets/home/testimonials')
  // ),
  // 'home-subscribe': dynamic(
  //   async () => import('@theme/widgets/home/home-subscribe')
  // ),
  // 'home-media-covergae': dynamic(
  //   async () => import('@theme/widgets/home/home-media-covergae')
  // ),
  // 'thank-you': dynamic(
  //   async () => import('@theme/widgets/home/home-thankyou')
  // ),
  'footer-carousel': dynamic(
    async () => import('@theme/widgets/home/home-footer-carousel')
  )

  // 'about-us': dynamic(
  //   async () => import('@theme/widgets/about/about-us')
  // ),
  // 'about-e-commerce': dynamic(
  //   async () => import('@theme/widgets/about/about-ecommerce')
  // ),
  // 'about-co-founder': dynamic(
  //   async () => import('@theme/widgets/about/about-cofounder')
  // ),

};
