import {
  getCategoryData,
  getListData,
  getWidgetData
} from '@akinon/next/data/server';
import { ImageType, PageProps } from '@akinon/next/types';
import HomeFeatureIntimateContent from '@theme/views/widgets/home/home-feature-intimate-content';
import { GetCategoryResponse } from '@akinon/next/types';

type HeroSalesItem = [
  {
    kwargs: {
      data_type: 'nested';
      value: {
        mobile_image: ImageType;
        image: ImageType;
      };
    };
    value: {
      text: string;
    };
  }
];

type HomeLeapType = {
  home_feature_intimate: HeroSalesItem;
};

export default async function FeatureIntimate() {
  const searchParams = new URLSearchParams();
  searchParams.set('category_ids', '523658');

  const backgroundColor = '#ffc0cb';

  const widgetData = await getWidgetData<HomeLeapType>({
    slug: 'feature-intimate-2'
  });

  // Extract relevant data from the widget data
  // const home_feature_intimate = widgetData;
  const data = await getListData({ searchParams });

  return (
    <HomeFeatureIntimateContent
      data={data}
      widgetData={widgetData}
      backgroundColor={backgroundColor}
    />
  );
}
