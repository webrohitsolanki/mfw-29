import 'server-only';

import { Link, Icon } from '@theme/components';
import { getWidgetData } from '@akinon/next/data/server';

type TargetBlank = {
  value: string;
  data_type: 'dropdown';
};

type FooterSocialItem = [
  {
    // TODO: Refactor this from commerce_proxy
    kwargs: {
      data_type: 'nested';
      value: {
        is_target_blank: TargetBlank;
      };
    };
    value: {
      icon_class?: string;
      site_name: string;
      redirect_url: string;
      is_target_blank: string;
    };
  }
];

type FooterSocialType = {
  social_items: FooterSocialItem;
};

export default async function FooterSocial() {
  const data = await getWidgetData<FooterSocialType>({ slug: 'footer-social' });

  return (
    <div className="flex items-center gap-4 py-1 footer_icon">
      {data?.attributes?.social_items?.map((item, i) => (
        <Link
          key={i}
          href={item?.value?.redirect_url}
          className=" rounded-full md:mr-1 md:last:mr-0"
          target={item?.value?.is_target_blank === 'true' ? '_blank' : '_self'}
        >
          <Icon
            size={22}
            className='icon_footer_all'
            name={item?.value?.icon_class?.replace('pz-icon-', '')}
          />
        </Link>
      ))}
    </div>
  );
}
