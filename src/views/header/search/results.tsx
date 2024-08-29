'use client';

import { useEffect, useMemo } from 'react';
import { useAutocompleteQuery } from '@akinon/next/data/client/misc';
import { ROUTES } from '@theme/routes';

import { LoaderSpinner, Price, Link, Icon } from '@theme/components';
import { useDebounce, useLocalization } from '@akinon/next/hooks';
// eslint-disable-next-line @akinon/projectzero/image-import
import Image from 'next/image';
interface ResultsProps {
  searchText: string;
}

const MINIMUM_SEARCH_LENGTH = 3;

export default function Results(props: ResultsProps) {
  const { searchText } = props;
  const { t } = useLocalization();
  const debouncedSearchText = useDebounce(searchText, 400);
  const { currentData, isFetching, isLoading } = useAutocompleteQuery(
    debouncedSearchText,
    {
      refetchOnMountOrArgChange: true,
      skip: debouncedSearchText.length < MINIMUM_SEARCH_LENGTH
    }
  );

  const categories = useMemo(
    () =>
      currentData?.groups.find((group) => group.suggestion_type === 'Category')
        ?.entries ?? [],
    [currentData]
  );

  const products = useMemo(
    () =>
      currentData?.groups.find((group) => group.suggestion_type === 'Product')
        ?.entries ?? [],
    [currentData]
  );

  if (
    debouncedSearchText.length < MINIMUM_SEARCH_LENGTH ||
    searchText !== debouncedSearchText
  ) {
    return null;
  }

  if (isLoading || isFetching) {
    return (
      <div className="m-5">
        <LoaderSpinner />
      </div>
    );
  }

  if (categories.length === 0 && products.length === 0) {
    return <p className="text-left p-3">{t('common.search.not_found')}</p>;
  }

  // useEffect(() => {
  //   const body = document.body;

  //   if (isMobileMenuOpen) {
  //     body.style.overflow = 'hidden';
  //     // body.classList.add('scroll-lock');
  //   } else {
  //     body.style.overflow = 'auto'; // Set the overflow property first
  //     body.classList.remove('scroll-lock');
  //   }

  //   return () => {
  //     // Clean up the styles if the component unmounts
  //     body.style.overflow = 'auto';
  //     // body.classList.remove('scroll-lock');
  //   };
  // }, [isMobileMenuOpen]);

  return (
    <div className="w-full mx-auto flex justify-center bg-white h-[60svh] overflow-auto">
      <div className="w-full p-3 lg:justify-center justify-start flex lg:flex-row flex-col gap-4 md:gap-0">
        {categories.length > 0 && (
          <div className="flex flex-col w-44">
            <h6 className="mb-6 font-semibold">
              {t('common.search.categories')}
            </h6>
            <ul className="flex flex-col gap-3">
              {categories.map((category, index) => (
                <li key={index} className="text-base">
                  <Link href={category.url}>{category.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex-1 lg:mt-5 mt-2 lg:px-6 flex flex-col gap-6">
          {/* <h6 className="font-semibold">
            {t('common.search.products_for')}{' '}
            <span className="text-secondary uppercase">
              {debouncedSearchText}
            </span>
          </h6> */}
          <div className="grid grid-cols-1 gap-8">
            {products.map((product, index) => (
              <Link href={product?.url} key={index}>
                <div className="flex justify-between items-center" key={index}>
                  <div className="flex items-center">
                    <div className="relative aspect-[315/448] lg:w-11 lg:h-12 w-[44px] h-[48px]">
                      {product.extra.image ? (
                        <Image
                          src={product.extra.image}
                          alt={product?.label}
                          fill
                          className=" rounded-full w-full"
                          sizes="(min-width: 320px) 164px,
                     (min-width: 640px) 50vw,
                     (min-width: 1160px) 315px"
                        />
                      ) : (
                        <Image
                          className="h-full rounded-full object-cover"
                          src="/noimage.jpg"
                          alt={product?.label}
                          fill
                          sizes="100vw"
                        />
                      )}
                    </div>

                    <span
                      className="text-sm mt-2 ms-5 truncate_search"
                      style={{ maxWidth: '200px', display: 'inline-block' }}
                    >
                      {product?.label}
                    </span>
                  </div>

                  <div>
                    <Icon
                      name="chevron-end"
                      className="search_icon"
                      size={12}
                    />
                  </div>
                  {/* <Price
                  value={product?.extra?.price}
                  className="font-semibold text-sm"
                /> */}
                </div>
              </Link>
            ))}
          </div>
          <Link
            href={`${ROUTES.LIST}/?search_text=${debouncedSearchText}`}
            data-testid="search-view-all"
            className="w-full py-3 px-10 mb-3 border-0 border-primary bg-[#C475AB] hover:border text-white text-center text-xs font-semibold hover:bg-white hover:text-black transition-all"
          >
            {t('common.search.view_all')} {debouncedSearchText.toUpperCase()}
          </Link>
        </div>
      </div>
    </div>
  );
}
