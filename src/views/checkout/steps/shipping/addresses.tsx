import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';
import { useAppSelector } from '@akinon/next/redux/hooks';
import { RootState } from '@theme/redux/store';
import { useSetAddressesMutation } from '@akinon/next/data/client/checkout';
import { CheckoutAddressType } from '@akinon/next/types';
import { Checkbox, Icon, Modal } from '@theme/components';
import AddressBox from './address-box';
import { useAddAddressMutation } from '@akinon/next/data/client/address';
import { useLocalization } from '@akinon/next/hooks';
import PluginModule, { Component } from '@akinon/next/components/plugin-module';
import { Trans } from '@akinon/next/components/trans';
// import  from '../../../../assets/stylesheets/checkout.module.'
import { AddressForm } from '@theme/views/account';

// import ClickCollect from '@akinon/pz-click-collect';

const Addresses = () => {
  const { t } = useLocalization();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const addressList = useAppSelector(
    (state: RootState) => state.checkout.addressList
  );

  const {
    shipping_address,
    billing_address,
    billing_and_shipping_same,
    delivery_option
  } = useAppSelector((state: RootState) => state.checkout.preOrder) ?? {};

  const [isBillingAddressSame, setIsBillingAddressSame] = useState(
    billing_and_shipping_same
  );

  const addressTypes: CheckoutAddressType[] = useMemo(
    () => [
      {
        label: 'Delivery',
        text: t('checkout.address.delivery'),
        value: shipping_address?.pk,
        requestParam: 'shippingAddressPk'
      },
      {
        label: 'Billing',
        text: t('checkout.address.billing'),
        value: billing_address?.pk,
        requestParam: 'billingAddressPk'
      }
    ],
    [shipping_address?.pk, billing_address?.pk, t]
  );
  const [setAddresses] = useSetAddressesMutation();
  const [addAddress] = useAddAddressMutation();

  const handleSameBillingAddressChange = () => {
    setIsBillingAddressSame((prevValue) => {
      if (!prevValue) {
        setAddresses({
          shippingAddressPk: shipping_address?.pk,
          billingAddressPk: shipping_address?.pk
        });
      }

      return !prevValue;
    });
  };

  const setSelectAddresses = (pk: number) => {
    const addresses = {
      shippingAddressPk: pk,
      billingAddressPk: pk
    };

    setAddresses(addresses);
  };

  useEffect(() => {
    setIsBillingAddressSame(billing_and_shipping_same);
  }, [billing_and_shipping_same]);

  const onSubmit = (data) => {
    addAddress(data)
      .unwrap()
      .then((addAddressResponse) => {
        if (addressList.length === 0) {
          setSelectAddresses(addAddressResponse.pk);
        }
      })
      .catch((error) => console.error(error));

    setIsModalOpen(false);
  };

  const AddressType = (props) => {
    return props.title;
  };


  return (
    <div className="w-full lg:w-3/5 lg:border-r lg:border-gray-400">
      {addressTypes
        .filter((addressType) =>
          isBillingAddressSame ? addressType.label !== 'Billing' : true
        )
        .map((addressType) => (
          <div key={addressType.label}>
            <div className="flex items-center justify-between border-b border-gray-400 lg:px-8 px-4 py-4">
              <h2 className={clsx(['address_heading'], "text-2xl whitespace-nowrap")}>
                {addressType.text} {t('checkout.address.address')}
              </h2>

              {addressType.label === 'Delivery' &&
                delivery_option?.delivery_option_type !== 'retail_store' && (
                  <Checkbox
                    checked={isBillingAddressSame}
                    onChange={handleSameBillingAddressChange}
                    data-testid="checkout-billing-checkbox"
                  >
                    {t('checkout.address.use_for_billing')}
                  </Checkbox>
                )}
            </div>
            <div className="lg:px-8 px-4 py-4 border-gray-400">
              <p className={clsx(['select_address_label'], "text-xs mb-4")}>
                <Trans
                  i18nKey="checkout.address.content"
                  components={{
                    addressType: (
                      <AddressType title={addressType.text.toLowerCase()} />
                    )
                  }}
                />
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addressList.map((address) => (
                  <AddressBox
                    key={address.pk}
                    addressType={addressType}
                    address={address}
                    isBillingAddressSame={isBillingAddressSame}
                    data-testid={`checkout-address-${address.pk}`}
                    disabled={
                      delivery_option?.delivery_option_type ===
                      'retail_store' &&
                      addressType.requestParam === 'shippingAddressPk'
                    }
                  />
                ))}

                <PluginModule
                  component={Component.ClickCollect}
                  props={{ addressTypeParam: addressType.requestParam }}
                />

                <div
                  role="button"
                  onClick={() => setIsModalOpen(true)}
                  className={clsx(
                    'relative cursor-pointer w-full min-h-[8rem] border shadow p-4 lg:aspect-square',
                    "hover:after:content-[''] hover:after:border-4 hover:after:opacity-80 hover:after:transition-opacity",
                    'after:border-black-500  after:absolute after:inset-0 after:opacity-0 after:duration-150 after:-z-10',
                    {
                      'opacity-30 select-none pointer-events-none':
                        delivery_option?.delivery_option_type === 'retail_store'
                    }
                  )}
                >
                  <div className="text-xs xl:flex-row flex-col flex justify-center items-center h-full gap-x-2">
                    <Icon name="plus" size={11} />
                    <span data-testid="checkout-add-new-address" className={clsx(['add_new_address_text'])}>
                      {t('checkout.address.add_new_address')}
                    </span>
                  </div>
                </div>

                <Modal
                  portalId="orders-checkout-new-address-modal"
                  title={t('checkout.address.add_new_address')}
                  open={isModalOpen}
                  // showHeaderDivider={false}
                  // isMobile={false}
                  setOpen={setIsModalOpen}
                  className={clsx(['new_address_model'], "sm:w-[28rem] w-[97vw] max-h-[90vh] overflow-y-auto")}
                >
                  <AddressForm onSubmit={onSubmit} />
                </Modal>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Addresses;
