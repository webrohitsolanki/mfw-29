import 'server-only';

import clsx from 'clsx';
import { ROUTES } from '@theme/routes';
import { menuGenerator } from '@akinon/next/utils';
import { Icon, Link } from '@theme/components';
import { useGetBasketQuery } from '@akinon/next/data/client/basket';
import HeaderBand from './band';
import MobileHamburgerButton from './mobile-hamburger-button';
import MobileMenu from './mobile-menu';
import Navbar from './navbar';
import { getMenu } from '@akinon/next/data/server';
import { Image } from '@akinon/next/components/image';
import IconMobile from './icon-mobile';

export default async function Header() {
  const response = await getMenu();
  const menu = menuGenerator(response);
  // const { data: basket, isLoading, isSuccess } = useGetBasketQuery();

  return (
    <header className="container_md fixed w-full z-50 bg-white">

      {/* <div className='text-2xl text-center py-4 bg-[#c576ac] text-white bold'>
        <h1>Welcome to Mall For Women</h1>
      </div> */}
      <div
        className={clsx([
          'mx-auto',
          'header-m-template-cols',
          'flex',
          'w-full',
          'justify-center',
          // 'mb-5',
          // 'border-gray-100',
          // 'before:hidden',
          // 'before:absolute',
          // 'before:top-0',
          // 'before:left-0',
          // 'before:w-full',
          // 'before:bg-gray-100',
          // 'before:h-9',
          // 'before:z-[-1]',
          // 'before:content-[""]',
          // 'sm:grid-cols-3',
          // 'sm:container',
          // 'sm:before:block'
        ])}
      >
      
        <MobileMenu menu={menu} />
        <div className='header_none w-full mobile_dekstop_border'>
          <Navbar menu={menu} />
        </div>
      </div>
    </header>
  );
}

