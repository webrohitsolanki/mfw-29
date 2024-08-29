import 'server-only';

import { getWidgetData } from '@akinon/next/data/server';
import RecommendationContent from '@theme/views/widgets/home/reccomendation/index';

type HomeProductRecommendationType = {
  title: {
    value: string;
  };
};

export default async function HomeProductRecommendationOne() {
  const backgroundColor = '#E987B4';

  const data = await getWidgetData<HomeProductRecommendationType>({
    slug: 'featured-in-intimate'
  });

  return <RecommendationContent data={data} backgroundColor={backgroundColor} />;
}
