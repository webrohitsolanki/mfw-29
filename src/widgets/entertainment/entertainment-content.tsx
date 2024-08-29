// import 'server-only';

// import { getListData, getWidgetData } from '@akinon/next/data/server';
// import { ImageType } from '@akinon/next/types';
// import AboutContent from '@theme/views/widgets/about/about-content';
// import EntertanimentContent from '@theme/views/entertainment';
// import ListPage from '@theme/views/entertainment/category-info';

// type HeroSalesItem = [
//     {
//         kwargs: {
//             data_type: 'nested';
//             value: {
//                 mobile_image: ImageType;
//                 image: ImageType;
//                 subtext: string;

//             };
//         };
//         value: {
//             url: string;
//             mobile_image: string;
//             alt: string;
//             image: string;
//             text: string;
//             subtext: string;
//         };
//     }
// ];

// type HomeLeapType = {
//     entertainmnet_info: HeroSalesItem;
// };

// export default async function EntertainmentMain() {
//     // const searchParams = new URLSearchParams();
//     // await searchParams.set('category_ids', '523718');

//     // const datas = await getListData({ searchParams });

//     // await searchParams.delete('category_ids');
//     // const data = await getWidgetData<HomeLeapType>({
//     //     slug: 'entertainment-info'
//     // });
//     const searchParams = new URLSearchParams();
//     await searchParams.set('category_ids', '523718');

//     const data = await getListData({ searchParams });

//     await searchParams.delete('category_ids');


//     return <ListPage data={data} />;
// }

import 'server-only';

import { getCategoryData, getListData, getWidgetData } from '@akinon/next/data/server';
import { ImageType } from '@akinon/next/types';
import BeautyHeaderContent from '@theme/views/beauty-service-content/header-content';
import EnterTainmentContentTwo from '@theme/views/entertainment/entertainment-content';
const CATEGORY_IDS = process.env.CATEGORY_IDS;
const CATEGORY_NUMBER_ENTERTAINMENT = process.env.CATEGORY_NUMBER_ENTERTAINMENT;

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
    products: HeroSalesItem;
};

export default async function HomeHeroSlider() {
    const searchParams = new URLSearchParams();
    // await searchParams.set(CATEGORY_IDS, CATEGORY_NUMBER_ENTERTAINMENT);
    // await searchParams.set('category_ids', '523718');
    
    const datas = await getCategoryData({ pk: 523718, searchParams });
    // const datas = await getListData({ searchParams });
    
    // await searchParams.delete('category_ids');
    const data = await getWidgetData<HomeLeapType>({
        slug: 'entertainment-info'
    });
    return <EnterTainmentContentTwo data={data} datas={datas} />;
}