import AccountBackButton from '@theme/views/account/back-button';
import AccountMenu from '@theme/views/account/account-menu';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { ROUTES } from 'routes';
import { headers } from 'next/headers';
import { ServerVariables } from '@akinon/next/utils/server-variables';
import { getUrlPathWithLocale } from '@akinon/next/utils/localization';
import Settings from 'settings';

export default async function AccountLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  // const nextHeaders = headers();
  const pageUrl = new URL(
     process.env.NEXT_PUBLIC_URL
    // nextHeaders.get('pz-url') ?? process.env.NEXT_PUBLIC_URL
  );



  const currentLocale = Settings.localization.locales.find(
    (locale) => locale.value === ServerVariables.locale
  );

  if (!session?.user) {
    const callbackUrl = pageUrl.pathname;
    const authRoute = getUrlPathWithLocale(
      ROUTES.AUTH,
      currentLocale.localePath ?? currentLocale.value
    );

    const redirectUrl = `${authRoute}?callbackUrl=${callbackUrl}`;

    return redirect(redirectUrl);
  }

  return (
    <div className="container flex lg:py-10 py-0 lg:px-4 px-2 xl:px-0 main_container_header">
      <AccountMenu />
      <div className="w-full flex-1">
        <AccountBackButton />

        {children}
      </div>
    </div>
  );
}
