import React, { useState } from 'react';
import { Button, Select } from '@theme/components';
import clsx from 'clsx';
import { ROUTES } from '@theme/routes';
import { useRouter, useLocalization } from '@akinon/next/hooks';

interface Props {
  orders: Array<any>;
}

export const ContentHeader = (props: Props) => {
  const { orders } = props;
  const { t } = useLocalization();
  const [selectedOrder, setSelectedOrder] = useState(orders[0]?.value);
  const router = useRouter();

  const handleChange = (e) => {
    setSelectedOrder(e.target.value);
  };

  const handleClick = () => {
    router.push(`${ROUTES.ACCOUNT_ORDERS}/${selectedOrder}`);
  };

  const isButtonDisabled = orders.length < 1;

  return (
    <div className=" flex flex-col items-center w-full gap-10 justify-center justify-between  mb-12 md:flex-row">
      <div className='flex items-center justify-between md:flex-row flex-col py-3 px-2 w-full bg-gray-150'>
        <div className='flex md:flex-row flex-col w-full'>
          <h3 className="text-lg	mb-4 md:mb-0 md:mr-4 xl:text-2xl">
            {t('account.base.widgets.order.title')}
          </h3>

          <Select
            onChange={handleChange}
            className="w-full mb-4 md:mb-0 md:w-56 md:mr-4 text-xs"
            options={orders}
            data-testid="account-orders-header-select"
          ></Select>
        </div>

        <div className='lg:w-4/12 md:w-max w-full whitespace-nowrap'>
          <Button
            className={clsx(
              'w-full',
              isButtonDisabled &&
              'hover:bg-white hover:text-black cursor-pointer p-3 disabled:opacity-75 w-full pinkbtn'
            )}
            onClick={handleClick}
            data-testid="account-orders-header-button"
            disabled={isButtonDisabled}
          >
            {t('account.base.widgets.order.button')}
          </Button>
        </div>
      </div>
    </div>
  );
};
