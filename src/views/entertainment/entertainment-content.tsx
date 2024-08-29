'use client'
import React, { useEffect, useState } from 'react';
import { LoaderSpinner } from '@akinon/next/components';
import Style from './index.module.css'
import ListPage from './category-info';

export default function EnterTainmentContentTwo({ data, datas }) {
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
        <div className='my-10 container main_container_header'>
            {/* {data.attributes.products.map((item, index) => { */}
            {/* // const backgroundImageUrl = item.kwargs.value.image.url; */}

            <>
                <ListPage datas={datas} />
            </>
            {/* })} */}
        </div>
    );
}
