'use client';

import { signIn, SignInOptions } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { ROUTES } from '@theme/routes';
import { LoginFormType } from '@theme/types';
import { Button, Input, Link } from '@theme/components';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import { useGetBasketQuery } from '@akinon/next/data/client/basket';
import { useCaptcha } from '@akinon/next/hooks';
import { AuthError } from '@akinon/next/types';
import { useLocalization } from '@akinon/next/hooks';
import { Image } from '@akinon/next/components/image';
import Style from './index.module.css';
import { Icon } from '@akinon/next/components';
const oauthProviders = [
  {
    key: 'google',
    label: 'Google',
    image: '/google.svg',
    localeKey: 'Google'
  },
  {
    key: 'facebook',
    label: 'Facebook',
    image: '/facebook.svg',
    localeKey: 'Facebook'
  },
  // {
  //   key: 'apple',
  //   label: 'Apple',
  //   image: '/apple.svg'
  // },
  // {
  //   key: 'akifast',
  //   localeKey: 'auth.login.form.quick_login'
  // }
];

const loginFormSchema = (t) =>
  yup.object().shape({
    email: yup
      .string()
      .email(t('auth.login.form.error.email_valid'))
      .required(t('auth.login.form.error.required')),
    password: yup.string().required(t('auth.login.form.error.required'))
  });

export const LoginGuest = () => {
  const { t, locale } = useLocalization();
  const { refetch: refetchBasketData } = useGetBasketQuery();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError
  } = useForm<LoginFormType>({
    resolver: yupResolver(loginFormSchema(t))
  });
  const searchParams = useSearchParams();
  const [formError, setFormError] = useState(null);
  const [emailValidated, setEmailValidated] = useState(false);
  const [username, setUserName] = useState(false);
  const [emailUser, setEmailUser] = useState('');
  const [isContinue, setIsContinue] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [emailError1, setEmailError1] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    CaptchaView,
    validated: captchaValidated,
    isVisible: isCaptchaVisible,
    validate: validateCaptcha
  } = useCaptcha();
  const onSubmit: SubmitHandler<LoginFormType> = async (data) => {
    setFormError(null);

    if (!data.password) {
      setError('password', {
        type: 'required',
        message: 'Please enter your password.'
      });
      return;
    }

    const loginResponse = await signIn('default', {
      redirect: false,
      callbackUrl: searchParams.get('callbackUrl') ?? '/',
      captchaValidated,
      ...data
    } as SignInOptions);


    if (loginResponse.error) {
      const errors: AuthError[] = JSON.parse(loginResponse.error);

      if (errors.find((error) => error.type === 'captcha')) {
        if (await validateCaptcha()) {
          onSubmit(data);
        }
        return;
      }

      const fieldErrors = errors.find((error) => error.type === 'field_errors')
        ?.data as { name: string; value: string[] }[];
      const nonFieldErrors = errors.find(
        (error) => error.type === 'non_field_errors'
      )?.data as string[];

      fieldErrors?.forEach((item) => {
        setError(item.name as keyof LoginFormType, {
          type: 'custom',
          message: item.value.join(', ')
        });
      });

      if (nonFieldErrors?.length) {
        setFormError(nonFieldErrors.join(', '));
      }

      return;
    }

    if (loginResponse.url) {
      window.location.href = loginResponse.url;
      refetchBasketData();
    }
  };

  const handleEmailValidated = async (e) => {
    // e.preventDefault();
    const emailValue = e.target.form.elements.email.value.trim();

    // if (!emailValue) {
    //   setEmailError('Please enter your email.');
    //   return;
    // }


    // setEmailError('');
    // setEmailValidated(true);
    // setEmailError1('')
    setEmailUser(emailValue);
    setUserName(true);


    const response = await fetch('https://b7cdecc42eb647c8ae0ec5c59ca52d1f.lb.akinoncloud.com/send-otp/', {

      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "email": emailValue }),
    });

    const data = await response.json();
    if (!data.exists) {
      setIsContinue(true);
    }
    // if (!data.exists) {
    //   setEmailError1('Email does not exist.');
    //   return;
    // }
  };

  // const handleOTPVerify = async (e) => {
  //   e.preventDefault()
  //   const inp_otp = e.target.form.elements.password.value.trim();

  //   try {
  //     const response: Response = await fetch('https://b7cdecc42eb647c8ae0ec5c59ca52d1f.lb.akinoncloud.com/verify-otp/', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         email: emailUser,
  //         // otp: (e.target as HTMLButtonElement).value,
  //         otp: e.target.form.elements.password.value.trim()
  //       }),
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! Status: ${response.status}`);
  //     }

  //     // Assuming the response contains a success message or token
  //     const data = await response.json();

  //     // Redirect to home page on successful verification
  //     window.location.href = '/';
  //   } catch (error) {
  //     console.error("Failed to verify OTP:", error);
  //   }
  // }
  const handleloginG = () => {
    signIn('google', {
      callbackUrl: `${window.location.origin}/`,

    })
  }
  const handleToggleContinue = () => {
    setIsContinue(!isContinue);
  };

  return (
    <section
      className={clsx([
        'w-full px-5 md:py-0 md:px-10 md:mx-auto lg:px-10 login_blur h-full my-auto lg:flex lg:flex-col-reverse justify-between'
      ])}
    >
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 pb-8">

        {/* <button onClick={handleloginG}>Sign in with Google</button> */}
        {oauthProviders.map((provider) => (
          <Button
            key={provider.key}
            className="w-full h-14 uppercase text-xs font-semibold flex items-center justify-center gap-2 hover:bg-transparent hover:border hover:border-primary-800 hover:text-primary"
            type="submit"
            appearance="outlined"
            disabled={isCaptchaVisible && !captchaValidated}
            onClick={() => {
              location.href = `/${provider.key}/login/`;
            }}
          >
            {provider.image && (
              <Image
                src={provider.image}
                alt={provider.label}
                width={provider.label === '' ? 10 : 18}
                height={18}
                className="flex-shrink-0 social_image"
              />
            )}

            {provider.localeKey ? t(provider.localeKey) : provider.label}
          </Button>
        ))}
      </div>

      {/* <div className={`flex justify-center bg-white ${Style.login_logo}`}>
        <Image src='/images/local/login-logo.svg' alt='Mall For Women' width={100} height={100} />
      </div> */}
      {/* <div className='flex justify-center mt-5'>
        <Image src='/images/local/login-line.svg' className={`${Style.login_line}`} alt='Mall For Women' width={150} height={100} />
      </div> */}
      {emailValidated && !errors.email && (
        <div className='flex justify-center mt-1 mb-7'>
          <Image src='/images/local/login-line-2.svg' className={`${Style.login_line}`} alt='Mall For Women' width={150} height={100} />
        </div>
      )}

      <form
        action="/api/auth/signin/credentials"
        method="post"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input type="hidden" value="login" {...register('formType')} />
        <input type="hidden" value={locale} {...register('locale')} />

        {!emailValidated && (
          <div>
            <h1 className='text-lg font-semibold'>Log In</h1>
            <h2 className={`mb-3 text-base text-start text-black-800 font-light md:mb-9 md:text-xs ${Style.login_sub_text}`}>
              {t('auth.login.title')}
            </h2>
          </div>
        )}

        {!isContinue && (
          <div>
            <div className={clsx(errors.email ? 'mb-4' : 'mb-1')}>
              <label className={`text-base font-semibold ${Style.email_label}`}>Email: </label>
              <div className='relative '>
                <Input
                  labelStyle="floating"
                  className={`h-14 ${Style.login_email}`}
                  {...register('email')}
                  error={errors.email}
                  type='email'
                  data-testid="login-email"

                />
                <Icon name="mail" size={18} className={`${Style.mail_icon}`} />
              </div>
            </div>

            {emailError && (
              <p className="text-error">{emailError}</p>
            )}


            <Button
              className={`w-full h-12 uppercase text-xs pinkbtn border-0 ${Style.login_btn}`}
              onClick={(e) => handleEmailValidated(e)}
              type='submit'
              disabled={isCaptchaVisible && !captchaValidated}
            >
              {t('auth.login.form.submit')}
            </Button>
          </div>
        )}
        {/* Render password input only if email is successfully validated */}

        {isContinue && (
          <div>
            <div className={clsx(errors.password ? 'mb-4' : 'mb-4')}>
              <label className='text-lg font-semibold'>Enter code</label><br />
              <label className='text-base'>Sent to {emailUser}</label>

              <div className='relative'>
                <Input
                  labelStyle="floating"
                  placeholder='Enter 6 digit code'
                  className="h-14"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  error={errors.password}
                  data-testid="login-password"

                />
                <Icon
                  size={25}
                  className="absolute h-full flex items-center color_pink top-0 right-4 cursor-pointer"
                  name={showPassword ? 'eye-on' : 'eye-off'}
                  onClick={() => setShowPassword(!showPassword)}
                />
              </div>

              {/* {errors.password && (
                <p className="error_message">Password is incorrect</p>
              )} */}
            </div>


            {/* {emailError && (
              <p className="error_message">{emailError}</p>
            )} */}


            {/* <Link
              href={ROUTES.FORGOT_PASSWORD}
              className="block text-sm underline mb-8"
              data-testid="login-forgot-password"
            >
              {t('auth.login.form.forgot_password')}
            </Link> */}
            {/* <p className='block text-sm underline mb-8'>Privacy</p> */}

            {formError && (
              <p
                className="text-error text-xs mt-1 mb-4"
                data-testid="login-error-field"
              >
                {formError}

              </p>
            )}

            <div className="flex justify-center">
              <CaptchaView className="mb-5" data-testid="login-captcha" />
            </div>

            <Button
              className="w-full h-12 mt-2 uppercase text-xs pinkbtn border-0"
              type="submit"
              // onClick={handleOTPVerify}
              disabled={isCaptchaVisible && !captchaValidated}
              data-testid="login-submit"
            >
              {t('auth.login.form.submit')}
            </Button>
            <p className={`block text-sm  my-4 cursor-pointer underline`} onClick={handleToggleContinue}>Log in with a different email</p>
          </div>
        )}

        <p className='block text-sm cursor-pointer mb-4 mt-3 underline'><Link href='/privacy-policy'>Privacy Policy</Link></p>

        {/* <p className="relative text-gray-600 text-center my-4 before:absolute before:h-[1px] before:w-5/12 before:bg-gray-600 before:bg-opacity-25 before:top-1/2 before:left-0 after:absolute after:h-[1px] after:w-5/12 after:bg-gray-600 after:bg-opacity-25 after:top-1/2 after:right-0">
          {t('auth.login.form.or')}
        </p> */}

        {/* <p className='mt-5'><Link href="/">Privacy</Link></p> */}

        {/* <div className="social-login">
          <p className="mb-3 text-lg text-start font-light md:mb-9 md:text-2xl">
            {t('auth.login.form.sign_in_with')}
          </p>
        </div> */}
      </form>


    </section>
  );
};
