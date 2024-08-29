'use client';

import { useEffect, useState } from 'react';
import {
  pushAddToCart,
  // pushProductClicked,
  pushProductListProductViewed
} from '@theme/utils/gtm';
import { useInView } from 'react-intersection-observer';
import useFavButton from '../../hooks/use-fav-button';
import { Product } from '@akinon/next/types';
import { Image } from '@akinon/next/components/image';
import { Price, Link } from '@theme/components';
import Styled from 'styled-components';
import { useAddProductToBasket } from '@theme/hooks';
import { useAddStockAlertMutation } from '@akinon/next/data/client/wishlist';
import { Button, Icon, Modal } from '@akinon/next/components';
import { useLocalization, useMediaQuery, useRouter } from '@akinon/next/hooks';
// import { getCookies } from 'cookies-next';
import { useSession } from 'next-auth/react';
import { ROUTES } from 'routes';
import { useAppDispatch } from '@akinon/next/redux/hooks';
import { api } from '@akinon/next/data/client/api';

interface Props {
  product: Product;
  width?: number;
  height?: number;
  index: number;
}

export const ProductItem = (props: Props) => {
  const [showPopup, setShowPopup] = useState(false);
  const { product, width, height, index } = props;
  const dispatch = useAppDispatch();
  const { t } = useLocalization();
  const [viewed, setViewed] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { FavButton } = useFavButton(product.pk);
  const { ref, inView } = useInView();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productError, setProductError] = useState(null);
  const [addProductToCart, { isLoading: isAddToCartLoading }] =
    useAddProductToBasket();
  const [addStockAlert, { isLoading: isAddToStockAlertLoading }] =
    useAddStockAlertMutation();
  const { status } = useSession();
  const router = useRouter();
  const [isAddingToCart, setIsAddingToCart] = useState(true);

  const image_url = product.productimage_set[0]?.image;
  const absolute_url = product.absolute_url;
  const product_name = product.name;
  const retail_price = product.retail_price;
  const price = product.price;

  const isMobile = useMediaQuery('(max-width: 768px)');


  useEffect(() => {
    if (!viewed && inView) {
      setViewed(true);
      pushProductListProductViewed(product);
    }
  }, [inView, status]);

  const handleAddToCart = async () => {
    setShowPopup(true);
    // pushProductClicked(product);
    setSelectedProduct(product);
    try {
      await addProductToCart({
        product: product.pk,
        quantity: 1,
        attributes: {}
      });

      pushAddToCart(product);
      setShowPopup(true);
      setIsModalOpen(true);
    } catch (error) {
      setProductError(
        error?.data?.non_field_errors ||
          Object.keys(error?.data).map(
            (key) => `${key}: ${error?.data[key].join(', ')}`
          )
      );
    }
  };

  const handleAddToCart1 = async () => {
    setShowPopup(true);
    // pushProductClicked(product);
    setSelectedProduct(product);
    try {
      await addProductToCart({
        product: product.pk,
        quantity: 1,
        attributes: {}
      });

      pushAddToCart(product);
      // setShowPopup(true);
      // setIsModalOpen(true);
    } catch (error) {
      setProductError(
        error?.data?.non_field_errors ||
          Object.keys(error?.data).map(
            (key) => `${key}: ${error?.data[key].join(', ')}`
          )
      );
    }
  };

  const handleModalClick = () => {
    setIsModalOpen(false);
  };

  // const handleBuyNow = () => {
  //   if (status === 'authenticated') {
  //     router.push(`/orders/checkout?productId=${product.pk}`);
  //   } else {
  //     // Handle if token is not present, maybe redirect to login page
  //     router.push('/account');
  //   }
  // };
  const handleBuyNow = () => {
    if (status === 'authenticated') {
      router.push(`/orders/checkout?productId=${product.pk}`);
      handleAddToCart1();
    } else if (status === 'unauthenticated') {
      router.replace(ROUTES.CHECKOUT + `?callbackUrl=${ROUTES.CHECKOUT}`);
      handleAddToCart1();
    }
  };

  useEffect(() => {}, [status, product.pk]);

  const onClickBuyNow = () => {
    handleBuyNow();
  };

  useEffect(() => {
    let timer;
    if (showPopup) {
      timer = setTimeout(() => {
        setShowPopup(false);
      }, 2000); // 10 seconds
    }
    return () => clearTimeout(timer);
  }, [showPopup]);

  return (
    <Wrapper>
      <div
        className="text-sm text-left relative flex flex-col "
        data-testid="product-box"
        ref={ref}
      >
        {parseFloat(price) < parseFloat(retail_price) && (
          <div className="absolute top-0 left-0 z-10 h-[270px]">
            <Image
              width={30}
              height={30}
              src="/images/local/sales.svg"
              className="w-[50px] h-auto"
              alt="Sales"
            />
          </div>
        )}
        {/* h-[270px] */}
        <div
          className="relative mb-3 border-pink-400 text-center aspect-square"
          style={{ aspectRatio: 1 }}
        >
          <Link href={absolute_url}
          // onClick={() => pushProductClicked(product)}
          >
            {image_url ? (
              <Image
                // fill
                loading="lazy"
                src={image_url}
                className="w-full product_single_image h-full"
                alt={product_name}
                width={100}
                imageClassName="object-contain"
                height={100}
                layout="responsive"
                style={{ aspectRatio: 1 }}
              />
            ) : (
              <Image
                className="h-full"
                src="/noimage.jpg"
                width={100}
                height={100}
                // fill
                // sizes="100vw"
                alt={product_name}
                imageClassName="object-cover"
              />
            )}
          </Link>
          {/* <FavButton className="absolute top-4 lg:right-4 right-2" /> */}
        </div>
        <div title={product_name}>
          <Link
            href={absolute_url}
            className={`listing_text product_title lg:text-base line-clamp-1`}
            data-testid={`${product_name}-${index}`}
            // onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
            //   pushProductClicked(product);
            // }}
          >
            {product_name}
          </Link>

          <div className="font-semibold mt-1">
            <div className="flex gap-2">
              <span className="w-fit">
                <Price
                  value={`${price}`}
                  data-testid="product-price"
                  className="listing_text product_title lg:text-lg text-xm whitespace-nowrap"
                />
              </span>
              {parseFloat(price) < parseFloat(retail_price) && retail_price && (
                <Price
                  value={retail_price}
                  className="font-normal product_title whitespace-nowrap ms-3 lg:text-base text-[10px] line-through "
                />
              )}
            </div>

            {/* <Button
              className="pinkbtn w-full font-normal uppercase py-5 rounded-none add_to_cart_mobile"
              onClick={handleBuyNow}
            > */}
              {/* <Link href={{ pathname: 'orders/checkout', query: { productId: product.pk } }}> */}
              {/* Buy Now */}
              {/* </Link> */}
            {/* </Button> */}
            {/* <Button
              disabled={isAddToCartLoading || isAddToStockAlertLoading}
              className="bluebtn mt-1 font-normal text-xs flex justify-center items-center w-full uppercase rounded-none add_to_cart_mobile"
              onClick={() => {
                handleAddToCart();
              }}
              data-testid="product-add-to-cart"
            >
              <Image
                width={20}
                className="w-[15px] h-[15px] p-[1px] mr-1"
                height={20}
                src="/images/listing/add-to-cart.svg"
                alt=""
              />
              Add to cart
            </Button> */}

            <div className="flex py-[1px] gap-1">
              <Button
                className="pinkbtn w-full font-normal uppercase py-5 rounded-none add_to_cart_mobile sm:w-3/4 w-[50%]"
                // className="bg-[#003744] text-white text-sm lg:px-4 px-2  mt-1 font-normal flex justify-center items-center sm:w-3/4 w-[50%] uppercase rounded-none add_to_cart_mobile"
                onClick={handleBuyNow}
              >
                {/* <Link href={{ pathname: 'orders/checkout', query: { productId: product.pk } }}> */}
                Buy Now
                {/* </Link> */}
              </Button>

              <FavButton
                className="sm:w-[23%] w-[50%] text-sm bg-[#C475AB] border border-[#C475AB] group/fav justify-center hover:bg-white hover:border-primary hover:text-primary"
                iconClassName={
                  'text-white text-sm lg:text-base group-hover/fav:text-primary'
                }
              />
            </div>

              <Button
                disabled={isAddToCartLoading || isAddToStockAlertLoading}
                className="bg-[#003744] lg:h-10 h-8 text-white text-sm lg:px-4 px-2 gap-2  mt-1 font-normal flex justify-center items-center w-full uppercase rounded-none add_to_cart_mobile"
                // onClick={() => handleAddToCart()}
                onClick={() => {
                  handleAddToCart();
                }}
                data-testid="product-add-to-cart"
              >
                <Icon name="cart" size={isMobile ? 10 : 14} className="sm:mr-2" />
                {/* <Image
                  width={20}
                  className="w-[15px] h-[15px] p-[1px] mr-1"
                  height={20}
                  src="/images/listing/add-to-cart.svg"
                  alt=""
                /> */}
                <span className="inline-block leading-none">Add to cart</span>
              </Button>

            {/* {showPopup && selectedProduct && (
              <div className="popup absolute pop_up border rounded p-4 top-0 right-10">
                <div className='flex gap-2 items-center'>
                  <div>
                    <Image src={selectedProduct.productimage_set[0]?.image || '/noimage.jpg'} width={30} sizes='10vw' height={30} className='popup_image' aspectRatio={1} alt={selectedProduct.name} />
                  </div>
                  <div>
                    <div className="font-semibold text-white">{selectedProduct.name}</div>
                    <div className="font-normal text-white mt-2">Price: ${selectedProduct.price}</div>
                  </div>
                </div>
                <button onClick={() => setShowPopup(false)} className="p-2 popup_view_all w-full py-2 border"><Link href='/baskets/basket'>View All</Link></button>
              </div>
            )} */}
          </div>
        </div>

        <Modal
          portalId="product-add-to-cart"
          open={isModalOpen}
          setOpen={setIsModalOpen}
          showCloseButton={false}
          className="w-5/6 md:max-w-md"
        >
          <div className="flex flex-col items-center justify-center gap-4 px-6 py-9">
            <Icon name="bell" size={48} />
            <h2 className="text-xl font-semibold">
              {/* {isAddingToCart
                ? 'Product Added to Cart'
                : 'Product Added to Cart'} */}
              {isAddingToCart && 'Product successfully added to the cart.' }
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
      </div>
    </Wrapper>
  );
};

const Wrapper = Styled.section`
height:100%;
  .listing_text{
    color:#003744;
    font-weight:600;
    margin-bottom:5px;
    //width:330px;
  }
  .bluebtn{
    padding:16px 0;
  }
  /* .react-multi-carousel-item {
    width:260px;
  } */
  .pop_up {
    background-color: #b27697;
    border-radius: 10px;
    border: 1px solid #b27697;
    position:fixed;
    top:10px;
    z-index:11;
  }
  .popup_image{
    width:75px;
    height:75px;
  }
  .product_single_image{
    width:100% !important;
    /* height:250px !important; */
  }
  .product_single_image img{
    width:100%;
    height:100% !important;
    /* object-fit:contain; */
  }
  .ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: auto;
  display:block;
}

.ellipsis:hover {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: none;
}

  @media screen and (max-width:768px){
    .add_to_cart_mobile{
      font-size:9px !important;
    }
    .listing_text{
      font-size:13px !important;
    }

    .pop_up{
      right:0;
      margin:10px 30px;
    }
    .pinkbtn,.bluebtn{
      padding:5px 7px !important;
      height:30px !important;
      width:100%;
    }
    .popup_image{
      width:120px;
      height:110px;
    }
    .popup_view_all{
      margin-top:10px;
    }
    .product_single_image{
      width:100%;
      height:100%;
    }
  }
`;
