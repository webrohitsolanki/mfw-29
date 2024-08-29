import 'server-only';

import { getCategoryData, getListData, getWidgetData } from '@akinon/next/data/server';
import { ImageType } from '@akinon/next/types';
import BeautyHeaderContent from '@theme/views/beauty-service-content/header-content';
const CATEGORY_IDS = process.env.CATEGORY_IDS;
const CATEGORY_NUMBER_BEAUTY = process.env.CATEGORY_NUMBER_BEAUTY;

type HeroSalesItem = [
    {
        kwargs: {
            data_type: 'nested';
            value: {
                mobile_image: ImageType;
                image: ImageType;
                subtext: string;

            };
        };
        value: {
            url: string;
            mobile_image: string;
            alt: string;
            image: string;
            text: string;
            subtext: string;
        };
    }
];

type HomeLeapType = {
    beauty_wellness_service: HeroSalesItem;
};

export default async function HomeHeroSlider() {
    const searchParams = new URLSearchParams();
    // await searchParams.set(CATEGORY_IDS, CATEGORY_NUMBER_BEAUTY);
    // await searchParams.set('category_ids', '523719');

    // const dynamicDataObject = {
    //     ...searchParams
    // };

    // const datas = await getListData({ searchParams });
    // await searchParams.delete('category_ids');
    const datas = await getCategoryData({ pk: 523719, searchParams });

    const data = await getWidgetData<HomeLeapType>({
        slug: 'beauty-wellness-service-one'
    });
    return <BeautyHeaderContent data={data} datas={datas} />;
}


