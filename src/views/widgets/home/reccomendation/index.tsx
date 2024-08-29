'use client';

import React from 'react';
import { CarouselCore } from '@theme/components/carousel-core';
import { ProductItem } from './product-item';
import { Icon } from '@theme/components';
import { useRef } from 'react';
import Style from './index.module.css';
import Styled from 'styled-components';
import { Image, LoaderSpinner } from '@akinon/next/components';
import { useMediaQuery } from '@akinon/next/hooks';

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4
  },
  tablet: {
    breakpoint: { max: 1023, min: 768 },
    items: 3
  },
  mobile: {
    breakpoint: { max: 767, min: 0 },
    items: 2
  }
};

export default function RecommendationContent({ data, backgroundColor }) {
  const carouselRef = useRef(null);
  const isMobie = useMediaQuery('(max-width: 768px)');

  const goToPrev = () => {
    carouselRef.current.previous();
  };

  const goToNext = () => {
    carouselRef.current.next();
  };

  return (
    <>
      <Wrapper className=" ">
        {/* <div className='home_dress'>
          <Image src='images/home/dress.png'
            width={20}
            height={20}
            alt='Dress' />
            </div> */}
        {data?.products && (
          <div className="container">
            <div
              className={` lg:my-4 my-2 relative pb-4 pt-5 mb-3 ${Style.recommendation_content}`}
              style={{ backgroundColor }}
            >
              <Image
                width={100}
                height={100}
                alt="Leaf Banner"
                className="leaf_banner_three absolute"
                src="/images/local/leaf-three.png"
              />

              {data?.attributes?.title?.value && (
                <div
                  className={`text-2xl text-secondary ${Style.home_slider_feature} font-bold lg:mb-2`}
                >
                  <h2>{data?.attributes?.title.value}</h2>
                </div>
              )}
              <div className="flex items-center relative lg:px-0 ">
                <div className="justify-center items-center ">
                  <div
                    onClick={goToPrev}
                    className="flex justify-center items-center cursor-pointer icon_main_feature relative rounded-full lg:size-9 size-5 mx-1 bg-[#003744]"
                  >
                    <Icon
                      name="chevron-start"
                      size={isMobie ? 10 : 18}
                      className="fill-[#FFFFFF] text-white"
                    />
                  </div>
                </div>

                <div className="w-full overflow-hidden">
                  <CarouselCore
                    ref={carouselRef}
                    swipeable={true}
                    responsive={responsive}
                    arrows={false}
                    showDots={false}
                    autoPlay={true}
                    infinite={true}
                    // renderDotsOutside={true}
                    itemClass=""
                  >
                    {data?.products?.map((product, index) => (
                      <div
                        key={product.pk}
                        className="h-full mr-[5px] pt-[2px]"
                      >
                        <ProductItem
                          product={product}
                          width={0}
                          height={0}
                          index={index}
                        />
                      </div>
                    ))}
                  </CarouselCore>
                </div>
                <div className="justify-center  items-center z-10">
                  <div
                    onClick={goToNext}
                    className="flex justify-center items-center cursor-pointer bg-[#003744] icon_main_feature relative mx-1 rounded-full lg:size-9 size-5"
                  >
                    <Icon
                      name="chevron-end"
                      size={isMobie ? 10 : 18}
                      className="fill-[#FFFFFF] text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Wrapper>
    </>
  );
}
const Wrapper = Styled.section`
/* z-index:-1; */
.leaf_banner_three{
    position: absolute;
    left: -50px;
    bottom:-170px;
    z-index: 1;
    width: 103px;
    height: 247px;
}
.react-multi-carousel-dot-list {
  bottom:-30px !important;
}
@media screen and (max-width:768px) {
    .leaf_banner_three{
      display:none ;
    }
}
@media screen and (min-width:1024px) and (max-width:1133px) {
    .reccomendation_container{
      width:210px;
    }
}
`;
