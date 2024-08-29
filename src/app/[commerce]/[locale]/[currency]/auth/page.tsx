// 'use client';

// import { Login } from '@theme/views/login';
// import { Register } from '@theme/views/register';
// import { useSession } from 'next-auth/react';
// import { useSearchParams } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import { useLocalization, useRouter } from '@akinon/next/hooks';
// import clsx from 'clsx';
// import { twMerge } from 'tailwind-merge';
// import { Button } from '@theme/components';
// import { Image } from '@akinon/next/components';

// export default function Auth() {
//   const { data: session } = useSession();
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const { t } = useLocalization();
//   const [activeTab, setActiveTab] = useState('login');

//   const tabClass = (tabName) => {
//     return twMerge(
//       clsx(
//         'text-base font-normal text-primary-800 bg-white px-7 border-0 py-4 h-auto relative',
//         {
//           'bg-white before:w-full before:bg-white before:h-2 border-0 text-white bg-[#C475AB] before:-bottom-1 before:left-0 before:absolute':
//             activeTab === tabName
//         }
//       )
//     );
//   };

//   useEffect(() => {
//     if (session?.user) {
//       router.push(searchParams.get('callbackUrl') ?? '/');
//     }
//   }, [session?.user]);

//   return (
//     <section className=" px-4  lg:px-0 lg:mx-auto main_container_header">
//       <div className="w-full flex justify-center gap-3 md:hidden ">
//         <Button
//           className={tabClass('login')}
//           onClick={() => setActiveTab('login')}
//         >
//           Login In
//         </Button>
//         <Button
//           className={tabClass('register')}
//           onClick={() => setActiveTab('register')}
//         >
//           Sign In
//         </Button>
//       </div>
//       <div className="w-full flex border md:border-0 relative mb:20px lg:mb-0">
//         <Image width={100} height={100} alt='' src='/images/local/auth-background.svg' className='bg_auth lg:block hidden' />
//         <Image width={100} height={100} alt='' src='/images/local/login-logo.svg' className='bg_auth_logo lg:block hidden' />
//         <div
//           className={twMerge(
//             clsx('w-full md:block md:w-1/2 h-auto ', {
//               hidden: activeTab !== 'register'
//             })
//           )}
//         >
//           {/* Rk: login_bg class removed */}
//           {/* <Image src='/images/local/login-bg.svg' alt="bg_image" width={100} height={100} className='object-cover h-full login_bg_image'></Image> */}
//           <Register />
//         </div>
//         <div
//           className={twMerge(
//             clsx('w-full md:block md:w-1/2  login_form', {
//               hidden: activeTab !== 'login'
//             })
//           )}
//         >
//           <Login />
//         </div>
//       </div>
//     </section>
//   );
// }

'use client';

import { Login } from '@theme/views/login';
import { Register } from '@theme/views/register';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRouter } from '@akinon/next/hooks';
// import { useLocalization, useRouter } from '@akinon/next/hooks';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Button } from '@theme/components';
// import GuestLogin from '@theme/views/guest-login';
import { Image } from '@akinon/next/components';

export default function Auth() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  // const { t } = useLocalization();
  const [activeTab, setActiveTab] = useState('login');

  const tabClass = (tabName) => {
    return twMerge(
      clsx(
        'text-base font-normal text-primary-800 px-7 py-4 border border-[#C475AB] bg-white h-auto relative',
        {
          'bg-[#C475AB] before:w-full text-white before:bg-[#C475AB] hover:bg-[#C475AB] hover:text-white    before:-bottom-1 border-0 before:left-0 before:absolute':
            activeTab === tabName
        }
      )
    );
  };

  useEffect(() => {
    if (session?.user) {
      router.push(searchParams.get('callbackUrl') ?? '/');
    }
  }, [session?.user]);

  return (
    <section className="px-4 my-7 md:mt-20 lg:px-0 lg:mx-auto main_container_header">
      <div className="w-full flex justify-center gap-3 md:hidden">
        <Button
          className={tabClass('login')}
          onClick={() => setActiveTab('login')}
        >
          Log In
        </Button>
        <Button
          className={tabClass('register')}
          onClick={() => setActiveTab('register')}
        >
          Sign Up
        </Button>
      </div>
      <div className="w-full flex relative mb:20px lg:mb-0">
        <Image
          width={100}
          height={100}
          alt=""
          src="/images/local/auth-background.svg"
          className="bg_auth lg:block hidden"
        />
        <Image
          width={100}
          height={100}
          alt=""
          src="/images/local/login-logo.svg"
          className="bg_auth_logo lg:block hidden"
        />
        <div
          className={twMerge(
            clsx('w-full md:block md:w-1/2 mt-2', {
              hidden: activeTab !== 'register'
            })
          )}
        >
          <Register />
        </div>
        <div
          className={twMerge(
            clsx('w-full md:block md:w-1/2 mt-2 login_form', {
              hidden: activeTab !== 'login'
            })
          )}
        >
          <Login />
        </div>
      </div>
    </section>
  );
}
