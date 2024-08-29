'use client';

import React from 'react';
import { Price } from '@theme/components';
import { useLocalization } from '@akinon/next/hooks';
import { Product } from '@akinon/next/types';
import { Image } from '@akinon/next/components';

export interface PriceProps {
  price: Product['price'];
  retailPrice: Product['retail_price'];
}

const PriceWrapper: React.FC<PriceProps> = ({ price, retailPrice }) => {
  const { t } = useLocalization();

  // Convert prices to floats for comparison
  const floatPrice = parseFloat(price);
  const floatRetailPrice = parseFloat(retailPrice);

  // Determine if retail price should be shown
  const showRetailPrice = floatRetailPrice !== floatPrice;

  return (
    <div className="flex items-center gap-3 justify-center h-full">
      <div className="flex gap-5 w-full items-baseline ">
        <div className="">
          <Price
            value={price}
            className="lg:text-2xl text-base whitespace-nowrap"
            data-testid="price"
          />
        </div>
        {showRetailPrice && (
          <div>
            <Price value={retailPrice} className="text-xs line-through" />
          </div>
        )}

        {/* {showRetailPrice && (
          <div>
            <Price value={price} className="text-base whitespace-nowrap text-gray line-through" />
          </div>
        )} */}
        {showRetailPrice && (
          <div>
            <Image
              width={30}
              height={30}
              src="/images/local/sales.svg"
              className="w-[50px] h-auto "
              alt="Sales"
            />
          </div>
        )}
      </div>

      {/* {showRetailPrice && (
        <div className="flex flex-col items-center w-9 py-0.5 text-xs text-white bg-secondary">
          <span className="font-bold">
            {Math.round(100 - (floatPrice / floatRetailPrice) * 100)}%
          </span>
          <span>{t('product.off')}</span>
        </div>
      )} */}
    </div>
  );
};

export default PriceWrapper;
