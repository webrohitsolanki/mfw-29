import 'server-only';

import { getWidgetData } from '@akinon/next/data/server';
import { ImageType } from '@akinon/next/types';
import HomeThankYou from './home-thankyou';
import HomeMediaCoverage from './home-media-covergae';
import HomeSubscribe from './home-subscribe';
import HomeTestimonilals from './testimonials';
import HomePartners from './home-partners';
import HomeNews from './home-news';
import HomeHeroSlider from './home-hero-slider';
import HomeStoriesEng from './home-stories-eng';
import HomeSales from './home-sales';
import HomeValentines from './home-valentine';
import HomeLeap from './home-leap';
import HomeProductRecommendationOne from './recommendation/recommendation-one';
import HomePerformance from './home-high-performance';
import HomeProductRecommendationTwo from './recommendation/recommendation-two';
import HomeFinance from './home-finance-plus';
import HomeProductRecommendationThree from './recommendation/recommendation-four';
import HomePower from './home-power-on';
import HomeProductRecommendationFour from './recommendation/recommendation-three';
import HomeSamsung from './home-samsung-endless';
import HomeLucmoWines from './home-lucmo-wines';
import HomeDiscount from './home-exclusive-discount';
import { LoaderSpinner } from '@theme/components';



export default async function FooterCarousel() {

    return (
        <>
            <div>
                <HomeHeroSlider />
            </div>
            <div>
                <HomeStoriesEng />
            </div>
            <div>
                <HomeSales />
            </div>
            <div>
                <HomeValentines />
            </div>
            <div>
                <HomeLeap />
            </div>
            <div>
                <HomeProductRecommendationOne />
            </div>
            <div>
                <HomePerformance />
            </div>
            <div>
                <HomeProductRecommendationThree />
            </div>
            <div>
                <HomePower />
            </div>

            <div>
                <HomeProductRecommendationTwo />
            </div>
            <div>
                <HomeFinance />
            </div>

            <div>
                <HomeProductRecommendationFour />
            </div>
            <div>
                <HomeSamsung />
            </div>
            <div>
                <HomeLucmoWines />
            </div>
            <div>
                <HomeDiscount />
            </div>
            <div>
                <HomeNews />
            </div>
            <div>
                <HomePartners />
            </div>
            <div>
                <HomeTestimonilals />
            </div>
            <div>
                <HomeSubscribe />
            </div>
            <div>
                <HomeMediaCoverage />
            </div>

            <div>
                <HomeThankYou />
            </div>
        </>
    )
}
