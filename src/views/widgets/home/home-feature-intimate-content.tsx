'use client';

import React from 'react';
import { Link } from '@theme/components';
import Styled from 'styled-components';
import FeatureComponent from '@theme/views/widgets/feature/feature-product-content';
// import FeaturePage from '@theme/app/[commerce]/[locale]/[currency]/feature/page'
import { GetCategoryResponse } from '@akinon/next/types';
import FeatureMobileComponent from '../feature/feature-product-content-mobile';
import RecommendationContent from './reccomendation';

export default function HomeFeatureIntimateContent({
  data,
  backgroundColor,
  children,
  widgetData
}: {
  backgroundColor: string;
  widgetData: any;
  data: GetCategoryResponse;
  children?: React.ReactNode;
}) {
  return (
    <Wrapper className="mx_container" style={{ backgroundColor }}>
      {widgetData?.attributes?.home_feature_intimate?.map((item, index) => (
        <div key={index}>
          <div className="flex justify-center text-base pt-5 lg:text-2xl mt-3 font-bold uppercase">
            <h2>{item.value.text}</h2>
          </div>
        </div>
      ))}
      <div>
        <RecommendationContent data={data} backgroundColor="" />
      </div>
      {/* <div className="lg:hidden block">
        <FeatureMobileComponent data={data} />
      </div> */}
    </Wrapper>
  );
}

const Wrapper = Styled.section`
    background-color:#FDF0F6;
    border-radius:10px;
    /* padding:10px; */
    margin-bottom:20px;

  .home_slider_feature{
    font-size:26px;
    font-family: Georgia, Regular !important;
    display: flex;
    justify-content: center;
  }
  .home_slider_feature h2{
    text-wrap:wrap;
    width:350px;
    margin-top:10px;
    text-align:center;
  }
  .react-multiple-carousel__arrow--left  {
   left: calc(-5% + 1px) !important;
   background-color:#003744 !important;
 }
 .react-multiple-carousel__arrow--right  {
   right: calc(-5% + 1px) !important;
   background-color:#003744 !important;
 }
  @media screen and (max-width:768px){
    .home_slider_feature h2{
      width:200px;
    }
    .feature_desktop{
      display:none;
    }
    .home_slider_feature{
      font-size:18px !important;
    }
  }
`;
