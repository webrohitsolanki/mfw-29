'use client';

import { useLocalization } from '@akinon/next/hooks';
import { useGetFavoritesQuery } from '@akinon/next/data/client/wishlist';
import { useSearchParams } from 'next/navigation';
import FavoriteProductsList from '@theme/views/account/favourite-products/favourite-products-list';

const AccountWishlist = () => {
  const { t } = useLocalization();
  const searchParams = useSearchParams();
  const { data: favorites } = useGetFavoritesQuery({
    page: Number(searchParams.get('page')),
    limit: Number(searchParams.get('limit'))
  });

  return (
    <div className="flex-1">
      <div className="bg-gray-150 p-4 lg:p-5">
        <div className="lg:text-3xl text-2xl text-center flex items-center lg:flex-row flex-col">
          <span>{t('account.my_wishlist.header.title')}</span>
          <span className='border_line lg:block hidden'></span>
          <span className='text-sm'>{t('account.my_wishlist.header.subtitle')}</span> 
          <span className='text-sm ms-2' data-testid="favorites-count">({favorites?.count || 0})</span>
        </div>
      </div>
      <FavoriteProductsList />
    </div>
  );
};

export default AccountWishlist;
