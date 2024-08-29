import 'server-only';

import { getWidgetData } from '@akinon/next/data/server';
import { ImageType } from '@akinon/next/types';
import HomeValentineContent from '@theme/views/widgets/home/home-valentine-content';

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
    status:string;
};

export default async function HomeValentines() {
    const data = await getWidgetData<HomeAdvertismentType>({
        slug: 'valentines-offer'
    });

   if (data.attributes.status === 'Active') {
        return <HomeValentineContent data={data} />;
    }
}

