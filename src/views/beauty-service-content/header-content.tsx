'use client'
import React, { useState, useEffect } from 'react';
import ListPage from './category-info';
import { LoaderSpinner } from '@akinon/next/components';

export default function BeautyHeaderContent({ data, datas }) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulating data fetch
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    }, []);

    if (isLoading) {
        return <div className='main_container_header mb-5'><LoaderSpinner /></div>;
    }

    return (
        <div className='my-2 container main_container_header'>
            {data.attributes.beauty_wellness_service.map((item, index) => {
                const backgroundImageUrl = item.kwargs.value.image.url;

                return (
                    <div key={index}>
                        <div className="flex justify-center items-center gap-10 bg-contain bg-no-repeat bg-center lg:h-[450px] h-[100px] rounded relative" style={{ backgroundImage: `url(${backgroundImageUrl})` }}>
                        </div>
                        <p className="text-left mb-10 lg:text-base text- container" dangerouslySetInnerHTML={{ __html: item.value.subtext }}></p>
                    </div>
                );
            })}
            <ListPage datas={datas} />
        </div>
    );
}
