'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { useSearchParams } from 'next/navigation';
import { CategoryHeader } from './category-header';
import { Filters } from './filters';
import { ProductItem } from '@theme/views/product-item';
import { GetCategoryResponse } from '@akinon/next/types';
import { useAppDispatch } from '@akinon/next/redux/hooks';
import { setFacets } from '@theme/redux/reducers/category';
import CategoryActiveFilters from '@theme/views/category/category-active-filters';
import { useLocalization } from '@akinon/next/hooks';
import { Link, LoaderSpinner } from '@akinon/next/components';
import { ROUTES } from '@theme/routes';
import { useRouter } from '@akinon/next/hooks';
import { Pagination } from '@akinon/next/components';

// import { Pagination } from '@theme/components/Pagination';

interface ListPageProps {
  data: GetCategoryResponse;
}

export default function ListPage(props: ListPageProps) {
  const { data } = props;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [productList, setProductList] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { t } = useLocalization();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const layoutSize = useMemo(
    () => searchParams.get('layout') ?? 3,
    [searchParams]
  );

  const page = useMemo(
    () => Number(searchParams.get('page') ?? 1),
    [searchParams]
  );

  useEffect(() => {
    if (page > 1 && data.products?.length === 0) {
      const newUrl = new URL(window.location.href);

      newUrl.searchParams.delete('page');
      router.push(newUrl.pathname + newUrl.search, undefined);
    }
  }, [searchParams, data.products, page]);

  useEffect(() => {
    dispatch(setFacets(data.facets));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.facets]);

  useEffect(() => {
    if (isMenuOpen && setIsMenuOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [setIsMenuOpen, isMenuOpen]);

  // useEffect(() => {
  //   setCurrentPage(Number(searchParams.get('page')) || 1);
  // }, []);

  // useEffect(() => {
  //   if (page > 1 && data.products?.length === 0) {
  //     const newUrl = new URL(window.location.href);

  //     newUrl.searchParams.delete('page');
  //     router.push(newUrl.pathname + newUrl.search, undefined);
  //   }
  // }, [searchParams, data.products, page]);

  // useEffect(() => {
  //   if (data.products.length > 0) {
  //     setProductList((prev) => {
  //       if (Number(searchParams.get('page')) > currentPage) {
  //         setIsLoading(false);
  //         return [...prev, ...(data?.products || [])];
  //       } else {
  //         return [...(data?.products || []), ...prev];
  //       }
  //     });
  //   }
  // }, [data]);

  // const handlePageChange = (newPage: number) => {
  //   const newUrl = new URL(window.location.href);
  //   newUrl.searchParams.set('page', String(newPage));
  //   setIsLoading(true);
  //   router.push(newUrl.pathname + newUrl.search, { scroll: false });
  // };

  return (
    <>
      <div className="container px-4 mx-auto lg:px-0 lg:my-4 category_infocontainer">
        <div className="grid grid-cols-[19rem_1fr]">
          <Filters isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
          <div
            onClick={() => setIsMenuOpen(false)}
            className={clsx(
              'transition-opacity duration-300 ease-linear lg:hidden',
              isMenuOpen
                ? 'fixed bg-black bg-opacity-60 inset-0 z-10 opacity-100'
                : 'opacity-0'
            )}
          ></div>
          <div className="flex flex-col w-full items-center lg:items-stretch col-span-2 lg:col-span-1">
            <div className="w-full">
              <CategoryHeader
                totalCount={data.pagination.total_count}
                setMenuStatus={() => setIsMenuOpen(true)}
                sortOptions={data.sorters}
              />
              <div className="hidden lg:block">
                <CategoryActiveFilters />
              </div>
            </div>

            {data.products.length === 0 && page === 1 && (
              <div className="text-center bg-gray-200 px-5 py-20">
                <p className="pb-4">{t('category.search.not_found')}</p>
                <Link className="underline" href={ROUTES.LIST}>
                  Continue Shopping
                </Link>
              </div>
            )}

            {data.products.length === 0 && page > 1 && <LoaderSpinner />}

            <div
              className={clsx('grid gap-x-4 gap-y-12 grid-cols-2', {
                'md:grid-cols-3': Number(layoutSize) === 3,
                'lg:grid-cols-2': Number(layoutSize) === 2,
                'lg:grid-cols-3': Number(layoutSize) === 3
              })}
            >
              {data.products.map((product, index) => (
                <ProductItem
                  key={product.pk}
                  product={product}
                  // TODO: Find a better way to handle layout size
                  width={340}
                  height={510}
                  index={index}
                />
              ))}
            </div>
            {isLoading && (
              <div className="flex justify-center my-6">
                <LoaderSpinner />
              </div>
            )}

            {/* {data.products.length > 0 && data.pagination.num_pages != 1 && data.pagination.current_page !== data.pagination.num_pages && ( */}
            {/* // {data.products.length > 0 && data.pagination.num_pages != 1 && data.pagination.current_page !== data.pagination.num_pages && ( */}
            {data.products.length > 0 && (
              // <Pagination
              //   total={data.pagination.total_count}
              //   limit={data.pagination.page_size}
              //   // limit={pageSize}
              //   currentPage={Number(searchParams.get('page')) || 1}
              //   // currentPage={data.pagination.current_page}
              //   onPageChange={(page) => handlePageChange(page)}
              //   numberOfPages={data.pagination.num_pages}
              //   type="infinite"
              // />
              <Pagination
                total={data.pagination.total_count}
                limit={data.pagination.page_size}
                currentPage={data.pagination.current_page}
                numberOfPages={data.pagination.num_pages}
              />
              // <Pagination
              //   onPageChange={(page) => handlePageChange(page)}
              //   numberOfPages={data.pagination.num_pages}
              //   total={data.pagination.total_count}
              //   containerClassName="justify-end"
              //   currentPage={Number(searchParams.get('page')) || 1}
              //   type="more"
              //   direction="prev"
              //   moreButtonClassName="mt-4"
              // />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
