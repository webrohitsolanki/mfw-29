'use client';

import React, { useMemo } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import clsx from 'clsx';
import { Button, Icon, Select, Link } from '@theme/components';
import { SortOption } from '@akinon/next/types';
import { useRouter, useLocalization } from '@akinon/next/hooks';

interface Props {
  totalCount: number;
  setMenuStatus: () => void;
  sortOptions: SortOption[];
}

export const CategoryHeader = (props: Props) => {
  const { t } = useLocalization();
  const PAGE_SIZE = [
    { label: t('category.filters.48_products'), value: 48 },
    { label: t('category.filters.96_products'), value: 96 }
  ];

  const LAYOUTS = [
    { icon: 'layout-2', value: 2 },
    { icon: 'layout-3', value: 3 }
  ];
  const { totalCount, setMenuStatus, sortOptions } = props;
  const router = useRouter();

  const searchParams = useSearchParams();
  const pathname = usePathname();

  const pageSize = useMemo(
    () => searchParams.get('page_size') ?? 48,
    [searchParams]
  );
  const layoutSize = useMemo(
    () => searchParams.get('layout') ?? 3,
    [searchParams]
  );

  const handleSelectFilter = ({
    key,
    value
  }: {
    key: string;
    value: string;
  }) => {
    const urlSearchParams = new URLSearchParams(searchParams.toString());

    urlSearchParams.set(key, value);

    router.push(pathname + '?' + urlSearchParams.toString());
  };
  // const breadcrumbList = [
  //   { url: '/list', label: 'List' },
  // ];
  return (
    <div>
      {/* <Breadcrumb breadcrumbList={breadcrumbList} /> */}

      <div className="flex flex-col gap-4 mb-4 text-gray-950 text-sm p-1 border border-t-[#E987B4] border-b-[#E987B4] border-l-0 border-r-0 w-full">
        <div className='flex justify-between items-center'>
          <div className="flex items-center gap-2">
            <span className="border_pink"></span>
            <span className="flex items-center font-bold text-xs ">
              <span className='pr-1' data-testid="list-count">{totalCount}</span>{' '}
              {/* {t('category.header.results')} */}
              Products
            </span>
          </div>
          <div>
            <div className="hidden lg:flex gap-5 ml-auto mr-7 py-2 border border-l-0 border-t-0 border-b-0 pr-[3.25rem] border-r-[#E987B4]">
              <div className="flex items-center gap-2 pl-5 grid_layout border-gray-400">
                {LAYOUTS.map(({ icon, value }) => (
                  <a
                    key={value}
                    onClick={() => {
                      handleSelectFilter({
                        key: 'layout',
                        value: String(value)
                      });
                    }}
                    className={clsx(
                      'cursor-pointer',
                      Number(layoutSize) === value ? 'fill-black' : 'fill-gray-500'
                    )}
                  >
                    <Icon key={value} name={icon} size={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className='flex items-center'>
            <Button
              className={`relative lg:text-base text-[10px] w-auto p-0 gap-5 border-gray-100 flex items-center text-left bg-white text-primary-100 lg:w-40 lg:hidden lg:mr-0`}
              onClick={() => setMenuStatus()}
              data-testid="list-filter"
            >
              <span>
                <p className='hidden lg:block'>{t('category.filters.title')}</p>
                <p className='lg:none text-black font-bold whitespace-nowrap'>FILTER BY</p>
              </span>
              <span>
                <Icon
                  name="chevron-down"
                  size={10}
                  className="absolute text-black right-1 top-1/2 transform -translate-y-1/2"
                />
              </span>
            </Button>
            <div className="border_pink mx-2"></div>
            <div className='flex items-center flex-col lg:flex-row '>
              <span className='w-full text-left flex lg:flex-row items-center flex-col'>
                <h3 className="uppercase lg:text-base text-[12px] lg:pl-0 pl-[5px] text-left w-full font-medium">Sort by :</h3>

                <Select
                  options={sortOptions}
                  value={sortOptions.find(({ is_selected }) => is_selected).value}
                  data-testid="list-sorter"
                  className="border-0 mr-[10px] font-semibold lg:text-[14px] text-[12px] lg:mt-0 mt-[-5px] w-auto p-0"
                  onChange={(e) => {
                    handleSelectFilter({
                      key: 'sorter',
                      value: e.currentTarget.value
                    });
                  }}
                  borderless={false}
                />
              </span>
            </div>
          </div>
        </div>
        {totalCount === 0 && (
          <div className="h-40 flex items-center justify-center  flex-col bg-gray-200 p-4">
            <div className="text-center">
              <span className="text-lg">{t('category.search.not_found')}</span>
            </div>
            <div className="mt-3 text-center">
              <Link href="/" className="underline text-lg">
                {t('category.search.link')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
