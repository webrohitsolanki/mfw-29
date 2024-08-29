const { LocaleUrlStrategy } = require('@akinon/next/localization');
const { ROUTES } = require('@theme/routes');
import { hasFlag } from 'country-flag-icons';
const commerceUrl = encodeURI(process.env.SERVICE_BACKEND_URL ?? 'default');

/** @type {import('@akinon/next/types').Settings} */
module.exports = {
  commerceUrl,
  commonProductAttributes: [
    { translationKey: 'color', key: 'color' },
    { translationKey: 'size', key: 'size' }
  ],
  localization: {
    locales: [
      {
        label: 'EN',
        value: 'en',
        localePath: 'en',
        apiValue: 'en-us',
        rtl: false
      },
      {
        label: 'TR',
        value: 'tr',
        localePath: 'tr',
        apiValue: 'tr-tr',
        rtl: false
      }
    ],
    currencies: [
      {
        label: 'USD',
        code: 'usd',
        flag: hasFlag('US') ? `http://purecatamphetamine.github.io/country-flag-icons/3x2/US.svg` : null
      },
      {
        label: 'TRY',
        code: 'try',
        flag: hasFlag('TR') ? `http://purecatamphetamine.github.io/country-flag-icons/3x2/TR.svg` : null
      },
      {
        label: 'EUR',
        code: 'eur',
        flag: hasFlag('EU') ? `http://purecatamphetamine.github.io/country-flag-icons/3x2/EU.svg` : null
      },
      {
        label: 'GBP',
        code: 'gbp',
        flag: hasFlag('GB') ? `http://purecatamphetamine.github.io/country-flag-icons/3x2/GB.svg` : null
      },
      {
        label: 'JPY',
        code: 'jpy',
        flag: hasFlag('JP') ? `http://purecatamphetamine.github.io/country-flag-icons/3x2/JP.svg` : null
      },
      {
        label: 'AUD',
        code: 'aud',
        flag: hasFlag('AU') ? `http://purecatamphetamine.github.io/country-flag-icons/3x2/AU.svg` : null
      },
      {
        label: 'CAD',
        code: 'cad',
        flag: hasFlag('CA') ? `http://purecatamphetamine.github.io/country-flag-icons/3x2/CA.svg` : null
      },
      {
        label: 'CHF',
        code: 'chf',
        flag: hasFlag('CH') ? `http://purecatamphetamine.github.io/country-flag-icons/3x2/CH.svg` : null
      },
      {
        label: 'CNY',
        code: 'cny',
        flag: hasFlag('CN') ? `http://purecatamphetamine.github.io/country-flag-icons/3x2/CN.svg` : null
      },
      {
        label: 'INR',
        code: 'inr',
        flag: hasFlag('IN') ? `http://purecatamphetamine.github.io/country-flag-icons/3x2/IN.svg` : null
      },
      {
        label: 'MXN',
        code: 'mxn',
        flag: hasFlag('MX') ? `http://purecatamphetamine.github.io/country-flag-icons/3x2/MX.svg` : null
      },
      {
        label: 'NZD',
        code: 'nzd',
        flag: hasFlag('NZ') ? `http://purecatamphetamine.github.io/country-flag-icons/3x2/NZ.svg` : null
      },
      {
        label: 'SGD',
        code: 'sgd',
        flag: hasFlag('SG') ? `http://purecatamphetamine.github.io/country-flag-icons/3x2/SG.svg` : null
      },
      {
        label: 'ZAR',
        code: 'zar',
        flag: hasFlag('ZA') ? `http://purecatamphetamine.github.io/country-flag-icons/3x2/ZA.svg` : null
      }
    ],
    defaultLocaleValue: 'en',
    localeUrlStrategy: LocaleUrlStrategy.HideDefaultLocale,
    redirectToDefaultLocale: true,
    defaultCurrencyCode: 'usd'
  },
  rewrites: [
    {
      source: ROUTES.AUTH,
      destination: '/auth'
    },
    {
      source: ROUTES.BASKET,
      destination: '/basket'
    },
    {
      source: ROUTES.ACCOUNT_ORDERS,
      destination: '/account/orders'
    }
  ],
  redis: {
    defaultExpirationTime: 900 // 15 min
  }
};
