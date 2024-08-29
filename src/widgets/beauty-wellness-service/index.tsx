import 'server-only';

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';
import { WidgetResultType } from '@akinon/next/types';

export const BEAUTY_WELLNESS_WIDGETS: {
  [key: string]: ComponentType<WidgetResultType<unknown>>;
} = {
  'beauty-wellness-service-one': dynamic(
    async () => import('@theme/widgets/beauty-wellness-service/header-content')
  ),
};


