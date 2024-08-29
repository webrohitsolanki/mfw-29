'use client';

import { useEffect, useState } from 'react';
import {
    pushAddToCart,
    pushProductViewed,
    pushProductListProductViewed
} from '@theme/utils/gtm';
import { useInView } from 'react-intersection-observer';
import { Product } from '@akinon/next/types';
import { Image } from '@akinon/next/components/image';
import { Price, Link } from '@theme/components';
import Styled from 'styled-components'
import { useAddProductToBasket } from '@theme/hooks';
import { useAddStockAlertMutation } from '@akinon/next/data/client/wishlist';
import { Button } from '@akinon/next/components';
import useFavButton from '@theme/hooks/use-fav-button';

interface Props {
    product: Product;
    width?: number;
    height?: number;
    index: number;
}

export const ProductMobileItem = (props: Props) => {
    const [showPopup, setShowPopup] = useState(false);
    // TODO: Static image will change (TR)
    const { product, width, height, index } = props;

    const [viewed, setViewed] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const { FavButton } = useFavButton(product.pk);
    const { ref, inView } = useInView();
    const [productError, setProductError] = useState(null);
    const [addProductToCart, { isLoading: isAddToCartLoading }] = useAddProductToBasket();
    const [addStockAlert, { isLoading: isAddToStockAlertLoading }] = useAddStockAlertMutation();

    const image_url = product.productimage_set[0]?.image;
    const absolute_url = product.absolute_url;
    const product_name = product.name;
    const retail_price = product.retail_price;
    const price = product.price;

    useEffect(() => {
        if (!viewed && inView) {
            setViewed(true);
            pushProductListProductViewed(product);
        }
    }, [inView]);
    const handleAddToCart = async () => {
        setShowPopup(true);
        pushProductViewed(product);
        setSelectedProduct(product);
        try {
            await addProductToCart({
                product: product.pk,
                quantity: 1,
                attributes: {}
            });

            pushAddToCart(product);
            setShowPopup(true);
        } catch (error) {
            setProductError(
                error?.data?.non_field_errors ||
                Object.keys(error?.data).map(
                    (key) => `${key}: ${error?.data[key].join(', ')}`
                )
            );
        }
    };

    // const handleNavigate = () => {
    //   navigate('/orders/checkout' , {state: {message:product.pk}});
    // };

    // const handleProductClick = () => {
    //   pushProductViewed(product);
    //   setSelectedProduct(product);
    //   setShowPopup(true);
    // };

    return (
        <Wrapper>
            <div
                className="text-sm text-left flex flex-col h-full"
                data-testid="product-box"
                ref={ref}
            >
                <div className="relative mb-3 border-pink-400 h-full">
                    <Link href={absolute_url} onClick={() => pushProductViewed(product)}>

                        {image_url ? (
                            <Image

                                fill
                                loading="lazy"
                                src={image_url}
                                alt={product_name}
                                aspectRatio={1}
                                sizes="auto"
                                crop="center"
                            />
                        ) : (
                            <Image
                                className="h-full"
                                src="/noimage.jpg"
                                fill
                                aspectRatio={1}
                                sizes="auto"
                                alt={product_name}
                                imageClassName="object-cover"
                            />
                        )}
                    </Link>
                    <FavButton className="absolute top-4 right-4" />
                </div>
                <div>
                    {/* <Link
                        href={absolute_url}
                        className='listing_text text-base'
                        data-testid={`${product_name}-${index}`}
                        onClick={() => pushProductViewed(product)}
                    >
                        {product_name}
                    </Link> */}
                    <div className="font-semibold mt-1">
                        {parseFloat(retail_price) > parseFloat(price) && (
                            <Price
                                value={"$" + retail_price}
                                className="font-normal line-through mr-3"
                            />
                        )}
                        <span className='listing_text'>$ <Price value={`${"$" + price}`} data-testid="product-price" className='listing_text' /></span>
                        <Button className='pinkbtn w-full font-normal uppercase py-5 rounded-none'>
                            <Link href={{ pathname: '/orders/checkout', query: { productId: product.pk } }}>
                                Buy Now
                            </Link>
                        </Button>
                        <Button
                            disabled={isAddToCartLoading || isAddToStockAlertLoading}
                            className='bluebtn mt-1 font-normal flex justify-center items-center w-full uppercase rounded-none add_to_cart_text'
                            onClick={() => handleAddToCart()}>
                            <Image width={20} className='w-[15px] h-[15px] p-[1px] mr-1' height={20} src={'images/listing/add-to-cart.svg'} alt='' />
                            Add to cart
                        </Button>
                        {showPopup && selectedProduct && (
                            <div className="relative pop_up border rounded p-4 top-0 right-10">
                                <div className='flex gap-2 items-center'>
                                    <div>
                                        <Image src={selectedProduct.productimage_set[0]?.image || '/noimage.jpg'} width={30} className='pop_up_image' sizes='10vw' height={30} aspectRatio={1} alt={selectedProduct.name} />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-white">{selectedProduct.name}</div>
                                        <div className="font-normal text-white mt-2">Price: ${selectedProduct.price}</div>
                                    </div>
                                </div>
                                <button onClick={() => setShowPopup(false)} className="p-2 w-full py-2 border"><Link href='/baskets/basket'>View All</Link></button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Wrapper>
    );
};

const Wrapper = Styled.section`
height:100%;
  .listing_text{
    color:#003744;
    font-weight:600;
    margin-bottom:5px;
    width:330px;
  }
  .bluebtn{
    padding:16px 0;
  }
  .react-multi-carousel-item {
    width:260px;
  }
  .pop_up {
    background-color: #b27697;
    border-radius: 10px;
    border: 1px solid #b27697;
    }
    @media screen and (max-width:768px){
        .add_to_cart_text,.listing_text{
            font-size:12px;
        }
        .pop_up_image img{
            width:75px;
            height:75px;
        }
    }
`
