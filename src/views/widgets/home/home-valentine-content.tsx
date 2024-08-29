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
            <div className='container home_advertisment_container p-10'>
                <div className='home_dress'>
                    <Image src='images/home/dress.png'
                        width={20}
                        height={20}
                        alt='Dress' />
                </div>
                <div className='home_flower'>
                    <Image src='images/home/flower.png'
                        width={100}
                        height={100}
                        alt='Dress' />
                </div>
                {data?.attributes?.home_advertisment?.map((item, i) => (
                    <div className=' flex  gap-10 home_advertisment_content_mobile'
                        key={i}
                    >

                        <div className='home_advertisment_image'>
                            <Image
                                src={item.kwargs.value.image.url}
                                width={500}
                                height={500}
                                alt={""}
                            />

                        </div>
                        <div className='home_advertisment_content'>
                            <div  dangerouslySetInnerHTML={{ __html: showFullText || !isMobileView ? item.value.text : `${item.value.text.substring(0, 240)}...` }} />
                            <div className='flex items-center mt-3 gap-3'>
                                {isMobileView &&
                                    <>
                                        {item.value.text.length > 150 &&
                                            <Button className='btn read_more_btn pinkbtn' onClick={toggleText}>
                                                {showFullText ? 'Read Less' : 'Read More'}
                                            </Button>
                                        }
                                    </>
                                }
                                <Button className=' btn pinkbtn'>{item.value.link}<Link href={item.value.url}>Shop Now</Link></Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Wrapper>
    );
}

const Wrapper = Styled.section`
    .home_advertisment_container{
        border: 1px solid #E987B4;
        border-radius:30px;
        position:relative;
        margin-top:50px;
        margin-bottom:20px;
    }
    .home_advertisment_image{
        width:50%;
    }
    .home_advertisment_image img{
        width:100%;
        height:100%;
        border-radius:30px;
    }
    .home_advertisment_content{
        width:50%;
    }
    .home_advertisment_content h1{
        text-transform:uppercase;
        font-size:30px;
        line-height:35px;
        color:#000000;
    }
    .home_advertisment_content p{
        margin-top:10px;
        font-family:DM Sans !important;
    }
    /* .home_dress{
        position:absolute;
        bottom:-20px;
        left:50%;
        transform:translateY(-50%);
    } */
    .home_flower{
        position:absolute;
        top:-30px;
        right:-30px;
    }
    .read_more_btn{
        display:none;
    }
    
    @media screen and (max-width:767px){
        .home_advertisment_content_mobile{
            flex-direction: column-reverse;
        }
        .home_advertisment_content .read_more_btn{
            display:block;
        }
        .home_advertisment_content h1{
            font-size:36px;
        }
        .home_advertisment_image{
            text-align:center;
        }
    }
    @media screen and (max-width:2400px) and (min-width:1300px) {
    .home_flower{
        width: 80px !important;
        height:80px !important;
    }
    /* .home_dress{
        width:20px;
        bottom:-20px;
    } */
}
`