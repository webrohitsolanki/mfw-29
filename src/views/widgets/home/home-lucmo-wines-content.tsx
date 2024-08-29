'use client';

import React, { useEffect, useState } from 'react';
import { Link } from '@theme/components';
import Styled from 'styled-components';
import { Image } from '@akinon/next/components/image';
import { Button } from '@akinon/next/components';

export default function HomeValentineContent({ data }) {
  const [showFullText, setShowFullText] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 767);
    };

    // Call the handleResize function initially and add event listener
    handleResize();
    window.addEventListener('resize', handleResize);

    // Remove event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleText = () => {
    setShowFullText(!showFullText);
  };

  return (
    <Wrapper>
      <div className="container rounded-[30px] relative mt-[20px] bg-[#F3F3F3] lg:p-10 md:p-10 p-2">
        {data?.attributes?.home_advertisment?.map((item, i) => (
          <div
            className=" flex items-center gap-10 rounded-[30px] relative mt-[20px] bg-[#F3F3F3]"
            key={i}
          >
            <div className=" lg:w-[45%] home_advertisment_content w-full">
              <div
                className="home_lucmo_wines_text"
                dangerouslySetInnerHTML={{
                  __html:
                    showFullText || !isMobileView
                      ? item.value.text
                      : `${item.value.text.substring(0, 135)}...`
                }}
              />
              <div className="flex items-center mt-3 gap-3 mb-3">
                {isMobileView && (
                  <>
                    {item.value.text.length > 150 && (
                      <Button
                        className="btn lg:hidden block pinkbtn"
                        onClick={toggleText}
                      >
                        {showFullText ? 'Read Less' : 'Read More'}
                      </Button>
                    )}
                  </>
                )}
                <Button className="btn pinkbtn">
                  <Link href={item.value.url}>Shop Now</Link>
                </Button>
              </div>
              <div className="lg:w-6/12 w-full text-center lg:mt-0 md:mt-5 lg:absolute lg:pr-[30px] top-[-20px] right-0">
                <Image
                  src={item.kwargs.value.image.url}
                  width={500}
                  height={500}
                  alt={''}
                  style={{ borderRadius: '30px' }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Wrapper>
  );
}

const Wrapper = Styled.section`

    .home_advertisment_content h1{
        font-size:30px;
        text-transform:uppercase;
        /* line-height:50px; */
        color:#000000;
    }
    .home_advertisment_content p{
        margin-top:10px;
        font-family:DM Sans !important;

    }


    @media screen and (max-width:767px){
        .home_advertisment_content .read_more_btn{
            display:block;
        }
        .home_advertisment_content h1{
            font-size:36px ;
        }

        .home_lucmo_wines_text h1{
            text-transform:uppercase;
            font-size:22px !important;
        }
    }
`;
