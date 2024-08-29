
Path: next-zero_original/node_modules/@akinon/next/data/server/product.ts

```
import { Cache, CacheKey } from '../../lib/cache';
import { product } from '../urls';
import {
  // BreadcrumbResultType,
  // ProductCategoryResult,
  ProductResult
} from '../../types';
import appFetch from '../../utils/app-fetch';

type GetProduct = {
  pk: number;
  searchParams?: URLSearchParams;
  groupProduct?: boolean;
};

const getProductDataHandler = ({
  pk,
  searchParams,
  groupProduct
}: GetProduct) => {
  return async function () {
    let url = groupProduct
      ? product.getGroupProductByPk(pk)
      : product.getProductByPk(pk);

    if (searchParams) {
      url +=
        '?' +
        Object.keys(searchParams)
          .map((key) => `${key}=${searchParams[key]}`)
          .join('&');
    }

    const data = await appFetch<ProductResult>(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });

    // const categoryUrl = product.categoryUrl(data.product.pk);

    // const productCategoryData = await appFetch<ProductCategoryResult>(
    //   categoryUrl,
    //   {
    //     headers: {
    //       Accept: 'application/json',
    //       'Content-Type': 'application/json'
    //     }
    //   }
    // );

    // const breadcrumbUrl = product.breadcrumbUrl(
    //   productCategoryData.results[0].menuitemmodel
    // );

    // const breadcrumbData = await appFetch<any>(breadcrumbUrl, {
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json'
    //   }
    // });

    return {
      data,
      // breadcrumbData: breadcrumbData?.menu
    };
  };
};

export const getProductData = async ({
  pk,
  searchParams,
  groupProduct
}: GetProduct) => {
  return Cache.wrap(
    CacheKey[groupProduct ? 'GroupProduct' : 'Product'](
      pk,
      searchParams ?? new URLSearchParams()
    ),
    getProductDataHandler({ pk, searchParams, groupProduct }),
    {
      expire: 300
    }
  );
};

```