import 'server-only';

import { BEAUTY_WELLNESS_WIDGETS } from '@theme/widgets/beauty-wellness-service';
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
    slug: 'widget-beauty-wellness-service'
  });

  if (!data?.attributes?.widget_order) {
    return null;
  }

  return data.attributes.widget_order.map((widget, index) => {
    const Widget = BEAUTY_WELLNESS_WIDGETS[widget.value.item_slug];

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


