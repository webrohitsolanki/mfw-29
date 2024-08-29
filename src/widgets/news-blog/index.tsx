import 'server-only';

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';
import { WidgetResultType } from '@akinon/next/types';

export const NEWS_WIDGETS: {
  [key: string]: ComponentType<WidgetResultType<unknown>>;
} = {
  'news-blog': dynamic(
    async () => import('@theme/widgets/news-blog/news')
  ),
};
