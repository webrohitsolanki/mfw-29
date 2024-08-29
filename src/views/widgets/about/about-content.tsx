'use client';

import React from 'react';
import { Image } from '@akinon/next/components/image';
import Style from './about-content.module.css';

export default function AboutContent({ data }) {

    return (
        <div>
            <div className={`${Style.about_main_content} container main_container_header`}>
                {data?.attributes?.about_us?.map((item, i) => (
                    <div key={i}>
                        <div className='flex items-center lg:flex-row flex-col-reverse'>
                            <div className=' lg:p-11 w-[80%] h-[400px]'>
                                <iframe width="560" height="315" src={item.value.alt} className={`${Style.about_iframe}`} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" ></iframe>

                                {/* <Image
                                    src={item.kwargs.value.image.url}
                                    width={800}
                                    height={700}
                                    alt=""
                                    className={`${Style.about_main_content_image_1} rounded-xl`}
                                /> */}
                            </div>
                            <div>
                                <h2 className={`${Style.about_main_content_text}`}><i>{item.value.text}</i></h2>
                            </div>
                        </div>
                        <div className={`${Style.about_content} lg:mx-9 lg:my-5 rounded-xl`} dangerouslySetInnerHTML={{ __html: item.value.about_us_subtext }}>
                        </div>
                        {/* <About */}
                    </div>
                ))}
                {/* <AboutECommerce dataEcommerce={data} /> */}

            </div>
        </div>
    );
}
