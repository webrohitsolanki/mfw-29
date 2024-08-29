'use client';

import React, { useEffect, useState } from 'react';
import { Image } from '@akinon/next/components/image';
import { Button, Link, LoaderSpinner } from '@akinon/next/components';

export default function LogisticsContent({ data }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulating data fetch
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  if (isLoading) {
    return (
      <div className="main_container_header mb-5">
        <LoaderSpinner />
      </div>
    );
  }
  return (
    <div className="my-10 container container_md main_container_header">
      {data.attributes.fintech_info.map((item, index) => {
        return (
          <div
            className="flex logistics_desc lg:rounded-[30px] rounded-0 items-center border border-[#E987B4] lg:mb-0 mb-5"
            key={index}
          >
            <div className="w-6/12 logistics_desc_mobile  px-9">
              <div className="w-full">
                <div className="flex logistics_desc flex-col items-left">
                  <h1
                    className="mt-4 text-2xl text-left md-mt-0 heading-main heading_main_logistics"
                    data-testid="product-name"
                  >
                    Logistics
                  </h1>
                </div>
                <div
                  className="mt-4 text-1xl text-left md-mt-0 fintech-desc fintech_disc_mobile"
                  dangerouslySetInnerHTML={{ __html: item.value.text }}
                ></div>
                <div className="button-group">
                  <Button
                    className="px-4 text-xs bg-primary text-primary-foreground border border-primary transition-all hover:bg-white hover:border-primary hover:text-primary bottom-0 right-0 w-1/1 h-10 z-[20] flex items-center justify-center fill-primary-foreground hover:fill-primary sm:relative sm\:w-1\/3 sm:mt-3 sm:font-regular greenbtn"
                    data-testid="product-add-to-cart"
                  >
                    <span>
                      <Link href="/contact-us">CONTACT US</Link>
                    </span>
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex w-6/12 flex-col fintech_disc_mobile items-center col-span-2 lg:col-span-1">
              <div className="flex relative items-center w-full">
                <Image
                  src={item.kwargs.value.image.url}
                  alt="payment"
                  width={285}
                  height={27}
                  className="block w-full logistics_image"
                  style={{ height: 'auto', width: '100%' }}
                  // unoptimized
                />
                <div className="dress_digital_left_image">
                  <Image
                    src="images/home/dress.png"
                    width={10}
                    height={10}
                    alt="Dress"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
