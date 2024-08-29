'use client';

import { useState } from 'react';
import { Button, LoaderSpinner, Modal } from '@theme/components';
import {  AddressForm } from '@theme/views/account';
// import { AddressCard, AddressForm } from '@theme/views/account';
import {
  useAddAddressMutation,
  useGetAddressesQuery
} from '@akinon/next/data/client/address';
import { useLocalization } from '@akinon/next/hooks';
import { AddressCardProfile } from '@theme/views/account/address-card-profile';

export default function Page() {
  const { t } = useLocalization();
  const [isNewAddressModalOpen, setIsNewAddressModalOpen] = useState(false);  

  const { data, isLoading, isSuccess } = useGetAddressesQuery();
  const [addAddress] = useAddAddressMutation();

  const onSubmit = async (data) => {
    await addAddress(data);
    setIsNewAddressModalOpen(false);
  };

  return (
    <div>
      <div className="bg-gray-150 py-3 px-1 w-full mb-12">
        <div className=" lg:flex lg:gap-16 px-2 justify-between items-center">
          <div className='flex items-center lg:flex-row flex-col' >
            <h3 className="text-2xl text-center">
              Address Book
            </h3>
            <p className='border_line lg:block hidden'></p>
            <p className="text-center max-w-xs mx-auto lg:max-w-none">
              Add new address and edit address
            </p>
          </div>
          <div className='lg:mt-0 mt-2'>
            <Button
              className="w-56 mx-auto mt-0 block lg:mx-0 pinkbtn"
              onClick={() => setIsNewAddressModalOpen(true)}
              data-testid="account-address-add"
            >
              {t('account.address_book.add_button')}
            </Button>
          </div>
          <Modal
            portalId="account-address-new-address-modal"
            title={t('account.address_book.modal.add_new_address')}
            open={isNewAddressModalOpen}
            setOpen={setIsNewAddressModalOpen}
            className="w-full sm:w-[28rem] max-h-[90vh] overflow-y-auto"
          >
            <AddressForm onSubmit={onSubmit} />
          </Modal>
        </div>
        {/* <p className="text-center max-w-xs mx-auto lg:max-w-none">
          {t('account.address_book.header.description')}
        </p> */}
      </div>
      {isLoading && (
        <div className="flex justify-center mb-4">
          <LoaderSpinner />
        </div>
      )}
      {isSuccess && (
        <div className="">
          {data.results.map((address, index) => (
            <AddressCardProfile address={address} key={address.pk} index={index} />
          ))}
        </div>
      )}
      <Button
        appearance="outlined"
        className="w-full my-5 lg:hidden pinkbtn"
        onClick={() => setIsNewAddressModalOpen(true)}
        data-testid="account-address-add-2"
      >
        {t('account.address_book.add_button')}
      </Button>
    </div>
  );
}
