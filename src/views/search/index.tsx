'use client';

import { useEffect, useState } from 'react';
import {
  pushProductViewed,
  pushProductListProductViewed
} from '@theme/utils/gtm';
import { useInView } from 'react-intersection-observer';
import useFavButton from '../../hooks/use-fav-button';
import { Product } from '@akinon/next/types';
import { Image } from '@akinon/next/components/image';
import { Price, Link } from '@theme/components';
import Styled from 'styled-components'
import Style from './search.module.css'

interface Props {
  product: Product;
  width?: number;
  height?: number;
  index: number;
}

export const ProductItem = (props: Props) => {

  // TODO: Static image will change (TR)
  const { product, width, height, index } = props;
  const [viewed, setViewed] = useState(false);
  const { FavButton } = useFavButton(product.pk);
  const { ref, inView } = useInView();

  const image_url = product.productimage_set[0]?.image;
  const absolute_url = product.absolute_url;
  const product_name = product.name;
  const retail_price = product.retail_price;
  const price = product.price;

  useEffect(() => {
    if (!viewed && inView) {
      setViewed(true);
      pushProductListProductViewed(product);
    }
  }, [inView]);

  return (
    <Wrapper>
      <div
        className='search_product_content text-sm text-left flex mx-24 items-center h-full'
        data-testid="product-box"
        ref={ref}
      >
        <div className="flex mb-3 ">
          <Link href={absolute_url} onClick={() => pushProductViewed(product)}>
            {image_url ? (
              <Image
                fill
                loading="lazy"
                src={image_url}
                alt={product_name}
                className='search_image'
                aspectRatio={1 / 2}
                sizes="
                  (max-width: 768px) 50vw,
                  (max-width: 1024px) 30vw,
                  33vw"
                crop="center"
              />
            ) : (
              <Image
                className='search_image'
                src="/noimage.jpg"
                fill
                aspectRatio={1 / 2}
                sizes="100vw"
                alt={product_name}
                imageClassName="object-cover"
              />
            )}
          </Link>
          {/* <FavButton className="absolute top-4 right-4" /> */}
        </div>
        <div className='flex justify-between w-full px-10'>
          <Link
            href={absolute_url}
            className='listing_text text-base'
            data-testid={`${product_name}-${index}`}
            onClick={() => pushProductViewed(product)}
          >
            {product_name}
          </Link>
          <div className="font-semibold mt-1">
            {parseFloat(retail_price) > parseFloat(price) && (
              <Price
                value={retail_price}
                className="font-normal line-through mr-3"
              />
            )}
            <Price value={price} data-testid="product-price" className='listing_text' />
            {/* <button className='pinkbtn w-full font-normal uppercase py-5 rounded-none'>Buy Now</button>
            <button className='bluebtn mt-1 font-normal flex justify-center items-center w-full uppercase rounded-none'><Image width={20} className='w-[15px] h-[15px] p-[1px] mr-1' height={20} src={'images/listing/add-to-cart.svg'} alt='' />Add to cart</button> */}
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = Styled.section`
  height:100%;
  .search_image{
    width:120px;
    height:120px;
    box-shadow:0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }
  .listing_text{
    color:#003744;
    font-weight:600;
    margin-bottom:5px;
  }
  .bluebtn{
    padding:16px 0;
  }
  .search_product_content{
    border-top: 1px solid #E987B4;
    border-bottom: 1px solid #E987B4;
    padding:20px 0
}
`
