'use client';

import React, { useState } from 'react';
import {
  useEditAddressMutation,
  useRemoveAddressMutation,
  useSetDefaultAddressMutation
} from '@akinon/next/data/client/address';
import { Address } from '@akinon/next/types';
import { AddressForm } from './address-form/address-form';
import { Button, Modal, Radio } from '@theme/components';
import { useLocalization } from '@akinon/next/hooks';

export interface Props {
  address: Address;
  index: number;
}

export const AddressCardProfile = (props: Props) => {
  const { t } = useLocalization();
  const { address, index } = props;
  const [isEditAddressModalOpen, setIsEditAddressModalOpen] = useState(false);
  const [editAddress] = useEditAddressMutation();
  const [removeAddress] = useRemoveAddressMutation();
  const [setDefaultAddress] = useSetDefaultAddressMutation();

  const onSubmit = async (data) => {
    await editAddress(data);
    setIsEditAddressModalOpen(false);
  };

  return (
    <>
      <Radio
        className="mt-9 mb-1 accent-primary uppercase"
        name="address"
        defaultChecked={address.primary}
        onChange={() => setDefaultAddress({ pk: address.pk, primary: true })}
      >
        {t('account.address_book.card.default_address')}
      </Radio>
      <div key={address.pk} className="border border-[#34343430] p-3 relative">
        {/* <div className="bg-black w-12 h-12 text-white rounded-full text-center -top-6 absolute left-1/2 -translate-x-1/2">
                        <span
                            className="top-1/2 relative block -translate-y-1/2"
                            data-testid="address-card-count"
                        >
                            {index + 1}
                        </span>
                     </div>
                */}
        <h2
          className="text-2xl my-2 font-semibold break-all"
          data-testid="address-card-title"
        >
          {address.title}
        </h2>

        <div className="mb-2">
          <p
            title={address.line}
            className="text-base leading-5 break-all mb-2 font-medium truncate"
          >
            {address.line}
          </p>

          <p className="text-base leading-5 break-all font-medium">
            {address.township.name}/{address.city.name}
          </p>
        </div>

        <div className="text-base flex gap-2 w-full pt-5 border-t border-gray-200 mt-auto">
          <div className="w-3/12">
            <Button
              className="pinkbtn uppercase w-full text-base p-0 h-auto"
              onClick={() => setIsEditAddressModalOpen(true)}
            >
              {t('account.address_book.card.edit')}
            </Button>
          </div>
          <Modal
            portalId={`account-address-edit-address-modal-${address.pk}`}
            title={t('account.address_book.modal.edit_address')}
            open={isEditAddressModalOpen}
            setOpen={setIsEditAddressModalOpen}
            className="w-full sm:w-[28rem] max-h-[90vh] overflow-y-auto"
          >
            <AddressForm
              data={{
                ...address,
                country: address.country.pk,
                city: address.city.pk,
                township: address.township.pk,
                district: address.district.pk
              }}
              onSubmit={onSubmit}
            />
          </Modal>
          <div className="w-3/12">
            <Button
              className="pinkbtn uppercase w-full text-base p-0 h-auto"
              onClick={() => removeAddress(address.pk)}
              data-testid="address-card-remove"
            >
              {t('account.address_book.card.remove')}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
