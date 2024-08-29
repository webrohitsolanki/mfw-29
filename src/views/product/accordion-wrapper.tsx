'use client';

import { Icon, Link } from '@akinon/next/components';
import { useLocalization } from '@akinon/next/hooks';
import { Accordion } from '@theme/components';
import InstallmentOptions from '@theme/views/installment-options';
import React, { useEffect, useRef, useState } from 'react';
import Share from '@theme/views/share';

export default function AccordionWrapper({ data, deliveryReturn }) {
  // const { t } = useLocalization();
  const [isScrollable, setIsScrollable] = useState(false);
  const contentRef = useRef(null);
  const [currentUrl, setCurrentUrl] = useState(null);

  useEffect(() => {
    // Ensure contentRef.current is defined before accessing scrollHeight
    if (contentRef.current) {
      if (contentRef.current.scrollHeight > 300) {
        setIsScrollable(true);
      } else {
        setIsScrollable(false);
      }
    }
  }, []);

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, [currentUrl]);

  const shareButtonItemProps = {
    iconSize: 18,
    className: 'px-2 py-2 h-10 flex items-center hover:bg-gray-100'
  };

  // const shareToSocialMedia = (platform) => {
  //   let shareUrl = '';

  //   switch (platform) {
  //     case 'pinterest':
  //       shareUrl = `https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}`;
  //       break;
  //     case 'facebook':
  //       shareUrl = `https://www.facebook.com/?url=${encodeURIComponent(window.location.href)}`;
  //       break;
  //     case 'twitter':
  //       shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`;
  //       break;
  //     case 'instagram':
  //       // Instagram does not support direct sharing via URL due to platform restrictions
  //       // You can provide a message guiding users to manually share on Instagram
  //       // alert('Please share manually on Instagram.');
  //       return;
  //     default:
  //       return;
  //   }

  //   window.open(shareUrl, '_blank');
  // };

  if (!data?.product?.attributes?.body) {
    return null;
  }

  const convertToBulletedPoints = (htmlContent) => {
    const regex = /<p[^>]*>(.*?)<\/p>/g;
    const matches = htmlContent.match(regex);

    const bulletedPoints = [];
    let estimatedDeliveryTime = '';

    if (matches) {
      matches.forEach((match) => {
        const content = match.replace(/<[^>]*>/g, '').trim();
        if (content.toLowerCase().includes('estimated delivery time')) {
          estimatedDeliveryTime = content
            .replace('Estimated Delivery Time:', '')
            .trim();
        } else if (content !== '') {
          // Check if content is not empty
          bulletedPoints.push(content);
        }
      });
    }

    return { bulletedPoints, estimatedDeliveryTime };
  };

  const { bulletedPoints, estimatedDeliveryTime } = convertToBulletedPoints(
    data?.product?.attributes?.body
  );

  // Slice the array to separate into two halves
  const halfLength = Math.ceil(bulletedPoints.length / 2);
  const firstHalf = bulletedPoints.slice(0, halfLength);
  const secondHalf = bulletedPoints.slice(halfLength);

  return (
    <div className="flex flex-col items-left products-features py-6">
      {/* <h1
        className="mt-2 pb-2 text-2xl text-left md-mt-0 product-name"
        data-testid="product-name"
      >
        Product Features:
      </h1> */}
      <div
        className={isScrollable ? 'h-[300px] overflow-y-scroll' : ''}
        ref={contentRef}
      >
        <p className="text-left mb-10 lg:text-base text- container" dangerouslySetInnerHTML={{ __html: data?.product?.attributes?.body }}></p>

        {/* <ul>
          {firstHalf?.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
        <ul>
          {secondHalf?.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul> */}
      </div>
      {/* {estimatedDeliveryTime && (
        <div className="mt-4 text-base font-bold p-4">
          Estimated Delivery Time: {estimatedDeliveryTime}
        </div>
      )} */}

      <div className="flex items-center gap-3 text-[#999999]">
        <div>
          <h2 className="text-lg">Share</h2>
        </div>
        <div className="flex gap-2 items-center">
          <Share
            buttonClassName="border-none hover:bg-gray-100"
            items={[
              {
                href: `https://www.facebook.com/sharer/sharer.php?u=https://74c3f8ed9ff54860ace14bc09ecf0f2c.lb.akinoncloud.com/`,
                iconName: 'facebook',
                ...shareButtonItemProps
              },
              {
                href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  currentUrl
                )}${data.product.name}`,
                iconName: 'twitterx',
                ...shareButtonItemProps
              },
              {
                href: `https://api.whatsapp.com/send?text=${
                  data.product.name
                }${encodeURIComponent(' ' + currentUrl)}`,
                iconName: 'whatsapp',
                ...shareButtonItemProps
              }
            ]}
          />
          {/* <Link href='#' >
            <Icon name='pinterest' size={18} />
          </Link>
          <Link href={`https://www.facebook.com/?url=${encodeURIComponent(window.location.href)}`} >
            <Icon name='facebook' size={18} />
          </Link>

          <Link href='#' >
            <Icon name='twitter' size={18} />
          </Link>
          <Link href='#' >
            <Icon name='instagram' size={18} />
          </Link> */}
        </div>
      </div>
    </div>
  );
}
