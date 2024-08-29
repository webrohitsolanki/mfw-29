'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useGetOrdersQuery } from '@akinon/next/data/client/account';
import { LoaderSpinner, Select } from '@theme/components';
import { ContentHeader } from '@theme/views/account/content-header';
import { Order } from '@theme/views/account/order';
import { useLocalization, useRouter } from '@akinon/next/hooks';
import { Trans } from '@akinon/next/components/trans';
import { Image, Pagination } from '@akinon/next/components';

const AccountOrders = () => {
  const { t } = useLocalization();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [selectedDateRange, setSelectedDateRange] = useState(
    searchParams.toString()
  );

  const dateOptions = [
    {
      label: t('account.my_orders.order.choose_date'),
      value: ''
    },
    ...Array.from({ length: 5 }, (_, index) => {
      const year = new Date().getFullYear() - index;
      const startDate = `${year}-01-01`;
      const endDate = `${year + 1}-01-01`;

      return {
        label: `${year}`,
        value: `created_date__gte=${startDate}&created_date__lte=${endDate}`
      };
    })
  ];

  const {
    data: orders,
    isLoading,
    isFetching
  } = useGetOrdersQuery({
    page: Number(searchParams.get('page')),
    limit: Number(searchParams.get('limit')),
    createdDate: searchParams.get('created_date__gte'),
    endDate: searchParams.get('created_date__lte')
  });

  const contentHeaderOrders = useMemo(
    () =>
      orders?.results.map((item) => ({ label: item.number, value: item.id })),
    [orders]
  );

  const handleChange = async (e) => {
    const newValue = e.target.value;

    setSelectedDateRange(newValue);
    router.push(pathname + '?' + newValue);
  };

  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);

    const paramsToKeep = ['created_date__gte', 'created_date__lte'];

    newSearchParams.forEach((_value: string, key: string) => {
      if (!paramsToKeep.includes(key)) {
        newSearchParams.delete(key);
      }
    });

    setSelectedDateRange(newSearchParams.toString());
  }, [searchParams]);

  if (isLoading || isFetching) {
    return <LoaderSpinner />;
  }

  return (
    <div className="flex-1">
      <ContentHeader orders={contentHeaderOrders} />
      <div className="w-full flex items-center justify-between mb-4 md:mb-2">
        <div className="flex items-center sm:gap-4 gap-2">
          <span className="text-sm">
            <Trans
              i18nKey="account.my_orders.order.count"
              components={{
                Orders: <span>{t('account.my_orders.order.orders')}</span>
              }}
            />
          </span>
          <Select
            className="w-full text-base"
            onChange={(e) => handleChange(e)}
            options={dateOptions}
            value={selectedDateRange}
          />
        </div>
        <div className="hidden text-xs text-right md:block">
          <Pagination
            total={orders.count}
            containerClassName="flex flex-wrap justify-end mb-0 mt-0"
            numberOfPages={Math.ceil(orders.count / 12)}
            currentPage={Number(searchParams.get('page')) || 1}
          />
        </div>
      </div>
      {orders?.results.length > 0 ? (
        <>
          {orders.results.map((item, index) => (
            <Order key={index} {...item} />
          ))}

          <div className="text-xs text-right my-4">
            <Pagination
              total={orders.count}
              containerClassName="flex flex-wrap mt-8 mb-4 justify-end"
              numberOfPages={Math.ceil(orders.count / 12)}
              currentPage={Number(searchParams.get('page')) || 1}
            />
          </div>
        </>
      ) : (
        <div>
          <div className="flex justify-center my-10">
            <Image
              width={100}
              height={100}
              alt="Orders"
              className="order_dont_show"
              src="/images/local/order.svg"
            />
          </div>
          <p className="text-lg text-center text-bold md:text-2xl">
            {`You haven't placed any order yet!`}
          </p>
          <p className="text-center text-gray-600">
            Order section is empty. After placing order, You can track them from
            here!
          </p>
        </div>
      )}
    </div>
  );
};

export default AccountOrders;
