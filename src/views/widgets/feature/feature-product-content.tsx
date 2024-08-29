'use client';

import React, { useEffect, useState } from 'react';
import { CarouselCore } from '@theme/components/carousel-core';
import { Link } from '@theme/components';
import Styled from 'styled-components';
import { Image } from '@akinon/next/components/image';
import { useSearchParams } from 'next/dist/client/components/navigation';
import convertFacetSearchParams from '@theme/utils/convert-facet-search-params';
import { useAppSelector } from '@akinon/next/redux/hooks';
import { usePathname } from 'next/navigation';
import { getListData } from '@akinon/next/data/server';
import { Category, GetCategoryResponse } from '@akinon/next/types';
// import { pushProductClicked, pushProductListProductViewed } from '@theme/utils/gtm';
import { useInView } from 'react-intersection-observer';
import { ProductItem } from '@theme/views/product-item';
import { ProductMobileItem } from '@theme/views/product-item/index-mobile';

interface ListPageProps {
  data: GetCategoryResponse;
}

export default function FeatureComponent(props: ListPageProps) {
  const { data } = props;

  const [paginationData, setPaginationData] = useState([...data.products]);
  return (
    <Wrapper>
      <div className='w-11/12 my-5 mx-auto relative'>
        {/* <div className='home_dress'>
          <Image src='images/home/dress.png'
            width={20}
            height={20}
            alt='Dress' />
        </div> */}
        <CarouselCore
          responsive={{
            all: {
              breakpoint: { max: 6000, min: 0 },
              items: 4
            },
            tablet: {
              breakpoint: { max: 1023, min: 0 },
              items: 3
            },
            mobile: {
              breakpoint: { max: 767, min: 0 },
              items: 2
            }
          }}
          className='rounded-1 eng_carousel'
          arrows={true}
          infinite={true}
          // autoPlay={true}
          swipeable={true}
        >
          {paginationData?.map((product, index) => (
            <div className='w-[250px] mx-auto' key={index}>
              {
                <ProductItem
                  key={product.pk}
                  product={product}
                  width={0}
                  height={0}
                  index={index}
                />
              }
            </div>
          ))}
        </CarouselCore>
      </div>
    </Wrapper >
  );
}

const Wrapper = Styled.section`

`
