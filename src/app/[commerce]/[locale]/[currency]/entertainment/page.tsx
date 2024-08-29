import 'server-only';

import { ENTERTAINMENT_WIDGETS } from '@theme/widgets/entertainment';
import { getWidgetData } from '@akinon/next/data/server';
import { withSegmentDefaults } from '@akinon/next/hocs/server';
import LazyComponent from '@akinon/next/components/lazy-component';

type HomeWidgetOrderType = {
  widget_order: Array<{
    value: { item_slug: string };
    kwargs: { value: object; data_type: string };
  }>;
};

export const dynamic = 'force-static';
export const revalidate = 600;

async function Page() {
  const data = await getWidgetData<HomeWidgetOrderType>({
    slug: 'entertainment-widgets'
  });

  if (!data?.attributes?.widget_order) {
    return null;
  }


  
  return data.attributes.widget_order.map((widget, index) => {
    const Widget = ENTERTAINMENT_WIDGETS[widget.value.item_slug];

    if (Widget) {
      if (index > 2) {
        return (
          <LazyComponent key={widget.value.item_slug} className="min-h-[150px]">
            <Widget />
          </LazyComponent>
        );
      }

      return <Widget key={widget.value.item_slug} />;
    }

    return null;
  });
}

export async function generateStaticParams() {
  return [];
}

export default withSegmentDefaults(Page, { segmentType: 'page' });



// import { getListData } from '@akinon/next/data/server';
// import { PageProps } from '@akinon/next/types';
// import ListPage from '@theme/views/entertainment/category-info';
// import EntertainmentMain from '@theme/widgets/entertainment/entertainment-content';
// import React from 'react'

// async function EntertanimentContent() {
//   // const searchParams = new URLSearchParams();
//   // searchParams.set('category_ids', '523718');

//   // const data = await getListData({ searchParams });

//   return (
//     <>
//       <EntertainmentMain />
//       {/* <ListPage data={data} /> */}
//     </>
//   );
// }
// export default EntertanimentContent