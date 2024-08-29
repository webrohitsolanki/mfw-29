import { useGetProductByPkQuery } from '@akinon/next/data/client/product';
import { useRemoveFavoriteMutation } from '@akinon/next/data/client/wishlist';
import { useAddProductToBasket } from '../../hooks';
import clsx from 'clsx';
import { FavoriteItem as FavoriteItemType } from '@akinon/next/types';
import {
  Price,
  Button,
  Icon,
  Select,
  Skeleton,
  SkeletonWrapper,
  Link
} from '@theme/components';
import { useLocalization } from '@akinon/next/hooks';
import { Image } from '@akinon/next/components/image';
import { useState } from 'react';
interface Props {
  item: FavoriteItemType;
  index: number;
}

// item.produt is the product come from the favorites endpoint
// data.product is the product come from the product endpoint
// these are different because the favorites endpoint does not have the product variant and selected variants etc.

export const FavoriteItem = (props: Props) => {
  const { t } = useLocalization();
  const { item, index } = props;

  const [selectedProduct, setProduct] = useState(item.product);
  const { data, isLoading, isSuccess } = useGetProductByPkQuery(
    selectedProduct.pk
  );
  const [removeFavorite, { isLoading: isRemoveFavoriteLoading }] =
    useRemoveFavoriteMutation();
  const [addProductToBasket, { isLoading: isAddProductToBasketLoading }] =
    useAddProductToBasket();

  const handleOnClick = (selectedProduct, favoriteProduct) => {
    if (
      favoriteProduct.product.attributes.color ===
      selectedProduct.attributes.color ||
      favoriteProduct.product.pk === selectedProduct.pk
    )
      removeFavorite(favoriteProduct.pk);

    addProductToBasket({
      product: selectedProduct.pk,
      quantity: 1,
      attributes: {}
    });
  };

  return (
    <tr className='mt-2'>
      <td className='w-5/12 py-2'>
        <div className='flex items-center mr-2 gap-2'>
          <div className="relative h-full flex items-center w-[100px]">
            <Link href={selectedProduct.absolute_url} className="w-full h-full ">
              {selectedProduct.productimage_set[0] ? (
                <Image
                  src={selectedProduct.productimage_set[0]?.image}
                  alt={selectedProduct.name}
                  aspectRatio={192 / 280}
                  fill
                  className='h-[80px]'
                  crop="center"
                  sizes='true'
                />
              ) : (
                <Image
                  src="/noimage.jpg"
                  fill
                  aspectRatio={192 / 280}
                  alt={t('account.base.no_image')}
                  className="h-[80px]"
                />
              )}
            </Link>
          </div>
          <div
            data-testid={`favorites-variant-${selectedProduct.pk}-${index}`}
            className="flex items-center justify-between w-full"
          >
            <div className="text-base ">
              <Link
                href={selectedProduct.absolute_url}
                data-testid="favorites-product-name"
              >
                {selectedProduct.name}
              </Link>
            </div>
          </div>
        </div>
      </td>
      <td className='lg:w-2/12 w-full py-2 mx-auto'>
        <div className=' text-sm'>
          <span className="font-semibold mr-3 text-nowrap" >
            <Price value={selectedProduct.price} />
          </span>
          {parseFloat(selectedProduct.retail_price) >
            parseFloat(selectedProduct.price) && (
              <span className="font-normal line-through text-nowrap favourite_size text-gray-600">
                <Price value={selectedProduct.retail_price} />
              </span>
            )}

        </div>
      </td>
      <td className='lg:w-2/12 w-3/12 ps-3 py-2'>
        <span style={{ color: item.product.stock > 0 ? '#2DB224' : 'red' }}>
          {item.product.stock > 0 ? 'In Stock' : 'Out Of Stock'}
        </span>
      </td>
      <td className='lg:w-2/12 w-full  py-2'>
        {isLoading && (
          <SkeletonWrapper className="gap-2">
            <SkeletonWrapper>
              <Skeleton className="w-full h-10 mt-2" />
              <Skeleton className="w-full h-10 mt-2" />
            </SkeletonWrapper>
            <Skeleton className="w-full h-10" />
          </SkeletonWrapper>
        )}

        {isSuccess && (
          <div className="flex  flex-col mr-2 gap-2">
            {/* <div className="flex flex-col">
                    {data.variants.map((variant, i) => {
                      const variantOptions = variant.options
                        .filter(option => option.is_selectable && option.label !== "NotInUse")
                        .map((option) => ({
                          is_selected: option.is_selected,
                          label: option.label,
                          value: option.value
                        }));

                      if (variantOptions.length === 0) {
                        return null; // Skip rendering this Select component
                      }

                      return (
                        <Select
                          className="w-full mt-2"
                          key={i}
                          options={variantOptions}
                          defaultValue={selectedProduct.attributes[variant.attribute_key]}
                          onChange={(e) => {
                            const selectedProduct = variant.options.find(
                              ({ label }) => label === e.currentTarget.value
                            )?.product;

                            setProduct(selectedProduct);
                          }}
                        />
                      );
                    })}
                  </div> */}

            <Button
              disabled={
                !selectedProduct.in_stock || isAddProductToBasketLoading
              }
              appearance="outlined"
              type="submit"
              className={clsx(
                'w-full pinkbtn flex items-center gap-2',
                !selectedProduct.in_stock &&
                'hover:bg-transparent hover:text-black'
              )}
              onClick={() => handleOnClick(selectedProduct, item)}
              data-testid="favorites-add-cart"
            >
              <span className='text-nowrap'>Add to Cart</span>
              <span><Icon name='cart' size={14} /></span>
            </Button>
          </div>
        )}
      </td>
      <td className='w-[1%]'>
        <div className='border grid place-items-center w-[20px] h-[20px]  border-gray-400 p-1 rounded-full '>
          <Icon
            name="close"
            size={8}
            onClick={() => removeFavorite(item.pk)}
            className={clsx(
              ' cursor-pointer mx-auto  justify-end',
              isRemoveFavoriteLoading
                ? 'pointer-events-none hover:cursor-wait' // TODO: Cursors not working fix!
                : 'hove:cursor-pointer'
            )}
            data-testid="favorites-remove"
          />
        </div>
      </td>
    </tr>
  );
};


// import { useGetProductByPkQuery } from '@akinon/next/data/client/product';
// import { useRemoveFavoriteMutation } from '@akinon/next/data/client/wishlist';
// import { useAddProductToBasket } from '../../hooks';
// import clsx from 'clsx';
// import { FavoriteItem as FavoriteItemType } from '@akinon/next/types';
// import {
//   Price,
//   Button,
//   Icon,
//   Select,
//   Skeleton,
//   SkeletonWrapper,
//   Link
// } from '@theme/components';
// import { useLocalization } from '@akinon/next/hooks';
// import { Image } from '@akinon/next/components/image';
// import { useState } from 'react';
// interface Props {
//   item: FavoriteItemType;
//   index: number;
// }

// // item.produt is the product come from the favorites endpoint
// // data.product is the product come from the product endpoint
// // these are different because the favorites endpoint does not have the product variant and selected variants etc.

// export const FavoriteItem = (props: Props) => {
//   const { t } = useLocalization();
//   const { item, index } = props;
//   const [selectedProduct, setProduct] = useState(item.product);
//   const { data, isLoading, isSuccess } = useGetProductByPkQuery(
//     selectedProduct.pk
//   );
//   const [removeFavorite, { isLoading: isRemoveFavoriteLoading }] =
//     useRemoveFavoriteMutation();
//   const [addProductToBasket, { isLoading: isAddProductToBasketLoading }] =
//     useAddProductToBasket();

//   const handleOnClick = (selectedProduct, favoriteProduct) => {
//     if (
//       favoriteProduct.product.attributes.color ===
//       selectedProduct.attributes.color ||
//       favoriteProduct.product.pk === selectedProduct.pk
//     )
//       removeFavorite(favoriteProduct.pk);

//     addProductToBasket({
//       product: selectedProduct.pk,
//       quantity: 1,
//       attributes: {}
//     });
//   };

//   return (
//     <div className="w-full flex mb-8 px-3 ">
//       <table className='w-full flex'>
//         <div className="relative mb-3 h-full flex items-center">
//           <Link href={selectedProduct.absolute_url} className="w-full h-full">
//             {selectedProduct.productimage_set[0] ? (
//               <Image
//                 src={selectedProduct.productimage_set[0]?.image}
//                 alt={selectedProduct.name}
//                 aspectRatio={192 / 280}
//                 fill
//                 crop="center"
//                 sizes="(min-width: 425px) 216px,
//               (min-width: 475px) 264px,
//               (min-width: 768px) 356px,
//               (min-width: 1024px) 80px,
//               (min-width: 1170px) 260px,
//               (min-width: 1370px) 352px, 192px"
//               />
//             ) : (
//               <Image
//                 src="/noimage.jpg"
//                 fill
//                 aspectRatio={192 / 280}
//                 sizes="(min-width: 425px) 216px,
//               (min-width: 475px) 264px,
//               (min-width: 768px) 356px,
//               (min-width: 1024px) 80px,
//               (min-width: 1170px) 260px,
//               (min-width: 1370px) 352px, 192px"
//                 alt={t('account.base.no_image')}
//                 className="object-cover"
//               />
//             )}
//           </Link>

//           <Icon
//             name="close"
//             size={14}
//             onClick={() => removeFavorite(item.pk)}
//             className={clsx(
//               'absolute top-4 right-4 cursor-pointer',
//               isRemoveFavoriteLoading
//                 ? 'pointer-events-none hover:cursor-wait' // TODO: Cursors not working fix!
//                 : 'hove:cursor-pointer'
//             )}
//             data-testid="favorites-remove"
//           />
//         </div>

//         <div
//           data-testid={`favorites-variant-${selectedProduct.pk}-${index}`}
//           className="flex flex-1 flex-col justify-between"
//         >
//           <div className="text-sm">
//             <Link
//               href={selectedProduct.absolute_url}
//               data-testid="favorites-product-name"
//             >
//               {selectedProduct.name}
//             </Link>
//           </div>

//           <div>
//             {parseFloat(selectedProduct.retail_price) >
//               parseFloat(selectedProduct.price) && (
//                 <span className="font-normal line-through mr-3">
//                   <Price value={selectedProduct.retail_price} />
//                 </span>
//               )}
//             <span className="font-semibold">
//               <Price value={selectedProduct.price} />
//             </span>
//           </div>

//           {isLoading && (
//             <SkeletonWrapper className="gap-2">
//               <SkeletonWrapper>
//                 <Skeleton className="w-full h-10 mt-2" />
//                 <Skeleton className="w-full h-10 mt-2" />
//               </SkeletonWrapper>
//               <Skeleton className="w-full h-10" />
//             </SkeletonWrapper>
//           )}

//           {isSuccess && (
//             <div className="flex flex-col gap-2">
//               <div className="flex flex-col">
//                 {data.variants.map((variant, i) => {
//                   const variantOptions = variant.options
//                     .filter(option => option.is_selectable && option.label !== "NotInUse")
//                     .map((option) => ({
//                       is_selected: option.is_selected,
//                       label: option.label,
//                       value: option.value
//                     }));

//                   if (variantOptions.length === 0) {
//                     return null; // Skip rendering this Select component
//                   }

//                   return (
//                     <Select
//                       className="w-full mt-2"
//                       key={i}
//                       options={variantOptions}
//                       defaultValue={selectedProduct.attributes[variant.attribute_key]}
//                       onChange={(e) => {
//                         const selectedProduct = variant.options.find(
//                           ({ label }) => label === e.currentTarget.value
//                         )?.product;

//                         setProduct(selectedProduct);
//                       }}
//                     />
//                   );
//                 })}
//               </div>

//               <Button
//                 disabled={
//                   !selectedProduct.in_stock || isAddProductToBasketLoading
//                 }
//                 appearance="outlined"
//                 type="submit"
//                 className={clsx(
//                   'w-full',
//                   !selectedProduct.in_stock &&
//                   'hover:bg-transparent hover:text-black'
//                 )}
//                 onClick={() => handleOnClick(selectedProduct, item)}
//                 data-testid="favorites-add-cart"
//               >
//                 {t('account.my_wishlist.submit_button')}
//               </Button>
//             </div>
//           )}
//         </div>
//       </table>
//     </div>
//   );
// };
