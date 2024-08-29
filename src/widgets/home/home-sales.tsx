import 'server-only';

import { getWidgetData } from '@akinon/next/data/server';
import { ImageType } from '@akinon/next/types';
import HomeAdvertismentContent from '@theme/views/widgets/home/home-advertisment-content';

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
        };
    }
];

type HomeAdvertismentType = {
    home_advertisment: HeroSalesItem;
    status: string;
};

export default async function HomeSales() {
    const data = await getWidgetData<HomeAdvertismentType>({
        slug: 'sales-on-now'
    });
    
    if (data.attributes.status === 'Active') {
        return <HomeAdvertismentContent data={data} />;
    }
}
