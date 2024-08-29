import {
  getCategoryData,
  getListData,
  getWidgetData
} from '@akinon/next/data/server';
import { ImageType, PageProps } from '@akinon/next/types';
import HomeFeatureIntimateContent from '@theme/views/widgets/home/home-feature-intimate-content';
import { GetCategoryResponse } from '@akinon/next/types';
import { LoaderSpinner } from '@akinon/next/components';
import { useEffect } from 'react';

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

export default async function FeatureRecommended({ type }) {
  const searchParams = new URLSearchParams();
  // searchParams.set('category_ids', '523592');
  searchParams.set('search_text', type);

  const backgroundColor = '#ffc0cb';

  const widgetData = await getWidgetData<HomeLeapType>({
    slug: 'recommend-feature'
  });

  // Extract relevant data from the widget data
  // const home_feature_intimate = widgetData;
  const data = await getListData({ searchParams });

  return (
    <>
      {/* {!data && <LoaderSpinner></LoaderSpinner>} */}
      <HomeFeatureIntimateContent
        data={data}
        widgetData={widgetData}
        backgroundColor={backgroundColor}
      />
    </>
  );
}
