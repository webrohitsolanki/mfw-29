import Breadcrumb from '@theme/views/breadcrumb';
import { ProductInfoSlider } from '@theme/views/product';
import { BreadcrumbResultType, ProductResult } from '@akinon/next/types';
import FeatureRecommended from '@theme/widgets/home/feature/feature-reccomendation';

interface DeliveryReturnItem {
  product_delivery_returns?: {
    value: string;
    kwargs: object;
  };
}

export interface ProductPageProps {
  children?: React.ReactNode;
  data: ProductResult;
  breadcrumbData?: BreadcrumbResultType[];
  deliveryReturn?: DeliveryReturnItem | null;
}

export default async function ProductLayout({
  data,
  breadcrumbData,
  children
}: ProductPageProps) {
  return (
    <div className="container mx-auto main_container_header">
      <div className="max-w-5xl mx-auto my-5 px-7">
        <Breadcrumb breadcrumbList={breadcrumbData} />
      </div>
      <div className="grid w-full grid-cols-2 lg:gap-8 mx-auto lg:px-7 px-2">
        <div className="col-span-2 lg:col-span-1">
          <ProductInfoSlider product={data.product} />
        </div>
        <div className="flex flex-col items-center col-span-2 lg:col-span-1">
          <div className="w-full">{children}</div>
        </div>
      </div>
      <div className='mt-5'>
        <FeatureRecommended type={data.product.attributes.type} />
      </div>
    </div>
  );
}
