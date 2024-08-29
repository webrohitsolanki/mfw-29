import 'server-only';

import FooterCopyright from '@theme/widgets/footer-copyright';
import FooterInfo from '@theme/widgets/footer-info';
import FooterMenu from '@theme/widgets/footer-menu';
import FooterSubscription from '@theme/widgets/footer-subscription';
import FooterBackground from '../../public/images/footer/footer-bg.jpg';
import { Icon } from '@akinon/next/components';
import FooterIcon from '@theme/widgets/footer-icon';


export default function Footer() {
  const backgroundImageUrl = FooterBackground.src;

  return (
    <div className='relative'>
      <FooterIcon />
      <div className='lg:pt-5 lg:border-t relative lg:border-gray' style={{
        backgroundImage: `url(${FooterBackground.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'bottom',
        backgroundRepeat: 'no-repeat',
        width: '100%',
        height: '100%'
      }}>
        <div className='absolute w-full h-full bg-[#C475AB] opacity-70  top-0 left-0 right-0 bottom-0'></div>
        <div className="container lg:px-9 px-2 mx-auto md:flex md:flex-wrap relative z-1">
          <div>
            {/* <FooterInfo /> */}
            <FooterMenu />
          </div>
          {/* <FooterSubscription /> */}
          <FooterCopyright />
        </div>
      </div>
    </div>
  );
}
