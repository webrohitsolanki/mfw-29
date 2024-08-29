import 'server-only';

import { getWidgetData } from '@akinon/next/data/server';
import RecommendationContent from '@theme/views/widgets/home/reccomendation/index';

type HomeProductRecommendationType = {
  title: {
    value: string;
  };
};

export default async function HomeProductRecommendationFour() {
  const backgroundColor = '#F7ECD9';

  const data = await getWidgetData<HomeProductRecommendationType>({
    slug: 'featured-in-shoes'
  });

  return <RecommendationContent data={data} backgroundColor={backgroundColor} />;
}
