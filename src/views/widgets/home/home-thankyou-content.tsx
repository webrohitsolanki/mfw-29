'use client';

import React, { useEffect } from 'react';
import { Icon, Link } from '@theme/components';
import Styled from 'styled-components';
import { Image } from '@akinon/next/components/image';
import { Background, Parallax } from 'react-parallax';
import ParallaxRender from './parallax';

export default function HomeThankYouContent({ data }) {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  return (
    <div>
      {/* <ParallaxRender backgroundColor="#efefef"> */}
      {data?.attributes?.home_thankyou?.map((item, i) => (
        <div
          className="home_subscribe_content flex justify-center items-center mt-[30px] lg:mt-[70px] w-full h-full"
          key={i}
        >
          <div
            className="thankyou_image bg-center	bg-no-repeat bg-cover md:h-[390px] h-[200px] lg:h-screen w-full relative"
            style={{
              backgroundImage: `url(${item.kwargs.value.image.url})`,
              backgroundSize: 'cover'
            }}
          >
            <div className="home_thankyou_text px-[30px] h-full rounded text-center text-white flex justify-center flex-col items-center w-full">
              <div className="home_thankyou_suncontent p-[30px] rounded border-2 border-[#F8ECD9]">
                <h2 className="text-[55px] m-0">{item.value.text}</h2>
                <h3 className="font-thin text-[30px] m-0">
                  {item.value.subtext}
                </h3>
              </div>
            </div>
          </div>
        </div>
      ))}
      {/* <div className='footer_icon_main' onClick={scrollToTop}><Icon name='chevron-up' size={18} /></div> */}
      {/* </ParallaxRender> */}
    </div>
  );
}

const Wrapper = Styled.section`
    /* position:relative; */
    /* .home_subscribe_content {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 70px;
        width: 100%;
        height: 100%;
    } */

    /* .thankyou_image {
        width: 100%;
        height: 100vh;
        background-size: cover;
        background-position: center;
        position: relative;
    } */
/* .home_thankyou_suncontent{
    padding:30px;
    border-radius:10px;
    border: 2px solid #F8ECD9;
}
    .home_thankyou_text {
        padding: 0 30px;
        border-radius: 10px;
        text-align: center;
        color: #fff;
        display:flex;
        flex-direction:column;
        align-items:Center;
        height:100%;
        justify-content:center;
    }

    .home_thankyou_text h3 {
        font-weight: 300;
        font-size: 30px;
        margin: 0;
    }

    .home_thankyou_text h2 {
        font-size: 55px;
        margin: 0;
    } */
`;
