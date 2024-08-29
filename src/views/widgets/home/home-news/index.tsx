'use client';

import React, { useEffect, useState } from 'react';
import Style from './home-news.module.css';
import { Link } from '@theme/components';
import { Image } from '@akinon/next/components/image';
import { Button } from '@akinon/next/components';
import { Parallax, Background } from 'react-parallax';

export default function HomeNewsContent({ data }) {
    const [showFullText, setShowFullText] = useState(false);
    const [isMobileView, setIsMobileView] = useState(false);


    // useEffect(() => {
    //     const handleResize = () => {
    //         setIsMobileView(window.innerWidth <= 767);
    //     };
    //     handleResize();
    //     window.addEventListener('resize', handleResize);
    //     return () => window.removeEventListener('resize', handleResize);
    // }, []);

    const toggleText = () => {
        setShowFullText(!showFullText);
    };
    return (
        <div>
            {/* <Parallax
                 strength={200}
                 style={{
                     height: '100vh',
                     display: 'grid',
                     placeItems: 'center',
                     borderTop: '1px solid #efefef'

                 }}>
                 <Background > */}
            <div className={`container sticky top-0 container_mx ${Style.news}`}>
                <div className={`${Style.news_container}`}>
                    <div className='home_dress'>
                        <Image src='images/home/dress.png'
                            width={20}
                            height={20}
                            alt='Dress' />
                    </div>
                    <div className={`${Style.news_content}`}>
                        {/* <div className={`${Style.news_welcome}`}>
                            Welcome to Mall For Women
                        </div> */}
                        <div className={`${Style.news_title}`}>
                            NEWS
                        </div>
                    </div>

                    <div className={`${Style.news_blog}`}>
                        <div>
                            <Image src={'images/logoMall.svg'} className={`${Style.news_blog_image}`} width={100} height={100} alt={""} />
                        </div>
                        <div className={`${Style.news_blog_content}`}>
                            <h2>DISCOVER OUR LATEST BLOG!</h2>
                        </div>
                    </div>
                    {data?.attributes?.home_news?.map((item, i) => (
                        <div className={`${Style.home_discount}`} key={i}>
                            <div className={`${Style.home_news_text}`}>
                                <Image
                                    src={item.kwargs.value.image.url}
                                    width={300}
                                    height={300}
                                    alt=""
                                    unoptimized
                                    className={`${Style.home_advertisment_image}`}
                                />
                                <div
                                    className={`${Style.home_news_title}`}
                                    dangerouslySetInnerHTML={{ __html: item.value.text }}
                                />
                            </div>
                            <div
                                className={`${Style.home_news_para}`}
                                dangerouslySetInnerHTML={{
                                    __html: showFullText
                                        ? item.value.subtext
                                        : `${item.value.subtext.substring(0, 320)}...`
                                }}
                            />

                            <div className={` news_hidden ${Style.news_hidden}`}>
                                <hr className={`${Style.home_top}`} />
                                <hr className={`${Style.home_bottom}`} />
                                <div className='flex items-center justify-center gap-2 w-full'>
                                    {item.value.subtext.length > 135 && (
                                        <div className=''>
                                            <Button
                                                className={`btn pinkbtn ${Style.read_more_btn}`}
                                                onClick={toggleText}
                                            >
                                                {showFullText ? 'READ LESS' : 'READ MORE'}
                                            </Button>
                                        </div>
                                    )}
                                    <div className={`${Style.news_btn} my-3`}>
                                        <Button className='pinkbtn '><Link href='/news-blog'>MORE ARTICLES</Link></Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* </Background>
             </Parallax> */}
        </div >
    );
}
