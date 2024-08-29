'use client'

import React from 'react';
import { Image } from '@akinon/next/components'; // Ensure this import is correct and accessible during SSR
import Style from './index.module.css'; // Ensure this import is correct and accessible during SSR
import { useGetBasketQuery } from '@akinon/next/data/client/basket'; // Ensure this import is correct and accessible during SSR

export default function OrderSuccessfullContent({ data }) {
  const { data: basket, isLoading, isSuccess } = useGetBasketQuery();

  function calculateTotal(basket) {
    let subTotal = 0;
    let shipping = 0;
    let totalDiscount = 0;
    let totalTax = 0;

    if (basket) {
      // Calculate sub-total
      if (basket.total_amount) {
        subTotal = parseFloat(basket.total_amount);
      }

      // Calculate shipping
      basket.basketitem_set.forEach(item => {
        if (item.shipping_discount) {
          shipping += parseFloat(item.shipping_discount);
        }
      });

      // Calculate total discount
      if (basket.total_discount_amount) {
        totalDiscount = parseFloat(basket.total_discount_amount);
      }

      // Calculate total tax
      basket.basketitem_set.forEach(item => {
        totalTax += parseFloat(item.tax_rate);
      });
    }

    // Calculate total
    const total = subTotal + shipping + totalTax - totalDiscount;
    return total;

  }


  return (
    <div className='container md_container'>
      {/* Ensure consistent rendering of elements */}
      <div className='mx-auto w-full text-center'>
        {data.attributes.order_successfull.map((index, i) => (
          <div key={i} className='my-9'>
            <Image width={10} className={`${Style.order_check_image}`} height={10} src={index.kwargs.value.image.url} alt='Order Successfull' />
            <h2 className='text-2xl'>{index.value.text}</h2>
            <h2 dangerouslySetInnerHTML={{ __html: index.value.subtext }} className='text-xs'></h2>
          </div>
        ))}
      </div>

      <div className='flex-col flex lg:flex-row gap-5'>
        <div className={`lg:w-8/12 w-full border ${Style.order_content}`}>
          <h2 className='p-3'>Order Details</h2>
          <table className='w-full' >
            <tbody>
              <tr className={`uppercase text-center ${Style.tr_head_content}`}>
                <th className={`${Style.tr_head}`}>Products</th>
                <th className={`${Style.tr_head}`}>Price</th>
                <th className={`${Style.tr_head}`}>Quantity</th>
                <th className={`${Style.tr_head}`}>Sub-totals</th>
              </tr>
              {
                basket && basket.basketitem_set.map((item, index) => {
                  // Convert price to number
                  const price = parseFloat(item.product.price);
                  // Convert quantity to number
                  const quantity =item.quantity
                  // Calculate subtotal for each item
                  const subtotal = price * quantity;

                  return (
                    <tr key={index}>
                      <td className=''>
                        <span className='flex items-center gap-3 text-center'>
                          <span>
                            <Image width={10} height={10} className={`${Style.order_successfull_image}`} src={item.product.productimage_set[0].image} alt='' />
                          </span>
                          <span>{item.product.name}</span>
                        </span>
                      </td>
                      <td className='text-center'>
                        {price.toString()} {/* Convert back to string before rendering */}
                      </td>
                      <td className='text-center'>
                        {quantity.toString()} {/* Convert back to string before rendering */}
                      </td>
                      <td className='text-center'>
                        {subtotal.toString()} {/* Convert back to string before rendering */}
                      </td>
                    </tr>
                  );
                })
              }

            </tbody>
          </table>
        </div>
        <div className='lg:w-4/12 w-full border px-3'>
          <h2 className='py-3'>Total</h2>
          <div className='flex justify-between'>
            <p className={`${Style.summary_right_content}`}>Sub-total</p>
            <p className='font-bold'>{basket && basket.total_amount}</p>
          </div>
          <div className='flex mt-2 justify-between'>
            <p className={`${Style.summary_right_content}`}>Shipping</p>
            {
              basket && basket.basketitem_set.map((item, index) => (
                <p key={index} className='font-bold'>
                  {item.shipping_discount ? item.shipping_discount : "Free"}
                </p>
              ))}
          </div>
          <div className='flex mt-2 justify-between'>
            <p className={`${Style.summary_right_content}`}>Discount</p>
            <p className='font-bold'>{basket && basket.total_discount_amount}</p>
          </div>
          <div className='flex mt-2 justify-between'>
            <p className={`${Style.summary_right_content}`}>Tax</p>
            {
              basket && basket.basketitem_set.map((item, index) => (
                <p key={index} className='font-bold'>
                  {item.tax_rate}
                </p>
              ))}
          </div>
          <div className={`${Style.summary_line}`}></div>
          <div className='flex justify-between py-5'>
            <p className={`${Style.summary_right_content}`}>Total</p>
            <p className='font-bold'>{basket && calculateTotal(basket)}</p>
          </div>
        </div>
      </div>

      <div className='flex w-full flex-col border mt-5   lg:flex-row'>
        <div className={`lg:w-4/12 w-full py-9 px-7 ${Style.billing_main_content}`}>
          <div className='w-11/12'>
            <h2 className={`${Style.billing_content}`}>Billing Address</h2>
            <h4 className={`${Style.billing_content_name}`}>Kevin Gilbert</h4>
            <p className={`${Style.billing_content_address}`}>East Tejturi Bazar, Word No. 04, Road No. 13/x, House no. 1320/C, Flat No. 5D, Dhaka - 1200, Bangladesh</p>
            <p className={`${Style.billing_content_address}`}><span className={`${Style.billing_content_name}`}>Phone Number:</span> +1-202-555-0118</p>
            <p className={`${Style.billing_content_address}`}><span className={`${Style.billing_content_name}`}>Email: </span>  kevin.gilbert@gmail.com</p>
          </div>
        </div>
        <div className={`lg:block hidden ${Style.vertival_line}`}></div>

        <div className={`lg:w-4/12 w-full py-9 px-7 ${Style.billing_main_content}`}>
          <div className='w-full mx-auto'>
            <h2 className={`${Style.billing_content}`}>Shipping Address</h2>
            <h4 className={`${Style.billing_content_name}`}>Kevin Gilbert</h4>
            <p className={`${Style.billing_content_address}`}>East Tejturi Bazar, Word No. 04, Road No. 13/x, House no. 1320/C, Flat No. 5D, Dhaka - 1200, Bangladesh</p>
            <p className={`${Style.billing_content_address}`}><span className={`${Style.billing_content_name}`}>Phone Number:</span> +1-202-555-0118</p>
            <p className={`${Style.billing_content_address}`}><span className={`${Style.billing_content_name}`}>Email: </span>  kevin.gilbert@gmail.com</p>
          </div>
        </div>
        <div className={` lg:block hidden ${Style.vertival_line}`}></div>
        <div className={`lg:w-4/12 w-full py-9 px-7 ${Style.billing_main_content_three}`}>
          <div>
            <h2 className={` text-left ${Style.billing_content}`}>Payment Method</h2>
            <div className='flex items-center mt-3 gap-2'><span className='flex'><Image width={10} height={10} src='images/local/CreditCard.svg' className={`${Style.credit_card_image}`} alt='Debit/Credit Card' /></span><span>Debit/Credit Card Ending 8002</span></div>
          </div>
        </div>
      </div>
    </div >
  );
}
