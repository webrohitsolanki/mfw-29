import 'server-only';

import { getWidgetData } from '@akinon/next/data/server';
import RecommendationContent from '@theme/views/widgets/home/reccomendation/index';

type HomeProductRecommendationType = {
  title: {
    value: string;
  };
};

export default async function HomeProductRecommendationThree() {
  const backgroundColor = '#FCF1ED';

  const data = await getWidgetData<HomeProductRecommendationType>({
    slug: 'featured-in-accessories'
  });

  return <RecommendationContent data={data} backgroundColor={backgroundColor} />;
}
