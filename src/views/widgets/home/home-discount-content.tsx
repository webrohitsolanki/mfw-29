'use client';

import React from 'react';
import { Link } from '@theme/components';
import Styled from 'styled-components';
import { Image } from '@akinon/next/components/image';

export default function HomeDiscountContent({ data }) {

    return (
        <Wrapper>
            <div className='container container_mx relative home_discount_container   flex gap-5'>
                <div className="branch_leaf">
                    <Image
                        src={'/images/home/branch-leaf.png'}
                        width={10}
                        height={10}
                        alt={""}
                    />
                </div>

                {data?.attributes?.home_banner?.map((item, i) => (
                    <div
                        className='w-full' 
                        key={i}
                    >
                        <div className='home_advertisment_image' >
                            <Image
                                src={item.kwargs.value.image.url}
                                width={300}
                                height={300}
                                alt={""}
                                unoptimized
                                className='home_advertisment_image'
                            />
                        </div>
                    </div>
                ))}
            </div>
        </Wrapper>
    );
}

const Wrapper = Styled.section`
  .home_advertisment_image{
    width:100% !important;
    height:100% !important;
    border-radius: 30px !important;
  }
  .home_advertisment_image img{
    border-radius: 10px !important;

  }
  .home_discount_container{
    margin-top:100px;
  }
  .home_discount{
    width:50%;
  }
  .branch_leaf{
    position:absolute;
    top: 69px;
    right: -80px;
  }
  @media screen and (max-width:768px){
    .home_discount_container{
        flex-direction:column;
        gap:10px;
    }
    .home_discount img{
        margin:0;
    }
    .home_advertisment_image {
        margin:0;
    }
    .home_advertisment_content h1 {
    font-size: 40px;
  }
  }
  @media screen and (max-width:2400px) and (min-width:1300px) {
    .branch_leaf{
        top: 82px;
        right: -59px;
        width:150px;
    }
    /* .home_dress{
        width:20px;
        bottom:-20px;
    } */
}
`