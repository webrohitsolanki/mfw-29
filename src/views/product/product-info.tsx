'use client';

import clsx from 'clsx';
import { Button, Icon, Modal } from '@theme/components';
import { useAddProductToBasket } from '../../hooks';
import React, { Suspense, useEffect, useState } from 'react';
import {
  useAddFavoriteMutation,
  useAddStockAlertMutation,
  useRemoveFavoriteMutation
} from '@akinon/next/data/client/wishlist';
import {
  pushAddToCart,
  pushAddToWishlist,
  pushProductViewed
} from '@theme/utils/gtm';
import { PriceWrapper, Variant } from '@theme/views/product';
import Share from '@theme/views/share';
import { ProductPageProps } from './layout';
import MiscButtons from './misc-buttons';
import { useLocalization } from '@akinon/next/hooks';
import PluginModule, { Component } from '@akinon/next/components/plugin-module';
import { Trans } from '@akinon/next/components/trans';
import { useSession } from 'next-auth/react';
import { Image } from '@akinon/next/components/image';
import { Link } from '@akinon/next/components';
import PayPalButton from '@theme/components/paypal-button';
import { product } from '@akinon/next/data/urls';
import { useRouter } from '@akinon/next/hooks';
import { ROUTES } from '@theme/routes';
import FavButton from './use-fav-button';
import useFavButton from './use-fav-button';

export default function ProductInfo({ data }: ProductPageProps) {
  const { product } = data;
  const [productPk, setProductPk] = useState(product.pk);
  const { t } = useLocalization();
  const { data: session } = useSession();
  const [currentUrl, setCurrentUrl] = useState(null);
  const [productError, setProductError] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isPushed, setIsPushed] = useState(false);
  const [addFavorite] = useAddFavoriteMutation();
  const [isModalOpenWishlist, setIsModalOpenWishlist] = useState(false);
  const [isModalOpenCart, setIsModalOpenCart] = useState(false);
  const [addToCart, setAddToCart] = useState(false);
  const router = useRouter();
  const { status } = useSession();
  const { FavButton } = useFavButton(productPk);

  const [stockAlertResponseMessage, setStockAlertResponseMessage] =
    useState(null);
  const [addProduct, { isLoading: isAddToCartLoading }] =
    useAddProductToBasket();
  const [addStockAlert, { isLoading: isAddToStockAlertLoading }] =
    useAddStockAlertMutation();
  const [removeFavorite, { isLoading: isRemoveFavoriteLoading }] =
    useRemoveFavoriteMutation();
  const inStock = data.selected_variant !== null || data.product.in_stock;

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, [currentUrl]);

  useEffect(() => {
    pushProductViewed(data?.product);
  }, []);

  const handleClick = async () => {
    try {
      if (status === 'unauthenticated') {
        // Remove from wishlist
        // removeFavorite(data.product.pk);
      } else {
        // Add to wishlist
        await addFavorite(data.product.pk);
        setIsPushed(true);
        setAddToCart(true);
        setIsModalOpenWishlist(true);
      }
    } catch (error) {
      console.error('Failed operation:', error);
    }
  };

  useEffect(() => {
    // Update isActive based on current state of favorite
    setIsActive(Boolean(isPushed));
  }, [isPushed]);

  useEffect(() => {
    // Perform actions when item is successfully added to wishlist
    if (isPushed) {
      pushAddToWishlist(
        // base_code: data?.product?.base_code,
        // name: data?.product?.name,
        // price: data?.product?.price,
        // currency_type: data?.product?.currency_type
        data?.product
      );
      setIsModalOpen(true);
    }
  }, [isPushed]);

  const handleRemoveFromWishlist = async () => {
    try {
      await removeFavorite(data.product.pk);
      setIsActive(false);
      // Optionally, perform additional actions after successful removal from wishlist
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  };

  const addProductToCart = async () => {
    if (!variantsSelectionCheck()) {
      return;
    }

    try {
      await addProduct({
        product: data.product.pk,
        quantity,
        attributes: {}
      });

      pushAddToCart(data?.product);
      // setIsAddingToCart(true);
      setAddToCart(true);
      setIsModalOpenCart(true);
      setQuantity(1);
    } catch (error) {
      setProductError(
        error?.data?.non_field_errors ||
          Object.keys(error?.data).map(
            (key) => `${key}: ${error?.data[key].join(', ')}`
          )
      );
    }
    setIsModalOpen(true);
  };

  const addProductToCart1 = async () => {
    if (!variantsSelectionCheck()) {
      return;
    }

    try {
      await addProduct({
        product: data.product.pk,
        quantity,
        attributes: {}
      });

      pushAddToCart(data?.product);
      // setIsAddingToCart(true);
      setAddToCart(true);
      // setIsModalOpenCart(true);
    } catch (error) {
      setProductError(
        error?.data?.non_field_errors ||
          Object.keys(error?.data).map(
            (key) => `${key}: ${error?.data[key].join(', ')}`
          )
      );
    }
    // setIsModalOpen(true);
  };

  const variantsSelectionCheck = () => {
    const unselectedVariant = data.variants.find((variant) =>
      variant.options.every((opt) => !opt.is_selected)
    );

    if (unselectedVariant) {
      setProductError(() => (
        <Trans
          i18nKey="product.please_select_variant"
          components={{
            VariantName: <span>{unselectedVariant.attribute_name}</span>
          }}
        />
      ));

      return false;
    }

    return true;
  };

  const addProductToStockAlertList = async () => {
    try {
      await addStockAlert({
        productPk: data.product.pk,
        email: session?.user?.email
      })
        .unwrap()
        .then(handleSuccess)
        .catch((err) => handleError(err));
      setIsAddingToCart(false);
      setIsModalOpen(true);

      // TODO: handle success response
    } catch (error) {
      setProductError(error?.data?.non_field_errors || null);
    }
  };

  const handleModalClick = () => {
    setIsModalOpen(false);
    setStockAlertResponseMessage(null);
    setProductError(null);
  };

  const handleSuccess = () => {
    setStockAlertResponseMessage(() => (
      <Trans
        i18nKey="product.stock_alert.success_description"
        components={{
          Email: <span>{session?.user?.email}</span>
        }}
      />
    ));
    setIsModalOpen(true);
  };

  const handleError = (err) => {
    if (err.status !== 401) {
      setStockAlertResponseMessage(
        t('product.stock_alert.error_description').toString()
      );
      setIsModalOpen(true);
    }
  };

  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    // Ensure quantity is a positive integer
    if (!isNaN(newQuantity) && newQuantity > 0) {
      setQuantity(newQuantity);
      setProductError(newQuantity);
    }
  };

  const handleIncrement = () => {
    setQuantity(quantity + 1);
    setProductError(null);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      setProductError(null);
    }
  };

  const handleBuyNow = () => {
    if (status === 'authenticated') {
      router.push(`/orders/checkout?productId=${data.product.pk}`);
    } else if (status === 'unauthenticated') {
      router.replace(ROUTES.CHECKOUT + `?callbackUrl=${ROUTES.CHECKOUT}`);
      addProductToCart1();
    }
  };

  return (
    <>
      <div
        className={clsx(
          'bottom-0 left-0 w-1/2 h-14 z-[20] bg-white mt-0 border-gray-500 items-center justify-left',
          'sm:relative sm:flex sm:items-center w-full sm:mt-2 sm:border-none font-semibold text-[#003744] lg:text-2xl text-base text_price'
        )}
      >
        <PriceWrapper
          price={data.product.price}
          retailPrice={data.product.retail_price}
        />
      </div>
      <div className="bg-[#F3F3F3] my-1 w-fit p-2">
        <p className="lg:text-sm text-[10px]">
          Shipping calculated at checkout.
        </p>
      </div>
      <div className="quantity-main">
        <h3>Quantity:</h3>
        <div className="">
          <div className="flex items-center bottom-0 right-0 w-24 h-10 z-[20] justify-center sm:relative sm:mt-2 sm:font-regular quantity-button">
            <Image
              width={10}
              height={10}
              src="/images/local/decrement.svg"
              className="button_count_image  about_ecommerce_content"
              alt="+"
              onClick={handleDecrement}
            />
            {/* <button onClick={handleDecrement}>-</button> */}
            <input
              type="text"
              value={quantity}
              onChange={handleQuantityChange}
              style={{ width: '40px', textAlign: 'center' }}
            />
            <Image
              width={10}
              height={10}
              src="/images/local/increment.svg"
              className="button_count_image cursor-pointer"
              alt="+"
              onClick={handleIncrement}
            />
          </div>
          {/* <button onClick={handleIncrement}>+</button> */}
        </div>
      </div>

      {/* <div className="lg:flex md:flex items-center gap-3 lg:flex-wrap md:flex-wrap  w-full"> */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full items-center">
        {data.variants
          .filter(
            (variant) =>
              !(
                variant.options.length === 1 &&
                variant.options[0].label === 'NotInUse'
              )
          )
          .map((variant) => (
            <Variant
              key={variant.attribute_key}
              {...variant}
              className="items-center mt-2"
              onChange={() => setProductError(null)}
            />
          ))}
      </div>

      {/* <div className="flex items-center gap-3 flex-wrap mt-5">
        {data.variants.map(
          (variant) =>
            // variant.options[0].label == 'NotInUse' &&
            // variant.options.length == 1 && (
              <>
                <Variant
                  key={variant.attribute_key}
                  {...variant}
                  className="items-center mt-2"
                  onChange={() => setProductError(null)}
                />
              </>
            // )
        )}
      </div> */}
      {/* <div className="flex items-center gap-3 flex-wrap">
        {data.variants.map(
          (variant) =>
            // (variant.options[0].label !== 'NotInUse' &&
            // variant.options.length !== 1 && (
              <>
                <Variant
                  key={variant.attribute_key}
                  {...variant}
                  className="items-center mt-2"
                  onChange={() => setProductError(null)}
                />
              </>
            // )
        )}
      </div> */}
      {/* <div className="selectgroup">
        <div className="selectgroupinner color bottom-0 right-0 justify-center fill-primary-foreground hover:fill-primary sm:relative sm:w-full sm:mt-2 sm:font-regular">
          <h3>Color*</h3>
          <select className="bottom-0 right-0 w-1/2 h-10 z-[20] justify-center sm:relative sm:w-full sm:mt-2 sm:font-regular">
            <option value="someOption">Blue</option>
            <option value="otherOption">Red</option>
          </select>
        </div>
        <div className="selectgroupinner size bottom-0 right-0 justify-center fill-primary-foreground hover:fill-primary sm:relative sm:w-full sm:mt-2 sm:font-regular">
          <h3>Size*</h3>
          <select className='bottom-0 right-0 w-1/2 h-10 z-[20] justify-center sm:relative sm:w-full sm:mt-2 sm:font-regular'>
            <option value="someOption">S</option>
            <option value="otherOption">M</option>
            <option value="otherOption">L</option>
          </select>
        </div>
      </div> */}
      {productError && (
        <div className="mt-4 text-xs text-center text-error">
          {productError}
        </div>
      )}
      {/* <div className="button-group flex items-center gap-3"> */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full items-center">
        <Button
          disabled={isAddToCartLoading || isAddToStockAlertLoading}
          className={clsx(
            'bottom-0 right-0 h-10 z-[20] flex items-center mr-0 justify-center fill-primary-foreground w-full',
            'hover:fill-primary sm:relative sm:mt-3 sm:font-regular greenbtn bluebtn'
          )}
          onClick={() => {
            setProductError(null);
            if (inStock) {
              addProductToCart();
            } else {
              addProductToStockAlertList();
            }
          }}
          data-testid="product-add-to-cart"
        >
          <span>{addToCart ? 'Added To Cart' : 'Add To Cart '}</span>

          {/* {addToCart ? (
              <span>{isActive ? 'Added To Cart' : 'Add To Cart '}</span>
            ) : (
              <>
                <Icon name="bell" size={20} className="mr-4" />
                <span>{t('product.add_stock_alert')}</span>
              </>
            )} */}
        </Button>

        <div
          className="w-full"
          // disabled={isAddToCartLoading || isAddToStockAlertLoading}
          // className={clsx(
          //   'bottom-0 right-0 w-1/2 h-10 z-[20] flex items-center justify-center fill-primary-foreground',
          //   'hover:fill-primary sm:relative sm:w-full sm:mt-3 sm:font-regular pinkbtn'
          // )}
          // onClick={() => {
          //   setProductError(null);
          //   if (inStock) {
          //     handleClick();
          //   } else {
          //     addProductToStockAlertList();
          //   }
          // }}
          // data-testid="whislist-cart"
        >
          <FavButton />
          {/* {inStock ? (
            <span>{isActive ? 'Added To Wishlist' : 'Add To Wishlist '}</span>
          ) : (
            <>
              <Icon name="bell" size={20} className="mr-4" />
              <span>{t('product.add_stock_alert')}</span>
            </>
          )} */}
        </div>
      </div>

      <Button
        className="pdp_payment_button mt-2 lg:py-1 py-0 flex gap-2 justify-center  items-center w-full cursor-pointer text-base"
        onClick={handleBuyNow}
        data-testid="basket-checkout"
      >
        Buy Now
      </Button>
      {/* <PayPalButton /> */}
      {/* <Image src='/images/local/paypal-button.svg' className='pdp_paypal_image' width={10} height={10} alt='PayPal' /> */}
      <p className="more_options">
        More Payment Options
        {/* <Link href="/"> */}
        {/* </Link> */}
      </p>
      <div className="flex lg:justify-between justify-center lg:py-0 py-2 w-full lg:flex-row flex-col bg-[#F3F3F3]">
        <div className="flex items-center justify-center">
          <Image
            src="/images/local/secure.png"
            className="secure_image"
            width={10}
            height={10}
            alt="Secure Payment"
          />
          <span>Secure Checkout With</span>
        </div>
        <div className="flex gap-2 justify-center">
          {/* <Icon name='american-express' size={32} />
            <Icon name='visa' size={38} />
            <Icon name='paypal' size={38} />
            <Icon name='mastercard' size={32} /> */}
          <Image
            src="/images/local/paypal.png"
            className="payment_image"
            width={10}
            height={10}
            alt="PayPal"
          />
          <Image
            src="/images/local/visa.png"
            className="payment_image"
            width={10}
            height={10}
            alt="Visa"
          />
          <Image
            src="/images/local/american.png"
            className="payment_image"
            width={10}
            height={10}
            alt="American Express"
          />
          <Image
            src="/images/local/mastercard.png"
            className="payment_image"
            width={10}
            height={10}
            alt="Master Card"
          />
        </div>
      </div>

      {/* <div className="flex items-center my-2 sm:my-4">
        <Image
          src="/payments.png"
          alt="payment"
          width={285}
          height={27}
          className="block w-full"
          style={{ height: 'auto', width: '100%' }}
        // unoptimized
        />
      </div> */}
      {/* <PluginModule
        component={Component.OneClickCheckoutButtons}
        props={{
          product: data.product,
          clearBasket: true,
          addBeforeClick: variantsSelectionCheck,
          openMiniBasket: false
        }}
      />

      <MiscButtons
        productName={data.product.name}
        productPk={data.product.pk}
        variants={data.variants}
      /> */}

      {/* <Share
        className="my-2 sm:my-4"
        buttonText={t('product.share')}
        items={[
          {
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              currentUrl
            )}`,
            iconName: 'facebook',
            iconSize: 22
          },
          {
            href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
              currentUrl
            )}`,
            iconName: 'twitter',
            iconSize: 22
          },
          {
            href: `https://api.whatsapp.com/send?text=${
              data.product.name
            }%20${encodeURIComponent(currentUrl)}`,
            iconName: 'whatsapp',
            iconSize: 22
          }
        ]}
      /> */}
      <Modal
        portalId="whislist-cart"
        open={isModalOpenWishlist}
        setOpen={setIsModalOpenWishlist}
        showCloseButton={false}
        className="w-5/6 md:max-w-md"
      >
        <div className="flex flex-col items-center justify-center gap-4 px-6 py-9">
          <Icon name="bell" size={48} />
          <h2 className="text-xl font-semibold">Product Added to Whishlist</h2>
          <div className="max-w-40 text-xs text-center leading-4">
            <p>{stockAlertResponseMessage}</p>
          </div>
          <Button
            onClick={() => setIsModalOpenWishlist(false)}
            appearance="outlined"
            className="font-semibold px-10 h-12 pinkbtn"
          >
            {t('product.stock_alert.close_button')}
          </Button>
        </div>
      </Modal>
      <Modal
        portalId="product-add-to-cart"
        open={isModalOpenCart}
        setOpen={setIsModalOpenCart}
        showCloseButton={false}
        className="w-5/6 md:max-w-md"
      >
        <div className="flex flex-col items-center justify-center gap-4 px-6 py-9">
          <Icon name="bell" size={48} />
          <h2 className="text-xl font-semibold">
            {isAddingToCart ? 'Product Added to Cart' : 'Product Added to Cart'}
          </h2>
          <div className="max-w-40 text-xs text-center leading-4">
            <p>{stockAlertResponseMessage}</p>
          </div>
          <Button
            onClick={() => setIsModalOpenCart(false)}
            appearance="outlined"
            className="font-semibold px-10 h-12 pinkbtn"
          >
            {t('product.stock_alert.close_button')}
          </Button>
        </div>
      </Modal>
    </>
  );
}
