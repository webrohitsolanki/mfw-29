'use client';

import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  useAddFavoriteMutation,
  useGetFavoritesQuery,
  useRemoveFavoriteMutation
} from '@akinon/next/data/client/wishlist';
import { Icon } from '@theme/components';
import { pushAddToWishlist } from '@theme/utils/gtm';
import { Button } from '@akinon/next/components';

interface FavButtonProps {
  label?: string;
  size?: number;
  className?: string;
}

const useFavButton = (productPk: number) => {
  const { status } = useSession();

  const { data: favorites } = useGetFavoritesQuery(
    {
      limit: 1000
    },
    { skip: status !== 'authenticated' }
  );

  const favoriteItem = useMemo(
    () =>
      favorites?.results?.find(
        (item) => Number(item.product.pk) === Number(productPk)
      ),
    [favorites, productPk]
  );

  const [isActive, setIsActive] = useState(Boolean(favoriteItem));
  const [isPushed, setIsPushed] = useState<boolean>(false);

  const [addFavorite] = useAddFavoriteMutation();
  const [removeFavorite] = useRemoveFavoriteMutation();

  const handleClick = useCallback(async () => {
    try {
      if (favoriteItem) {
        await removeFavorite(favoriteItem.pk);
      } else {
        await addFavorite(productPk);
        setIsPushed(true);
      }
    } catch (error) {
      console.error('Failed operation:', error);
    }
  }, [favoriteItem, productPk, addFavorite, removeFavorite]);

  useEffect(() => {
    setIsActive(Boolean(favoriteItem));
  }, [favoriteItem]);

  useEffect(() => {
    if (favoriteItem && !isActive && isPushed) {
      setIsActive(true);
      pushAddToWishlist(
        // base_code: favoriteItem?.product?.base_code,
        // name: favoriteItem?.product?.name,
        // price: favoriteItem?.product?.price,
        // currency_type: favoriteItem?.product?.currency_type
        favoriteItem?.product

      );
    }
  }, [favoriteItem, isActive, isPushed]);

  const FavButton = useMemo(() => {
    const View = (props: FavButtonProps) => (
      <Button
        // className={clsx(
        //   'flex items-center hover:text-secondary-hover hover:cursor-pointer',
        //   props.className
        // )}
        className={clsx(
          'h-10 z-[20] flex items-center w-full justify-center fill-primary-foreground',
          'hover:fill-primary sm:relative sm:w-full sm:mt-3 sm:font-regular pinkbtn'
        )}
        onClick={handleClick}
        data-testid="favourites-icon"
      >
        {/* <Icon
          name={isActive ? 'heart-full' : 'heart-stroke'}
          className={clsx('lg:text-2xl text-base md:text-xl hover:fill-secondary-hover')}
        /> */}
        <span>{isActive ? 'Remove From Wishlist' : 'Add To Wishlist'}</span>
        {props.label && <span className="ml-2">{props.label}</span>}
      </Button>
    );

    return View;
  }, [isActive, handleClick]);

  return {
    FavButton
  };
};

export default useFavButton;
