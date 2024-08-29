'use client';

import { useAppDispatch, useAppSelector } from '@akinon/next/redux/hooks';
import { openSearch, setOpenedMenu } from '@akinon/next/redux/reducers/header';
import clsx from 'clsx';
import { MenuItemType } from '@akinon/next/types';
import React, { useEffect, useState } from 'react';
import { CurrencySelect, Icon, Link } from '@theme/components';
import Search from './search';
import { Image } from '@akinon/next/components/image';
import { ROUTES } from '@theme/routes';
import { useRouter, useLocalization } from '@akinon/next/hooks';
import { useGetBasketQuery } from '@akinon/next/data/client/basket';
import MobileHamburgerButton from './mobile-hamburger-button';
import { pushViewCategory } from '@theme/utils/gtm';
// import { useRouter } from 'next/router';

interface NavbarProps {
  menu: MenuItemType[];
}

export default function Navbar(props: NavbarProps) {
  const { menu } = props;
  // const router = useRouter();

  const dispatch = useAppDispatch();
  const { data: basket, isLoading, isSuccess } = useGetBasketQuery();
  const { isSearchOpen, openedMenu } = useAppSelector((state) => state.header);
  const [currentUrl, setCurrentUrl] = useState('');
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [filteredData, setFilteredData] = useState([]);
  const [change, setChange] = useState('');
  const router = useRouter();
  const facets = useAppSelector((state) => state.category.facets);

  const windowurl =
    typeof window !== 'undefined' ? window.location.pathname : '';
  const handleTabClick = (index) => {
    setSelectedTabIndex(index);
    dispatch(setOpenedMenu(null));
  };
  const isActive = (url: string) => {
    const result =
      url.replace('-new', '') === windowurl.replace('-new', '')
        ? 'rounded-[30px] text-white bg-[#EB89B5]'
        : '';
    return result;
  };

  // useEffect(() => {
  //   // setCurrentUrl(window.location.pathname);
  // },[windowurl, change])

  useEffect(() => {
    // setCurrentUrl(window.location.pathname);
    const handleUrlChange = () => {
      setCurrentUrl(window.location.pathname);
    };

    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, [currentUrl, windowurl, change]);

  // useEffect(() => {
  //   if (page > 1 && data.products?.length === 0) {
  //     const newUrl = new URL(window.location.href);
  //     // newUrl.searchParams.delete('page');
  //     router.push(newUrl.pathname + newUrl.search, undefined);
  //   }

  // }, [searchParams, data.products, page]);

  // const handleChildItemClick = (childUrl) => {
  //   dispatch(setOpenedMenu(null));
  //   router.push(`/list?category_ids=${childUrl}&page=1`);
  // };

  const handleChange = (url) => {
    // router.push(url);
  };

  // useEffect(() => {
  //   if (typeof window !== 'undefined') {

  //   }
  // }, [router]);
  // Close the opened menu

  // Navigate to the list page with the selected data type as a query parameter
  // useEffect(() => {
  //   // Add GTM script to head
  //   const script = document.createElement('script');
  //   script.innerHTML = `
  //     (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  //     new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  //     j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  //     'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  //     })(window,document,'script','dataLayer','GTM-WCGBDWC9');
  //   `;
  //   document.head.appendChild(script);

  //   // Add GTM noscript to body
  //   const noscript = document.createElement('noscript');
  //   noscript.innerHTML = `
  //     <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WCGBDWC9"
  //     height="0" width="0" style="display:none;visibility:hidden"></iframe>
  //   `;
  //   document.body.appendChild(noscript);

  //   // Clean up script and noscript tags on component unmount
  //   return () => {
  //     document.head.removeChild(script);
  //     document.body.removeChild(noscript);
  //   };
  // }, []);

  return (
    <div key={change} className="w-full container">
      <nav className="relative w-full items-center mobile_dekstop_view hidden header-grid-area-nav sm:flex justify-between">
        <div>
          <Link href="/">
            <Image
              width={200}
              height={150}
              alt=""
              unoptimized
              className="w-[160px] lg:block hidden"
              src="/images/header/logo.png"
            />
          </Link>
        </div>
        <div className="w-7/12">
          <ul className="flex flex-wrap w-full items-center justify-center ">
            <div>
              <div className="flex justify-center flex-wrap gap-[1px]">
                {menu.map(
                  (item, index) =>
                    item.label != null && (
                      <li
                        key={index}
                        className={`flex font_family text-base items-center px-[10px] py-[4px] relative whitespace-nowrap h-full group ${
                          openedMenu === item.pk
                            ? 'rounded-[30px] text-white bg-[#EB89B5]'
                            : ''
                        } ${isActive(item.url)}`}
                        onMouseEnter={() => {
                          dispatch(setOpenedMenu(item.pk));
                        }}
                        onMouseLeave={() => {
                          dispatch(setOpenedMenu(null));
                        }}
                      >
                        <Link
                          href={item.url}
                          className={`flex items-center gap-1 ms-1 text-base  capitalize ${isActive(
                            item.url
                          )}`}
                          data-testid="navbar-category"
                          onClick={() => {
                            setChange(item.url);
                            handleChange(item.url);
                          }}
                        >
                          {item.extra_context?.attributes?.menu_image?.kwargs
                            ?.url && (
                            <Image
                              src={
                                item.extra_context.attributes.menu_image.kwargs
                                  .url
                              }
                              className="navbar_image_header"
                              width={10}
                              height={10}
                              alt=""
                            />
                          )}
                          {/* <Icon name={item.extra_context.attributes.menu_icon?.value} className='text-[#003744]' size={14} /> */}

                          {item.label}
                        </Link>

                        {openedMenu === item.pk && item.children.length > 0 && (
                          <div
                            className={clsx(
                              [
                                'navbar_text',
                                'container',
                                'absolute',
                                'z-50',
                                'bottom-9',
                                'left-0',
                                'flex',
                                'justify-between',
                                'invisible',
                                'opacity-0',
                                'bg-white',
                                'text-dark',
                                'w-6/10',
                                'border-x-2',
                                'whitespace-nowrap',
                                'border-gray',
                                'pt-22',
                                'rounded-xl',
                                'shadow-slate-100',
                                'p-2',
                                'transform',
                                'translate-y-full',
                                'transition'
                              ],
                              // [
                              //   'before:left-0',
                              //   'before:-translate-x-full',
                              //   'before:content-[""]',
                              //   'before:w-1/2',
                              //   'before:h-full',
                              //   'before:block',
                              //   'before:absolute',
                              //   'before:top-0',
                              //   'before:transform',
                              //   'before:bgwhitey',
                              //   'text-dark'
                              // ],
                              // [
                              //   'after:right-0',
                              //   'after:translate-x-full',
                              //   'after:content-[""]',
                              //   'after:w-1/2',
                              //   'after:h-full',
                              //   'after:block',
                              //   'after:absolute',
                              //   'after:top-0',
                              //   'after:transform',
                              //   'after:bgwhitey',
                              //   'text-dark'
                              // ],
                              {
                                '!visible !opacity-100 delay-500':
                                  openedMenu === item.pk
                              }
                            )}
                          >
                            <div className="flex text-black mx-auto flex-wrap">
                              {item.children.map((child, index) => (
                                <div
                                  key={index}
                                  className="text-center w-[150px]"
                                >
                                  <Link
                                    onClick={() => {
                                      dispatch(setOpenedMenu(null));
                                    }}
                                    href={child.url}
                                    className="block mb-4 font-semibold text-base mt-3 transition-colors mx-auto w-max lg:w-50 hover:text-[#EB89B5]"
                                  >
                                    {child.label}
                                  </Link>

                                  {child.children && (
                                    <ul>
                                      {child.children.map(
                                        (grandChild, index) => (
                                          <li
                                            key={index}
                                            className="p-0 cursor-pointer	"
                                          >
                                            <Link
                                              href={grandChild.url}
                                              onClick={() => {
                                                dispatch(setOpenedMenu(null));
                                                pushViewCategory(grandChild.label)
                                              }}
                                              className="block mb-4 text-base transition-colors w-max mx-auto lg:w-50 hover:text-[#EB89B5]"
                                            >
                                              <span>{grandChild.label}</span>
                                            </Link>
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  )}
                                </div>
                              ))}
                            </div>
                            {item.extra_context.attributes.images && (
                              <div className="flex">
                                {item.extra_context.attributes.images.map(
                                  (image, index) =>
                                    image.kwargs.value.image && (
                                      <Link href={image.value.url} key={index}>
                                        <span className="block mt-4">
                                          {image.value.title}
                                        </span>
                                      </Link>
                                    )
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </li>
                    )
                )}
              </div>
            </div>
            {/* <li>
            <CurrencySelect className="bg-transparent w-16 currency_main px-0 text-sm" />
          </li> */}
          </ul>
        </div>
        <div className="w-2/12">
          <div className="flex justify-center mt-3 w-full">
            <ul className="flex items-center gap-5 w-full">
              <li>
                <CurrencySelect className="bg-transparent px-0 text-sm" />
              </li>
              <li>
                <button
                  onClick={() => dispatch(openSearch())}
                  className="flex items-center gap-2 text-sm uppercase transition hover:text-secondary cursor-pointer"
                  data-testid="header-nav-search"
                >
                  <Icon name="search" size={22} />
                </button>
              </li>
              <li className="hover:text-secondary">
                <Link href="/account">
                  <Icon name="user" size={22} />
                </Link>
              </li>
              <li className="hover:text-secondary relative">
                <Link href="/baskets/basket">
                  <Icon name="cart" size={22} />
                  {basket &&
                    basket.total_quantity !== undefined &&
                    basket.total_quantity !== 0 && (
                      <span className="absolute header_cart">
                        <span className="header_cart_inner">
                          {basket.total_quantity}
                        </span>
                      </span>
                    )}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div>{isSearchOpen && <Search />}</div>
      <div className="mobile_desktop_container h-[70px]">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-3">
            <div>
              <MobileHamburgerButton />
            </div>
            <div className="mobile_header_logo_main">
              <Link href="/">
                <Image
                  width={100}
                  height={90}
                  alt=""
                  unoptimized
                  layout="responsive"
                  className="lg:hidden block"
                  src="/images/header/logo.png"
                />
              </Link>
            </div>
          </div>
          <div className="flex items-center icon_mobile_view gap-5 text-xl">
            <div>
              <CurrencySelect className="bg-transparent text-[#C475AB]  px-0 text-sm" />
            </div>
            <div>
              <button
                onClick={() => dispatch(openSearch())}
                className="flex items-center gap-2 text-sm uppercase transition hover:text-secondary cursor-pointer"
                data-testid="header-nav-search"
              >
                <Icon className="color_pink" name="search" size={16} />
              </button>
            </div>
            <div>
              <Link href="/account">
                <Icon className="color_pink" name="user" size={16} />
              </Link>
            </div>
            <div className="relative mr-4">
              <Link href="/baskets/basket">
                <Icon className="color_pink" name="cart" size={16} />
                {basket && basket.total_quantity !== undefined && (
                  <span className="absolute header_cart text-center">
                    <span className="header_cart_inner">
                      {basket.total_quantity}
                    </span>
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
