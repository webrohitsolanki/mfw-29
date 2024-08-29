// 'use client';

// import {
//   GTMEvent,
//   Product,
//   GTMUserType,
//   GA4EventParams
// } from '@akinon/next/types';
// import dayjs from 'dayjs';

// //In GA4 this is automatically collected. No need to push it manually for GA4.
// export const pushPageView = (url: string) => {
//   pushEventGA4('page_view', {
//     page_location: url
//   });
// };

// export const pushAddToCart = (product) => {
//   pushEventGA4('add_to_cart', {
//     currency: product?.currency_type,
//     items: [
//       {
//         item_id: product?.base_code?.toString(),
//         item_name: product?.name,
//         price: product?.price,
//         quantity: 1,
//         item_brand: product?.attributes_kwargs?.gender?.value,
//         item_category: product?.attributes?.color,
//         item_variant: product?.sku
//       }
//     ]
//   });
// };

// export const pushRemoveFromCart = (product) => {
//   pushEventGA4('remove_from_cart', {
//     currency: product?.currency_type,
//     items: [
//       {
//         item_id: product?.base_code?.toString(),
//         item_name: product?.name,
//         price: product?.price,
//         quantity: 1,
//         item_brand: product?.attributes_kwargs?.gender?.value,
//         item_category: product?.attributes?.color,
//         item_variant: product?.sku
//       }
//     ]
//   });
// };

// export const pushCartView = (
//   products: Pick<Product, 'name' | 'pk' | 'price' | 'currency_type'>[]
// ) => {
//   const productCurrency = products[0]?.currency_type;
//   pushEventGA4('view_cart', {
//     currency: productCurrency,
//     items: products?.map((product) => ({
//       item_id: product?.pk?.toString(),
//       item_name: product?.name,
//       price: product?.price
//     }))
//   });
// };

// export const pushBeginCheckout = (
//   products: Pick<Product, 'name' | 'pk' | 'price' | 'currency_type'>[]
// ) => {
//   const productCurrency = products[0]?.currency_type;
//   pushEventGA4('begin_checkout', {
//     currency: productCurrency,
//     items: products.map((product) => ({
//       item_id: product?.pk?.toString(),
//       item_name: product?.name,
//       price: product?.price
//     }))
//   });
// };

// export const pushAddShippingInfo = (
//   products: Pick<Product, 'name' | 'pk' | 'price' | 'currency_type'>[]
// ) => {
//   // const productCurrency = products[0]?.currency_type;
//   const productCurrency = products ? products[0]?.currency_type : '';
//   pushEventGA4('add_shipping_info', {
//     currency: productCurrency,
//     items: products?.map((product) => ({
//       item_id: product?.pk?.toString(),
//       item_name: product?.name,
//       price: product?.price
//     }))
//   });
// };

// export const pushAddPaymentInfo = (
//   products: Pick<Product, 'name' | 'pk' | 'price' | 'currency_type'>[],
//   payment_type: string
// ) => {
//   const productCurrency = products[0]?.currency_type;
//   pushEventGA4('add_payment_info', {
//     currency: productCurrency,
//     payment_type,
//     items: products.map((product) => ({
//       item_id: product?.pk?.toString(),
//       item_name: product?.name,
//       price: product?.price
//     }))
//   });
// };

// export const pushProductListProductViewed = (
//   product: Pick<Product, 'name' | 'pk' | 'price'>
// ) => {
//   pushEventGA4('view_item_list', {
//     items: [
//       {
//         item_id: product?.pk?.toString(),
//         item_name: product?.name,
//         price: product?.price
//       }
//     ]
//   });
// };

// export const pushProductClicked = (
//   product: Pick<Product, 'name' | 'pk' | 'price'>
// ) => {
//   pushEventGA4('select_item', {
//     items: [
//       {
//         item_id: product?.pk?.toString(),
//         item_name: product?.name,
//         price: product?.price
//       }
//     ]
//   });
// };

// export const pushProductViewed = (
//   product: Pick<
//     Product,
//     'base_code' | 'sku' | 'name' | 'price' | 'currency_type'
//   >
// ) => {
//   pushEventGA4('view_item', {
//     currency: product.currency_type,
//     items: [
//       {
//         item_id: product?.base_code?.toString(),
//         item_name: product?.name,
//         price: product?.price
//       }
//     ]
//   });
// };

// export const pushAddToWishlist = (
//   product: Pick<Product, 'base_code' | 'name' | 'price' | 'currency_type'>
// ) => {
//   pushEventGA4('add_to_wishlist', {
//     currency: product?.currency_type,
//     items: [
//       {
//         item_id: product?.base_code?.toString(),
//         item_name: product?.name,
//         price: product?.price,
//         quantity: 1
//       }
//     ]
//   });
// };

// const generatePromotionPayload = (promotion) => ({
//   creative_name: promotion?.creative_name,
//   promotion_id: promotion?.promotion_id,
//   promotion_name: promotion?.promotion_name,
//   items: promotion?.items?.map((item) => ({
//     item_id: item?.item_id.toString(),
//     item_name: item?.item_name,
//     price: item?.price,
//     quantity: item?.quantity
//   }))
// });

// export const pushSelectPromotion = (promotion) => {
//   const payload = generatePromotionPayload(promotion);
//   pushEventGA4('select_promotion', payload);
// };

// export const pushViewPromotion = (promotion) => {
//   const payload = generatePromotionPayload(promotion);
//   pushEventGA4('view_promotion', payload);
// };

// export const pushUserData = (
//   value: Pick<
//     GTMUserType,
//     'pk' | 'hashedEmail' | 'dateJoined' | 'gender' | 'emailAllowed'
//   >
// ) => {
//   pushEventGA4('user_data_updated', {
//     user_id: value?.pk.toString(),
//     email_hashed: value?.hashedEmail || '',
//     signup_date: dayjs(value?.dateJoined).format('YYYY-MM-DD'),
//     gender: value?.gender || '',
//     email_permission: value.emailAllowed ? 'yes' : 'no'
//   });
// };

// export const pushPurchaseEvent = (order) => {
//   const transactionId = order?.id?.toString();
//   const currency = order?.currency?.value?.toUpperCase();
//   const totalAmount = Number(order?.amount);

//   const products = order.orderitem_set.map((item) => ({
//     base_code: item?.product.base_code,
//     name: item?.product?.name,
//     price: item?.price,
//     currency_type: item?.price_currency?.value
//   }));

//   pushEventGA4('purchase', {
//     transaction_id: transactionId,
//     currency,
//     value: totalAmount,
//     items: products.map((product) => ({
//       item_id: product?.base_code?.toString(),
//       item_name: product?.name,
//       price: product?.price
//     }))
//   });
// };

// export const pushEvent = (event: GTMEvent) => {
//   const { Category = 'Enhanced Ecommerce', Value = 0, ...rest } = event;

//   window.dataLayer.push({ Category, Value, ...rest });
// };

// export const pushEventGA4 = (
//   eventAction: string,
//   eventParams: GA4EventParams
// ) => {
//   window.dataLayer.push({
//     event: eventAction,
//     ...eventParams
//   });
// };




'use client';

import {
  GTMEvent,
  Product,
  GTMUserType,
  GA4EventParams
} from '@akinon/next/types';
import dayjs from 'dayjs';

export const pushPageView = (url: string) => {
  pushEventGA4('page_view', {
    page_location: url
  });
};


export const pushAddToCart = (product) => {
  pushEventNetCore('add_to_cart', {
    prid: product?.sku,
    prqt: product?.quantity ?? 1,
    image: product?.productimage_set[0]?.image,
    product_name: product?.name,
    category: product?.attributes?.type,
    brand: product?.attributes?.vendor,
    product_url: product?.absolute_url,
    selling_price: parseFloat(product?.price),
    discounted_price: parseFloat(product?.retail_price),
    stock_availability: product?.in_stock ? product?.stock : 0
  });
};

export const pushRemoveFromCart = (product) => {
  pushEventNetCore('remove_from_cart', {
    prid: product?.sku,
    prqt: product?.quantity,
    image: product?.productimage_set[0]?.image,
    product_name: product?.name,
    category: product?.attributes?.type,
    brand: product?.attributes?.vendor,
    product_url: product?.absolute_url,
    selling_price: parseFloat(product?.price),
  });
};

export const pushCartView = (
  products
) => {

  const totalPrqt = products.reduce((total, product) => total + product.quantity, 0);
  const sellingAmount = products.reduce((total, product) => total + product.price * product.quantity, 0);
  const discountAmt = products.reduce((total, product) => total + (product.price - product.retail_price) * product.quantity, 0);
  const amount = sellingAmount - discountAmt;

  pushEventNetCore('view_cart', {
    status: "yes",
    total_prqt: totalPrqt,
    selling_amount: sellingAmount,
    discount_amt: discountAmt,
    amount,
    items: products.map((product) => ({
      prid: product.sku,
      prqt: product.quantity,
      image: product.productimage_set[0]?.image,
      product_name: product.name,
      category: product.attributes.type,
      brand: product.attributes.vendor,
      product_url: product.absolute_url,
      selling_price: product?.price ? parseFloat(product.price).toFixed(2) : 0.00,
      discounted_price: product?.retail_price ? parseFloat(product.retail_price).toFixed(2) : 0.00
    }))
  });
};

export const pushBeginCheckout = (
  products
) => {

  const totalPrqt = products.reduce((total, product) => total + product.quantity, 0);
  const sellingAmount = products.reduce((total, product) => total + product.price * product.quantity, 0);
  const discountAmt = products.reduce((total, product) => total + (product.price - product.retail_price) * product.quantity, 0);
  const amount = sellingAmount - discountAmt;

  pushEventNetCore('begin_checkout', {
    total_prqt: totalPrqt,
    selling_amount: sellingAmount,
    discount_amt: discountAmt,
    amount,
    items: products.map((product) => ({
      prid: product.sku,
      prqt: product.quantity,
      image: product.productimage_set[0]?.image,
      product_name: product.name,
      category: product.attributes.type,
      brand: product.attributes.vendor,
      product_url: product.absolute_url,
      selling_price: product?.price ? parseFloat(product.price).toFixed(2) : 0.00,
      discounted_price: product?.retail_price ? parseFloat(product.retail_price).toFixed(2) : 0.00
    }))
  });
};

export const pushProductListProductViewed = (
  product
) => {
  pushEventNetCore('view_item_list', {
    prid: product?.sku,
    prqt: product.quantity,
    image: product?.productimage_set[0]?.image,
    product_name: product?.name,
    category: product?.attributes?.type,
    brand: product?.attributes?.vendor,
    product_url: product?.absolute_url,
    selling_price: parseFloat(product?.price),
    discounted_price: parseFloat(product?.retail_price),
    stock_availability: product?.in_stock ? product?.stock : 0
  });
};

export const pushProductViewed = (
  product
) => {
    pushEventNetCore('view_item', {
      prid: product?.sku,
      prqt: product.quantity,
      image: product?.productimage_set[0]?.image,
      product_name: product?.name,
      category: product?.attributes?.type,
      brand: product?.attributes?.vendor,
      product_url: product?.absolute_url,
      selling_price: parseFloat(product?.price),
      discounted_price: parseFloat(product?.retail_price),
      stock_availability: product?.in_stock ? product?.stock : 0
    });
};

export const pushAddToWishlist = (
  product
) => {
    pushEventNetCore('add_to_wishlist', {
      prid: product?.sku,
      prqt: product.quantity,
      image: product?.productimage_set[0]?.image,
      product_name: product?.name,
      category: product?.attributes?.type,
      brand: product?.attributes?.vendor,
      selling_price: parseFloat(product?.price),
      product_url: product?.absolute_url,
      discounted_price: parseFloat(product?.retail_price),
      stock_availability: product?.in_stock ? product?.stock : 0
    });
};

const generatePromotionPayload = (promotion) => ({
  creative_name: promotion?.creative_name,
  promotion_id: promotion?.promotion_id,
  promotion_name: promotion?.promotion_name,
  items: promotion?.items?.map((item) => ({
    item_id: item?.item_id.toString(),
    item_name: item?.item_name,
    price: item?.price,
    quantity: item?.quantity
  }))
});

export const pushRegistrationEvent = (user, method) => {
  pushEventNetCore('register', {
    email: user.email,
    mobile: user.phone,
    first_name: user.first_name,
    last_name: user.last_name,
    location: " ",
    gender: user.gender,
    date_of_birth: user.date_of_birth,
    source: 'web',
    // method: method
    method
  })
};

export const pushSignInEvent = (method) => {
  pushEventNetCore('login', {
    source: 'web',
    // method: method
    method
  })
};

export const pushSignOutEvent = () => {
  pushEventNetCore('logout', {
    source: 'web'
  })
};

export const pushPurchaseEvent = (order) => {
  const transactionId = order?.id?.toString();
  const totalAmount = Number(order?.amount);
  const products = order.orderitem_set;
  const totalPrqt = products.reduce((total, product) => total + product.quantity, 0);
  const sellingAmount = products.reduce((total, product) => total + product.price * product.quantity, 0);
  const discountAmt = products.reduce((total, product) => total + (product.price - product.retail_price) * product.quantity, 0);
  const amount = sellingAmount - discountAmt;

  pushEventNetCore('purchase', {
    orderid: transactionId,
    total_prqt: totalPrqt,
    selling_amount: sellingAmount,
    discount_amt: discountAmt,
    amount: totalAmount,
    payment_mode: order.payment_option.payment_type,
    retry: 1,
    source: 'web',
    items: products.map((product) => ({
      prid: product.sku,
      prqt: product.quantity,
      image: product.productimage_set[0]?.image,
      product_name: product.name,
      category: product.attributes.type,
      brand: product.attributes.vendor,
      product_url: product.absolute_url,
      selling_price: product?.price ? parseFloat(product.price).toFixed(2) : 0.00,
      discounted_price: product?.retail_price ? parseFloat(product.retail_price).toFixed(2) : 0.00
    }))
  })
};

export const pushPurchaseFailedEvent = (order) => {
  const transactionId = order?.id?.toString();
  const totalAmount = Number(order?.amount);
  const products = order.orderitem_set;
  const totalPrqt = products.reduce((total, product) => total + product.quantity, 0);
  const sellingAmount = products.reduce((total, product) => total + product.price * product.quantity, 0);
  const discountAmt = products.reduce((total, product) => total + (product.price - product.retail_price) * product.quantity, 0);
  const amount = sellingAmount - discountAmt;

  pushEventNetCore('purchase', {
    orderid: transactionId,
    total_prqt: totalPrqt,
    discount_amt: discountAmt,
    amount: totalAmount,
    payment_mode: order.payment_option.payment_type,
    source: 'web',
  })
};

export const pushOrderCancelledEvent = (order) => {
  const transactionId = order?.id?.toString();
  const totalAmount = Number(order?.amount);
  const products = order.orderitem_set;
  const totalPrqt = products.reduce((total, product) => total + product.quantity, 0);
  const sellingAmount = products.reduce((total, product) => total + product.price * product.quantity, 0);
  const discountAmt = products.reduce((total, product) => total + (product.price - product.retail_price) * product.quantity, 0);
  const amount = sellingAmount - discountAmt;

  pushEventNetCore('purchase', {
    orderid: transactionId,
    total_prqt: totalPrqt,
    discount_amt: discountAmt,
    amount: totalAmount,
    source: 'web',
  })
};

export const pushEvent = (event: GTMEvent) => {
  const { Category = 'Enhanced Ecommerce', Value = 0, ...rest } = event;

  window.dataLayer.push({ Category, Value, ...rest });
};

export const pushProductSearch = (searchText: string) => {
  pushEventNetCore('search', {
    keyword: searchText
  });
};

export const pushViewCategory = (categoryName: string) => {
  pushEventNetCore('view_category', {
    category_name: categoryName
  });
};

export const pushAppliedCoupon = (coupon_detail: string) => {
  pushEventNetCore('coupon_applied', {
    coupon_detail: coupon_detail
    // coupon_detail
  });
};

export const pushEventGA4 = (
  eventAction: string,
  eventParams: GA4EventParams
) => {
  window.dataLayer.push({
    event: eventAction,
    ...eventParams
  });
};

export const pushEventNetCore = (
  eventAction: string,
  eventParams: NetcoreParams
) => {
  window.dataLayer.push({
    event: eventAction,
    ...eventParams
  });
};


export interface NetcoreParams {
  source?: string;
  method?: string;
  screen_name?: string;
  title?: string;
  keyword?: string;
  category_name?: string;
  prid?: string;
  prqt?: number;
  image?: string;
  product_name?: string;
  category?: string;
  brand?: string;
  selling_price?: number;
  discounted_price?: number;
  stock_availability?: number;
  status?: string | number;
  total_prqt?: number;
  selling_amount?: number;
  discount_amt?: number;
  amount?: number;
  items?: {
    prid: string;
    prqt: number;
    image: string;
    product_name: string;
    category: string;
    brand: string;
    product_url: string,
    selling_price: number;
    discounted_price: number;
  }[];
  orderid?: string;
  payment_mode?: string;
  retry?: number;
  userdetail?: string;
  coupon_detail?: string;
  product_url?: string;
  email?: string,
  mobile?: string,
  first_name?: string,
  last_name?: string,
  location?: string,
  gender?: string,
  date_of_birth?: Date,
  pincode?: string,
  city?: string,
}
