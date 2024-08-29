'use client';

import React from 'react';
import { CarouselCore } from '@theme/components/carousel-core';
import { Link } from '@theme/components';
import Styled from 'styled-components';
import { Image } from '@akinon/next/components/image';
import Title from './title';
import { Parallax, Background } from 'react-parallax';
import ParallaxRender from './parallax';

export default function HomePartnersContent({ data }) {
  return (
    <Wrapper>
      <ParallaxRender backgroundColor="#efefef">
        <div className="lg:mt-20 mt-5 bg-[#fff] relative container rounded-[20px]  md_container mx-auto">
          <Title title={'Our Strategic Partners'} />
          <div className="relative">
            {/* <Image src={"images/home/rectangle-left.png"} className='rectanagle_left' width={100} height={100} alt='' />
                    <Image src={"images/home/rectangle-right.png"} className='rectanagle_right' width={100} height={100} alt='' /> */}
            <CarouselCore
              responsive={{
                all: {
                  breakpoint: { max: 7000, min: 0 },
                  items: 5
                },
                table: {
                  breakpoint: { max: 1023, min: 0 },
                  items: 3
                },
                mobile: {
                  breakpoint: { max: 767, min: 0 },
                  items: 1
                }
              }}
              className="eng_carousel"
              infinite={true}
              arrows={true}
              swipeable={true}
              autoPlay={true}
            >
              {data?.attributes?.home_partners?.map((item, i) => {
                return (
                  <div
                    key={i}
                    className="home_hero_slider relative mt-[20px] px-2 "
                  >
                    <div className="home_news_text text-center">
                      <Image
                        src={item.kwargs.value.image.url}
                        width={100}
                        height={100}
                        alt={''}
                        unoptimized
                        className="object-contain"
                      />
                    </div>
                  </div>
                );
              })}
            </CarouselCore>
          </div>
        </div>
      </ParallaxRender>
    </Wrapper>
  );
}

const Wrapper = Styled.section`

  .home_slider_content{
    position:absolute;
    top:50%;
    left:10px;
    transform:translateY(-50%);
  }
  .rectanagle_left{
    position:absolute;
    top:20px;
    left:-50px;
    width:300px;
    height:185px;
    z-index:1;
  }
  .rectanagle_right{
    position:absolute;
    top:20px;
    z-index:1;
    right:-50px;
    width:300px;
    height:185px;
  }
  .react-multi-carousel-item  {
    margin:auto 0 !important;
  }
  /* .react-multi-carousel-track {
    gap:10px;
  } */
  .home_advertisment_image{
    height:150px;
    margin:0 auto;
  }
  .react-multiple-carousel__arrow--left {
    left: calc(-5% + 1px) !important;
    background-color: #003744 !important;
  }
  .react-multiple-carousel__arrow--right {
    right: calc(-5% + 1px) !important;
    background-color: #003744 !important;
  }
  /* .react-multi-carousel-track {
    gap:20px;
  } */
  @media screen and (max-width:768px){
    .rectanagle_left,.rectanagle_right{
        display:none;
    }
    .react-multiple-carousel__arrow{
        min-height:20px;
        min-width:20px;
    }
    .react-multiple-carousel__arrow::before{
        font-size:12px;
    }
    .react-multi-carousel-item  {
        margin:auto;
    }
    .home_advertisment_image{
        width:150px !important;
    }
    /* .home_advertisment_image{
        width:100px !important;
    } */
    /* .home_news_text{
        padding:0 40px;
    } */
  }
`;
