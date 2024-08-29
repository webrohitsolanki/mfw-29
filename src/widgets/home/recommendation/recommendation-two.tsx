import 'server-only';

import { getWidgetData } from '@akinon/next/data/server';
import RecommendationContent from '@theme/views/widgets/home/reccomendation/index';

type HomeProductRecommendationType = {
  title: {
    value: string;
  };
};

export default async function HomeProductRecommendationTwo() {
  const backgroundColor = '#FDF0F6';

  const data = await getWidgetData<HomeProductRecommendationType>({
    slug: 'featured-in-evening-wear'
  });

  return <RecommendationContent data={data} backgroundColor={backgroundColor} />;
}
