'use client';

import React from 'react';
import { Link } from '@theme/components';
import Styled from 'styled-components';
import { Image } from '@akinon/next/components/image';

export default function HomeLeapContent({ data }) {
    return (
        <Wrapper>
            <div className='container  relative'>
                <Image width={100} height={100} alt='Leaf Banner' className='leaf_banner_two' src='/images/local/leaf-two.png' />
                {data?.attributes?.home_banner?.map((item, i) => (
                    <div
                        key={i}
                    >
                        <div className='home_advertisment_image'>
                            <Link href={item.value.url}>
                                <Image
                                    src={item.kwargs.value.image.url}
                                    width={900}
                                    height={700}
                                    alt={""}
                                    className='w-full h-full'
                                />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </Wrapper>
    );
}

const Wrapper = Styled.section`

.leaf_banner_two{
    position: absolute;
    right: -46px;
    z-index: -1;
    display:none;
    width: 103px;
    height: 247px;
}
  .home_advertisment_image{
    width:100% !important;
    height:100% !important;
    margin:40px 0;
  }
  .home_advertisment_image img{
    border-radius: 10px;
  }
  @media screen and (max-width:768px){
    .leaf_banner_three,.leaf_banner_two{
        display:none
    }
    .home_advertisment_image {
        margin: 10px 0;
    }
  }
`
