import {
  basketApi,
  useUpdateQuantityMutation
} from '@akinon/next/data/client/basket';
import { useAppDispatch } from '@akinon/next/redux/hooks';
import { BasketItem as BasketItemType } from '@akinon/next/types';
import { Price, Button, Icon, Modal, Select, Link } from '@theme/components';
import { useState } from 'react';
import { useAddFavoriteMutation } from '@akinon/next/data/client/wishlist';
import {
  useCommonProductAttributes,
  useLocalization
} from '@akinon/next/hooks';
import PluginModule, { Component } from '@akinon/next/components/plugin-module';
import { Image } from '@akinon/next/components/image';
import clsx from 'clsx';
import { pushRemoveFromCart } from '@theme/utils/gtm';
interface Props {
  basketItem: BasketItemType;
}

export const BasketItem = (props: Props) => {
  const { t } = useLocalization();
  const { basketItem } = props;
  const [updateQuantityMutation] = useUpdateQuantityMutation();
  const dispatch = useAppDispatch();
  const [isRemoveBasketModalOpen, setRemoveBasketModalOpen] = useState(false);
  const [addFavorite, { isLoading: addFavoriteLoading }] =
    useAddFavoriteMutation();
  const [updateQuantityLoading, setUpdateQuantityLoading] = useState(false);
  const commonProductAttributes = useCommonProductAttributes({
    attributes: basketItem.product.attributes_kwargs
  });

  const filteredAttributes = Object.keys(basketItem.product.attributes_kwargs)
    .filter(
      (key) => basketItem.product.attributes_kwargs[key].value !== 'NotInUse'
    )
    .reduce((obj, key) => {
      obj[key] = basketItem.product.attributes_kwargs[key].label;
      return obj;
    }, {});

  const updateQuantity = async (
    productPk: number,
    quantity: number,
    attributes: object = {}
  ) => {
    await updateQuantityMutation({
      product: productPk,
      quantity,
      attributes
    })
      .unwrap()
      .then((data) =>
        dispatch(
          basketApi.util.updateQueryData(
            'getBasket',
            undefined,
            (draftBasket) => {
              Object.assign(draftBasket, data.basket);
            }
          )
        )
      );
  };

  const deleteProduct = async (productPk?: number) => {
    setUpdateQuantityLoading(true);

    try {
      await updateQuantity(basketItem.product.pk, 0, basketItem.attributes);
      pushRemoveFromCart(basketItem?.product);

      if (productPk) {
        await addFavorite(productPk);
      }
    } catch (error) {
      console.error('Error in operation:', error);
    } finally {
      setUpdateQuantityLoading(false);
      setRemoveBasketModalOpen(false);
      document.body.style.overflow = 'auto';
    }
  };

  return (
    <>
      <li
        key={basketItem.id}
        className="flex border-b border-gray-200 py-3 relative my-2 lg:flex-row md:flex-row flex-col"
      >
        <div className="w-20 lg:w-24 mr-4 shrink-0 flex">
          <Link href={basketItem.product.absolute_url} passHref>
            <Image
              // src={basketItem.product.productimage_set[0]?.image}
              src={basketItem.product.attributes.variant_image}
              alt={basketItem.product.name}
              width={80}
              height={128}
              className="md:hidden"
            />
            <Image
              // src={basketItem.product.productimage_set[0]?.image}
              src={basketItem.product.attributes.variant_image}
              alt={basketItem.product.name}
              width={96}
              height={160}
              className="hidden md:block"
            />
          </Link>
        </div>
        <div className="w-full flex flex-col justify-between">
          <div className="flex h-full">
            <div className="flex flex-1 flex-col gap-3 ">
              <div className="flex-1">
                <div className="flex items-center justify-between w-full">
                  <Link
                    href={basketItem.product.absolute_url}
                    data-testid="basket-product-name"
                    passHref
                  >
                    <span className="text-xm color_blue">
                      {basketItem.product.name}
                    </span>
                  </Link>
                  <Icon
                    name="close"
                    size={8}
                    className="self-center cursor-pointer p-[5px] rounded-[50%] text-[#000] " // TODO: Add hover color. Fill not working
                    onClick={() => setRemoveBasketModalOpen(true)}
                    data-testid="basket-product-remove"
                  />
                </div>
                <div className="mt-3">
                  <div className="flex flex-wrap mt-2 gap-3">
                    {Object.keys(filteredAttributes).map((key) => (
                      <p key={key}>
                        <strong>{key}:</strong> {filteredAttributes[key]}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  {commonProductAttributes.map((attribute, index) => (
                    <span className="text-xs" key={index}>
                      <span>{attribute.name}</span>:{' '}
                      <span
                        data-testid={`basket-item-${attribute.name.toLowerCase()}`}
                      >
                        {attribute.value}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
              {/* <div className="flex shrink-0 text-sm whitespace-nowrap items-start justify-centermd:justify-start w-full flex-row lg:mr-6 gap-2 lg:gap-2  lg:justify-start"> */}
              <div className="flex shrink-0 text-sm whitespace-nowrap items-center md:justify-start w-full flex-row lg:mr-6 gap-2 lg:gap-2  lg:justify-start">
                <span className="text-base font-bold">Price:</span>
                <Price
                  className={clsx(
                    parseFloat(
                      basketItem.product.retail_price.replace('USD', '')
                    ) > parseFloat(basketItem.product.price.replace('USD', ''))
                      ? 'text-secondary-500 color_blue'
                      : 'text-primary color_blue'
                  )}
                  value={`${parseFloat(
                    basketItem.product.price.replace('USD', '')
                  )}`} // Display price without 'USD'
                  data-testid="basket-product-price"
                />

                {parseFloat(
                  basketItem.product.retail_price.replace('USD', '')
                ) > parseFloat(basketItem.product.price.replace('USD', '')) && (
                  <Price
                    className="line-through text-xs"
                    value={`${parseFloat(
                      basketItem.product.retail_price.replace('USD', '')
                    )}`} // Display price without 'USD'
                  />
                )}
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-3 lg:w-52 cart_button_add_mobile">
                <div className=" border-[#b9b9b9] py-2 lg:px-2 px-1 flex items-center justify-center">
                  <button
                    onClick={() => {
                      updateQuantity(
                        basketItem.product.pk,
                        Math.max(1, basketItem.quantity - 1)
                      );
                    }}
                    disabled={basketItem.quantity <= 1}
                    className="btn btn-secondary"
                  >
                    <Image
                      width={10}
                      height={10}
                      src="/images/local/decrement.svg"
                      className="button_count_image  about_ecommerce_content"
                      alt="+"
                    />

                    {/* <Icon size={10} name='minus' className={`${Style.cart_add_minus} p-1`} /> */}
                  </button>
                  <span className="mx-2 text-[#343434]">
                    {basketItem.quantity}
                  </span>
                  <button
                    onClick={() => {
                      updateQuantity(
                        basketItem.product.pk,
                        basketItem.quantity + 1
                      );
                    }}
                    className="btn btn-secondary "
                  >
                    <Image
                      width={10}
                      height={10}
                      src="/images/local/increment.svg"
                      className="button_count_image  about_ecommerce_content"
                      alt="+"
                    />

                    {/* <Icon size={10} name='plus' className={`${Style.cart_minus_add} p-1`} /> */}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <PluginModule
            component={Component.BasketGiftPack}
            props={{ basketItem }}
          />
        </div>
      </li>
      <Modal
        portalId="remove-basket-item"
        title={t('basket.card.modal.title')}
        className="w-full sm:w-[28rem] max-h-[90vh] overflow-y-auto"
        open={isRemoveBasketModalOpen}
        showCloseButton={false}
        setOpen={setRemoveBasketModalOpen}
      >
        <div className="px-6 py-4">
          <p className="mb-10"> {t('basket.card.modal.question')}</p>
          <div className="space-x-3 flex items-end justify-center">
            <Button
              disabled={updateQuantityLoading}
              appearance="filled"
              onClick={() => {
                deleteProduct();
              }}
              // className={ updateQuantityLoading && 'opacity-50 pinkbtn cursor-not-allowed' }
              className={' pinkbtn '}
              data-testid="basket-modal-delete"
            >
              {t('basket.card.modal.delete')}
            </Button>
            <Button
              appearance="outlined"
              disabled={addFavoriteLoading}
              onClick={() => {
                deleteProduct(basketItem.product.pk);
              }}
              // className={addFavoriteLoading  && 'opacity-50 border pinkbtn cursor-not-allowed'}
              className={' pinkbtn '}
              data-testid="basket-modal-delete-and-add-favorite"
            >
              {t('basket.card.modal.add_to_favorites')}
            </Button>
            <Button
              appearance="outlined"
              onClick={() => {
                setRemoveBasketModalOpen(false);
              }}
              data-testid="basket-modal-cancel"
              className="pinkbtn"
            >
              {t('basket.card.modal.cancel')}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
