// import { useGetBasketQuery } from '@akinon/next/data/client/basket';
import { getProductData, getWidgetData } from '@akinon/next/data/server';
import { withSegmentDefaults } from '@akinon/next/hocs/server';
import { PageProps, Metadata } from '@akinon/next/types';
import { generateJsonLd } from '@theme/utils/generate-jsonld';
import { AccordionWrapper, ProductInfo } from '@theme/views/product';
import ProductLayout from '@theme/views/product/layout';

export async function generateMetadata({
  params,
  searchParams
}: PageProps<{ pk: number }>) {
  let result: Metadata = {};

  try {
    const {
      data: { product }
    } = await getProductData({
      pk: params.pk,
      searchParams
    });

    result = {
      title: product.name,
      description: String(product.attributes.description),
      twitter: {
        title: product.name,
        description: String(product.attributes.description)
      },
      openGraph: {
        title: product.name,
        description: String(product.attributes.description),
        images: product.productimage_set?.map((item) => ({
          url: item.image
        }))
      }
    };

    // eslint-disable-next-line no-empty
  } catch (error) {}

  return result;
}

async function Page({ params, searchParams }: PageProps<{ pk: number }>) {
  const [{ data }, deliveryReturn] = await Promise.all([
    getProductData({
      pk: params.pk,
      searchParams
    }),
    getWidgetData({ slug: 'product-delivery-returns' })
  ]);

  const jsonLd = generateJsonLd(data.product);

  return (
    <>
      <ProductLayout data={data}>
        <div className="flex flex-col items-left">
          <h1
            className="mt-4 lg:text-2xl text-base text-left md-mt-0 font-semibold text-[#003744] "
            data-testid="product-name"
          >
            {data.product.name}
          </h1>

          <p
            className="mt-2 lg:text-1xl text-base text-left md-mt-0"
            data-testid="product-description"
          >
            {data.product.attributes.tags}
          </p>

          <ProductInfo data={data} />

          <AccordionWrapper
            data={data}
            deliveryReturn={deliveryReturn?.attributes}
          />
        </div>
      </ProductLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}

export default withSegmentDefaults(Page, { segmentType: 'page' });
