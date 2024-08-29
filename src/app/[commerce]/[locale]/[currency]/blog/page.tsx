// import 'server-only';

import { getWidgetData } from '@akinon/next/data/server';
import { ImageType } from '@akinon/next/types';
// import NewsBlog from '@theme/views/news-blog/index';
import NewsContent from '@theme/views/news-blog/news-content';
// import BlogPage from '@theme/app/[commerce]/[locale]/[currency]/blog/page';

type HeroSalesItem = [
  {
    kwargs: {
      data_type: 'nested';
      value: {
        mobile_image: ImageType;
        image: ImageType;
        url: ImageType;
      };
    };
    value: {
      url: string;
      mobile_image: string;
      alt: string;
      text: string;
      title: string;
      subtext: string;
      content: string;
    };
  }
];

type HomeLeapType = {
  news_blog: HeroSalesItem;
};

export default async function HomeHeroSlider() {
  const data = await getWidgetData<HomeLeapType>({
    slug: 'news-blog'
  });


  return (
    <>
      <NewsContent data={data} />
    </>
  )
}



