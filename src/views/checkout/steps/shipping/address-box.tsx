import clsx from 'clsx';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@akinon/next/redux/hooks';
import { RootState } from '@theme/redux/store';
import {
  useEditAddressMutation,
  useRemoveAddressMutation
} from '@akinon/next/data/client/address';
import {
  useSetAddressesMutation,
  useSetRetailStoreMutation,
  useSetShippingOptionMutation
} from '@akinon/next/data/client/checkout';
import { Address, CheckoutAddressType } from '@akinon/next/types';
import { Button, Modal, Radio } from '@theme/components';
import { resetCheckoutState } from '@akinon/next/redux/reducers/checkout';
import { useLocalization } from '@akinon/next/hooks';
import { AddressForm } from '@theme/views/account';

interface AddressBoxProps {
  addressType: CheckoutAddressType;
  address: Address;
  isBillingAddressSame: boolean;
  disabled: boolean;
}

const AddressBox = ({
  addressType,
  address,
  isBillingAddressSame,
  disabled
}: AddressBoxProps) => {
  const { t } = useLocalization();
  const [isEditAddressModalOpen, setIsEditAddressModalOpen] = useState(false);
  const { shipping_address, billing_address, delivery_option, retail_store } =
    useAppSelector((state: RootState) => state.checkout.preOrder) ?? {};
  const addressList = useAppSelector(
    (state: RootState) => state.checkout.addressList
  );
  const [setShippingOption] = useSetShippingOptionMutation();
  const [setRetailStore] = useSetRetailStoreMutation();
  const [setAddresses] = useSetAddressesMutation();
  const [editAddress] = useEditAddressMutation();
  const [removeAddress] = useRemoveAddressMutation();
  const dispatch = useAppDispatch();

  const handleAddressClick = (
    addressType: CheckoutAddressType,
    address: Address
  ) => {
    if (addressType.value === address.pk) {
      return;
    }

    const addresses = {
      shippingAddressPk: shipping_address?.pk,
      billingAddressPk: billing_address?.pk
    };

    if (isBillingAddressSame) {
      Object.keys(addresses).forEach((key) => {
        addresses[key] = address.pk;
      });
    } else {
      addresses[addressType.requestParam] = address.pk;
    }

    if (!delivery_option) {
      console.warn(
        'The delivery option was not found, please add one or more options from Omnitron.'
      );
    }

    if (delivery_option?.delivery_option_type === 'retail_store') {
      setShippingOption(delivery_option.pk).unwrap();
      setRetailStore({
        retailStorePk: retail_store.pk,
        billingAddressPk: address.pk
      });
    } else {
      setAddresses(addresses);
    }
  };

  const onSubmit = (data) => {


    editAddress(data)
      .unwrap()
      .then((editAddressResponse) => {
        handleAddressClick(addressType, editAddressResponse);
      })
      .catch((error) => console.error(error));

    setIsEditAddressModalOpen(false);
  };

  const handleRemoveAddress = async (addressPk: number) => {
    await removeAddress(addressPk);
    dispatch(resetCheckoutState());

    if (
      addressPk === shipping_address?.pk ||
      addressPk === billing_address?.pk
    ) {
      const newAddressList = addressList.filter((address) => {
        if (address.pk !== addressPk) {
          return address.pk;
        }
      });

      const addresses = {
        shippingAddressPk:
          addressPk === shipping_address?.pk
            ? newAddressList[0]?.pk
            : shipping_address?.pk,
        billingAddressPk:
          addressPk === billing_address?.pk
            ? newAddressList[0]?.pk
            : billing_address?.pk
      };
      setAddresses(addresses);
    }
  };

  return (
    <div
      onClick={() => handleAddressClick(addressType, address)}
      key={address.pk}
      className={clsx(
        'cursor-pointer relative w-full border shadow p-4 min-h-[8rem] xl:aspect-square flex flex-col justify-between',
        "hover:after:content-[''] hover:after:border-4 hover:after:opacity-80 hover:after:transition-opacity",
        'after:border-black-500 after:absolute after:inset-0 after:duration-150 after:-z-10',
        [(addressType.value === address.pk) ? 'active_addressbox' : ''],
        {
          'after:opacity-0': addressType.value !== address.pk
        },
        {
          'after:border-4 after:opacity-100': addressType.value === address.pk
        },
        {
          'opacity-30 select-none pointer-events-none': disabled
        }
      )}
    >
      <div>
        <Radio
          className={clsx("mb-2", ['address_check_radio'])}
          name={addressType.label}
          checked={addressType.value === address.pk}
          onChange={() => null}
        >
          <span className={clsx(['choose_address'], "text-xs font-normal")}>
            {
              (addressType.value === address.pk) &&
                "Choose a delivery option for"
            }
          </span>
        </Radio>
        <div className={clsx(['address_texts'], "text-xs mb-3 leading-4")}>
          <p className={clsx('font-semibold')}>{address.title}</p>
          <p>{address.phone_number}</p>
          {/* text-ellipsis whitespace-nowrap overflow-hidden */}
          <p>
            {address.line}
          </p>
          <p>
            {address.township.name} / {address.city.name}
          </p>
        </div>
      </div>

      <div className="text-xs flex justify-between">
        <Button
          appearance="ghost"
          className={clsx(['address_action'], "underline hover:text-secondary-500 hover:!bg-white hover:!border-white p-0 h-auto")}
          onClick={() => setIsEditAddressModalOpen(true)}
          data-testid="checkout-address-edit"
        >
          {t('checkout.address.box.edit')}
        </Button>
        <Modal
          portalId={`checkout-shipping-edit-address-modal-${address.pk}`}
          title={t('checkout.address.modal.edit_address')}
          open={isEditAddressModalOpen}
          // isMobile={false}
          // showHeaderDivider={false}
          setOpen={setIsEditAddressModalOpen}
          className={clsx(['edit_address_model'], "sm:w-[28rem] w-[97vw] max-h-[90vh] overflow-y-auto")}
        >
          <AddressForm
            data={{
              ...address,
              country: address.country?.pk,
              city: address.city?.pk,
              township: address.township?.pk,
              district: address.district?.pk
            }}
            onSubmit={onSubmit}
          />
        </Modal>
        <Button
          appearance="ghost"
          className={clsx(['address_action'], "underline hover:text-secondary-500 hover:!bg-white hover:!border-white p-0 h-auto")}
          onClick={() => handleRemoveAddress(address.pk)}
          data-testid="checkout-address-remove"
        >
          {t('checkout.address.box.remove')}
        </Button>
      </div>
    </div>
  );
};

export default AddressBox;
