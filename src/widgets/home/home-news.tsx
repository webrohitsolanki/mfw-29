import 'server-only';

import { getWidgetData } from '@akinon/next/data/server';
import { ImageType } from '@akinon/next/types';
import HomeNewsContent from '@theme/views/widgets/home/home-news';

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
            url: string;
            mobile_image: string;
            alt: string;
            image: string;
            text: string;
            subtext: string,
        };
    }
];

type HomeLeapType = {
    home_news: HeroSalesItem;
};

export default async function HomeNews() {
    const data = await getWidgetData<HomeLeapType>({
        slug: 'news'
    });
    
    return <HomeNewsContent data={data} />;
}

