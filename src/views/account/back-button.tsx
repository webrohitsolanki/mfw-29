'use client';

import clsx from 'clsx';
import { Icon, Link } from '@theme/components';
import { usePathname } from 'next/navigation';
import { ROUTES } from 'routes';

export default function AccountBackButton() {
  const pathname = usePathname();
  const accountMenuRegex = new RegExp(`^${ROUTES.ACCOUNT}/?$`).test(pathname);

  return (
    <div
      className={clsx(
        'w-full flex items-center bg-white lg:p-6 p-2 pb-0 md:hidden',
        {
          hidden: accountMenuRegex
        }
      )}
    >
      <Link className="flex items-center" href={ROUTES.ACCOUNT} passHref>
        {/* <Icon name="chevron-start" size={12} className="fill-primary" /> */}
        <Icon name="user" size={23} className="fill-primary ml-1 text-[#C475AB]"  />
      </Link>
    </div>
  );
}
