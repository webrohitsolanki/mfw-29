'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { CarouselCore } from '@theme/components/carousel-core';
import { Link, LoaderSpinner } from '@theme/components';
import Style from './home-hero.module.css';
import { Button, Icon, Image, Modal } from '@akinon/next/components';
import styled from 'styled-components';
import { useLocalization } from '@akinon/next/hooks';
import { useRouter } from '@akinon/next/hooks';
import { useSearchParams } from 'next/dist/client/components/navigation';
import { SkeletonSlider } from '@theme/components/skeleton-home/skeleton-profile';
import clsx from 'clsx';

export default function HomeHeroSliderContent({ data }) {
  const [isEditAddressModalOpen, setIsEditAddressModalOpen] = useState(false);
  const [register, setRegister] = useState(false);
  const { t } = useLocalization();
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const successfullParam = params.get('sucess');
    if (successfullParam === 'true') {
      setIsEditAddressModalOpen(true);

      setTimeout(() => {
        setIsEditAddressModalOpen(false);
        router.push('/');
      }, 5000);
    }
  }, [params]);

  useEffect(() => {
    const successfullParam = params.get('register');
    if (successfullParam === 'true') {
      setRegister(true);

      setTimeout(() => {
        setRegister(false);
        router.push('/');
      }, 5000);
    }
  }, [params]);

  const handleModalClick = () => {
    setIsEditAddressModalOpen(false);
    setRegister(false);
  };

  return (
    <Wrapper>
      <Suspense fallback={<SkeletonSlider />}>
        <div className={clsx('relative')}>
          <CarouselCore
            responsive={{
              all: {
                breakpoint: { max: 5000, min: 0 },
                items: 1
              }
            }}
            className="container  container_mx  main_container_header rounded-[20px]"
            arrows={true}
            showDots={true}
            autoPlay={true}
            infinite={true}
            swipeable={true}
            autoPlaySpeed={8000}
          >
            {data?.attributes?.hero_slider?.map((item, i) => (
              <>
                <Link href={item.value.url}>
                  <Image
                    src={item.kwargs.value.image.url}
                    alt="MALL FOR WOMEN"
                    layout="responsive"
                    useMap={`#workmap${i}`}
                    width="500"
                    height="100"
                    className={`rounded-1 w-full ${Style.home_banner_slides}`}
                  />
                  {/* <map name={`workmap${i}`}>
                <area shape="rect" coords={item.value.cords} alt="Computer" href="/list"></area>
              </map> */}
                </Link>
              </>
            ))}
          </CarouselCore>
        </div>
      </Suspense>
      <Modal
        portalId="product-add-to-cart"
        open={isEditAddressModalOpen}
        setOpen={setIsEditAddressModalOpen}
        showCloseButton={false}
        className="w-5/6 md:max-w-md"
      >
        <div className="flex flex-col items-center justify-center gap-4 px-6 py-9">
          <Image
            width={200}
            height={150}
            alt=""
            layout="responsive"
            unoptimized
            className="w-[130px]"
            src="/images/logoMall.svg"
          />
          <h2 className="text-xl font-semibold">Welcome To Mall For Women</h2>
          {/* <div className="max-w-40 text-xs text-center leading-4">
              <p>{stockAlertResponseMessage}</p>
            </div> */}
          <Button
            onClick={handleModalClick}
            appearance="outlined"
            className="font-semibold px-10 h-12 pinkbtn"
          >
            {t('product.stock_alert.close_button')}
          </Button>
        </div>
      </Modal>
      <Modal
        portalId="product-add-to-cart"
        open={register}
        setOpen={setRegister}
        showCloseButton={false}
        className="w-5/6 md:max-w-md"
      >
        <div className="flex flex-col items-center justify-center gap-4 px-6 py-9">
          <Image
            width={200}
            height={150}
            alt=""
            layout="responsive"
            unoptimized
            className="w-[130px]"
            src="/images/logoMall.svg"
          />
          <h2 className="text-xl font-semibold">
            Account successfully created on Mall For Women
          </h2>
          {/* <div className="max-w-40 text-xs text-center leading-4">
              <p>{stockAlertResponseMessage}</p>
            </div> */}
          <Button
            onClick={handleModalClick}
            appearance="outlined"
            className="font-semibold px-10 h-12 pinkbtn"
          >
            {t('product.stock_alert.close_button')}
          </Button>
        </div>
      </Modal>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  .react-multiple-carousel__arrow--left {
    left: 5px !important;
    background: #003744 !important;
    z-index: 10 !important;
  }
  .react-multiple-carousel__arrow--right {
    right: 5px !important;
    background: #003744 !important;
    z-index: 10 !important;
  }
  .react-multi-carousel-dot-list {
    bottom: -25px !important;
  }
  .react-multi-carousel-dot--active {
    border: 0px !important;
  }
  @media screen and (max-width: 768px) {
    .react-multiple-carousel__arrow--left {
      /* left: calc(4% + 1px) !important; */
      background: #003744 !important;
      z-index: 10 !important;
    }
    .react-multiple-carousel__arrow--right {
      /* right: calc(4% + 1px) !important; */
      background: #003744 !important;
      z-index: 10 !important;
    }
  }
`;
