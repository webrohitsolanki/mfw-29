'use client';

import { useSearchParams } from 'next/navigation';
import { useGetFavoritesQuery } from '@akinon/next/data/client/wishlist';

import { FavoriteItem } from '@theme/views/account';
import { LoaderSpinner } from '@theme/components';
import { useLocalization } from '@akinon/next/hooks';
import { useRouter } from '@akinon/next/hooks';
import { Pagination } from '@akinon/next/components';

const FavoriteProductsList = () => {
  const { t } = useLocalization();
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    data: favorites,
    isLoading,
    isFetching,
    isError
  } = useGetFavoritesQuery({
    page: Number(searchParams.get('page')),
    limit: Number(searchParams.get('limit'))
  });

  if (isError) {
    const newUrl = new URL(window.location.href);

    newUrl.searchParams.delete('page');
    router.push(newUrl.pathname + newUrl.search, undefined);
  }

  if (isLoading || isFetching) {
    return <LoaderSpinner />; // TODO: Fix loader spinner position
  }

  return (
    <>
      {favorites?.count > 0 ? (
        <>
          <div className="flex flex-col mt-6 sm:-mx-3 p-[10px] lg:overflow-hidden overflow-scroll">
            <table className='w-full'>
              <thead className='w-full'>
                <tr className='w-full'>
                  <td>PRODUCTS</td>
                  <td>PRICE</td>
                  <td className='ps-3 lg:pr-0 pr-8 text-nowrap'>STOCK STATUS</td>
                  <td>ACTIONS</td>
                </tr>
              </thead>
              <tbody>
                {favorites.results.map((item, index) => (
                  <FavoriteItem key={item.pk} item={item} index={index} />
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            numberOfPages={Math.ceil(favorites.count / 12)}
            total={favorites.count}
            containerClassName="justify-end"
            currentPage={Number(searchParams.get('page')) || 1}
          />
        </>
      ) : (
        <p
          className="text-center w-full mt-4"
          data-testid="favorites-list-empty"
        >
          {t('account.my_wishlist.empty')}
        </p>
      )}
    </>
  );
};

export default FavoriteProductsList;
