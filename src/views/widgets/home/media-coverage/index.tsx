'use client';

import React, { useEffect, useState } from 'react';
import Style from './index.module.css';
import FooterSubscriptionForm from '@theme/widgets/footer-subscription/footer-subscription-form';
import { Image } from '@akinon/next/components';
import { CarouselCore } from '@theme/components/carousel-core';
import { Background, Parallax } from 'react-parallax';
import styled from 'styled-components';
import ParallaxRender from '../parallax';

export default function HomeMediaContent({ data }) {
  const [selectedMedia, setSelectedMedia] = useState(
    data.attributes.media_coverage[0].value
  );

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 6
    },
    tablet: {
      breakpoint: { max: 1024, min: 768 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 767, min: 0 },
      items: 1
    }
  };

  const handleItemClick = (item) => {
    setSelectedMedia(item.value);
  };

  return (
    <Wrapper className="lg:mb-0 mt-[50px]">
      <ParallaxRender backgroundColor="">
        <div className="container container_mx">
          <div className={`relative rounded-lg`}>
            {/* <div className={`${Style.home_dress}`}>
              <Image
                src="images/home/dress.png"
                width={10}
                height={10}
                alt="Dress"
              />
            </div> */}
            <div className="title_all mb-3">Media Coverage</div>
            <div className="lg:block hidden">
              <div className="flex lg:flex-row flex-col items-center gap-5 justify-between h-[400px]">
                {/* <div className={`${Style.grid_media}`}> */}

                {/* {data?.attributes?.media_coverage?.[0]((item, i) => (
                                <div key={i} className={`${Style.home_media_content}`}>
                                    <p className={`${Style.home_media_text}`}>{item.value.text}</p>
                                    <iframe width="560" height="315" src={item.value.subtext} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" ></iframe>
                                </div>
                            ))} */}
                <div className="lg:w-8/12 w-full h-[400px]">
                  <iframe
                    width="100%"
                    className={`w-full h-full rounded-lg`}
                    height="315"
                    src={selectedMedia?.subtext}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  ></iframe>
                  <p>{selectedMedia?.text}</p>
                </div>
                <div
                  className={`lg:h-[400px] h-[200px] lg:block flex lg:w-4/12 w-full lg:overflow-y-scroll overflow-x-scroll ${Style.home_media_overflow_content}`}
                >
                  {data?.attributes?.media_coverage?.map((item, i) => (
                    <div
                      key={i}
                      className={`${Style.home_media_content} select-none relative`}
                      onClick={() => handleItemClick(item)}
                    >
                      <div className="absolute top-0 bottom-0 left-0 right-0"></div>
                      <p className={`${Style.home_media_text}`}>
                        {item.value.text}
                      </p>
                      <iframe
                        width="560"
                        height="315"
                        src={item.value.subtext}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      ></iframe>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className={`${Style.grid_media_mobile}`}>
              <CarouselCore
                responsive={responsive}
                // pagination={true}
                arrows={false}
                // swipeable={true}
                draggable={true}
                infinite={true}
                // showDots={true}
                showDots={true}
                renderDotsOutside={false}
                dotListClass="bottom-0"
                className="w-full bg-white pb-4"
              >
                {data?.attributes?.media_coverage?.map((item, i) => (
                  <div key={i} className={`${Style.home_media_content}`}>
                    <p className={`${Style.home_media_text}`}>
                      {item.value.text}
                    </p>
                    <iframe
                      width="560"
                      height="315"
                      src={item.value.subtext}
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    ></iframe>
                  </div>
                ))}
              </CarouselCore>
            </div>
          </div>
        </div>
      </ParallaxRender>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  @media (max-width: 768px) {
    .react-multi-carousel-dot button {
      width: 8px !important;
      height: 8px !important;
    }
    .react-multi-carousel-dot--active button {
      width: 24px !important;
    }
  }
`;
