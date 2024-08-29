'use client';

import React from 'react';
import { Link } from '@theme/components';
import Style from './index.module.css';
import { Image } from '@akinon/next/components/image';
import { CarouselCore } from '@theme/components/carousel-core';
import Styled from 'styled-components';
import { SkeletonSlider } from '@theme/components/skeleton-home/skeleton-profile';
import { useMediaQuery } from '@akinon/next/hooks';

export default function HomeengStories({ data }) {
  const isMobie = useMediaQuery('(max-width: 768px)');

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 6
    },
    tablet: {
      breakpoint: { max: 1023, min: 768 },
      items: 4
    },
    mobile: {
      breakpoint: { max: 767, min: 0 },
      items: 3
    }
  };

  return (
    <Wrapper className='mb-10'>
      {!data ? (
        <SkeletonSlider />
      ) : (
        <div className="container container_mx">
          <div className="title_all explore_department mt-10 pb-5">
            EXPLORE OUR DEPARTMENTS
          </div>
          <div className="lg:mx-10 lg:pb-10 px-2 relative">
            <CarouselCore
              arrows={true}
              infinite={true}
              autoPlay={true}
              responsive={responsive}
              showDots={isMobie ? true : false}
              renderDotsOutside={true}
              swipeable={true}
              className="w-full bg-white eng_carousel"
            >
              {data?.attributes?.stories?.map((story, index) => {
                return (
                  <div
                    className="flex-shrink-0 lg:w-32 w-20 text-center mx-auto"
                    key={`story__${index}`}
                  >
                    <Link
                      href={story?.value?.url}
                      aria-label={story?.value?.alt}
                    >
                      <Image
                        src={story?.kwargs?.value?.image?.url}
                        alt={story?.value?.alt}
                        aspectRatio={1}
                        sizes="(max-width: 768px) 112px, 140px"
                        imageClassName="rounded-full mb-2"
                        fill
                      />
                    </Link>

                    <Link
                      href={story?.value?.url}
                      className="block text-center explore_content text-base font-bold mt-3"
                      aria-label={story?.value?.alt}
                    >
                      {story?.value?.alt}
                    </Link>
                  </div>
                );
              })}
            </CarouselCore>
          </div>
        </div>
      )}
    </Wrapper>
  );
}

const Wrapper = Styled.section`
.react-multiple-carousel__arrow--left  {
   left: -40px
 }
 .react-multiple-carousel__arrow--right  {
   right: -40px;
 }
.react-multi-carousel-dot-list {
  bottom:-20px !important;
}
`;
