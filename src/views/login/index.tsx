'use client';

import { signIn, SignInOptions } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useRef, useState } from 'react';
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
import { Icon, Modal } from '@akinon/next/components';
import { pushSignInEvent } from '@theme/utils/gtm';
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
  }
];

const loginFormSchema = (t) =>
  yup.object().shape({
    email: yup
      .string()
      .email(t('auth.login.form.error.email_valid'))
      .required(t('auth.login.form.error.required')),
    password: yup.string().required(t('auth.login.form.error.required'))
  });

export const Login = () => {
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
  const [emailOtpError, setEmailOtpError] = useState('');
  const [OtpError, setOtpError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpOpen, setOtpOpen] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [isEmailValidated, setIsEmailValidated] = useState(false);
  const [emailModalOtp, setEmailModalOtp] = useState('');
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
      pushSignInEvent("email")

      window.location.href = loginResponse.url + '?sucess=true';
      refetchBasketData();
    }
  };
  const handleemailotpvalidate = (e) => {
    setEmailModalOtp(e.target.value);
  };

  const handleEmailValidated = async (e) => {
    e.preventDefault();
    const emailValue = emailModalOtp;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailValue) {
      setEmailOtpError('Please enter your email.');
      return;
    }

    if (!emailRegex.test(emailValue)) {
      setEmailOtpError('Enter valid email.');
      return;
    }

    if (!emailOtpError) {
      setIsEmailValidated(true);
    }

    setUserName(true);

    const response = await fetch(
      'https://b7cdecc42eb647c8ae0ec5c59ca52d1f.lb.akinoncloud.com/send-otp/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: emailValue })
      }
    );

    const data = await response.json();
    if (!data.exists) {
      setIsContinue(true);
    }
  };

  // y
  const handleloginG = () => {
    signIn('google', {
      callbackUrl: `${window.location.origin}/`
    });
  };
  const handleToggleContinue = () => {
    setIsContinue(!isContinue);
  };

  const handleModalOpen = () => {
    setOtpOpen(true);
  };
  const handleOTPVerify = async (e) => {
    e.preventDefault();

    const emailUser = emailModalOtp;
    const otpValue = otp.join('');

    if (otpValue.length !== 6) {
      setOtpError('Invalid OTP length. Expected 6 digits.');
      return;
    }

    try {
      const response: Response = await fetch(
        'https://b7cdecc42eb647c8ae0ec5c59ca52d1f.lb.akinoncloud.com/verify-otp/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: emailUser,
            otp: otpValue
          })
        }
      );

      const data = await response.json();
      // console.log(data);

      if (!data) {
        setOtpError(data.detail);
        return;
      } else if (data) {
        // setOtpError(data.message);
        window.location.href = '/' + '?sucess=true';
      }
    } catch (error) {
      console.error('Failed to verify OTP:', error);
    }
  };

  const inputsRef = useRef([]);

  const handleInput = (e, index) => {
    const val = e.target.value;

    if (isNaN(val)) {
      e.target.value = '';
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    if (val !== '' && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyUp = (e, index) => {
    const key = e.key.toLowerCase();

    if (key === 'backspace' || key === 'delete') {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);

      if (index > 0) {
        inputsRef.current[index - 1].focus();
      }
    }
  };

  return (
    <section
      className={clsx([
        'w-full px-5 md:py-0 md:px-10 md:mx-auto lg:px-28 login_blur h-full my-auto lg:flex lg:flex-col-reverse justify-start login_main_content'
      ])}
    >
      <div className="lg:block hidden">
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
                  className="flex-shrink-0 size-4"
                />
              )}

              {provider.localeKey ? t(provider.localeKey) : provider.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-1 mb-7">
        <Image
          src="/images/local/login-line-2.svg"
          className="w-[150px]"
          alt="Mall For Women"
          width={150}
          height={100}
        />
      </div>

      <form
        action="/api/auth/signin/credentials"
        method="post"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input type="hidden" value="login" {...register('formType')} />
        <input type="hidden" value={locale} {...register('locale')} />

        <div>
          <h1 className="lg:text-lg text-xs font-semibold">Log In</h1>
          <h2 className="mb-3 lg:text-base text-xs text-start text-black-800 font-light md:mb-9 lg:text-[14px]  text=[11px] ">
            {t('auth.login.title')}
          </h2>
        </div>

        <div>
          <div
            className={clsx('relative', errors.email ? 'mb-4 pb-4' : 'mb-1')}
          >
            <label className="lg:text-base text-xs font-semibold ">
              Email*{' '}
            </label>
            <div className="relative">
              <Input
                labelStyle="floating"
                placeholder="Enter Email"
                className="lg:h-14 relative h-10 border_input_register pr-[50px]"
                {...register('email')}
                error={errors.email}
                data-testid="login-email"
              />
              <Icon
                name="mail"
                size={18}
                className="absolute h-full flex items-center top-0 right-4 cursor-pointer regitser_icon"
              />
            </div>
          </div>

          {emailError && <p className="text-error py-5">{emailError}</p>}
        </div>

        <div>
          <div className={clsx(errors.password ? 'mb-4' : 'mb-1')}>
            <label className="lg:text-base text-xs font-semibold ">
              Password *
            </label>

            <div className="relative">
              <Input
                labelStyle="floating"
                placeholder="Enter password"
                className="lg:h-14 h-10"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                error={errors.password}
                data-testid="login-password"
              />
              <Icon
                size={25}
                className="absolute h-full flex items-center login_icon color_pink top-0 right-4 cursor-pointer"
                name={showPassword ? 'eye-on' : 'eye-off'}
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
          </div>

          {formError && (
            <p
              className="text-error text-xs mt-1 mb-4"
              data-testid="login-error-field"
            >
              {formError}
            </p>
          )}

          <div className="flex  justify-center">
            <CaptchaView className="mb-5" data-testid="login-captcha" />
          </div>
          <div className="flex lg:flex-row flex-col items-center gap-2 mt-5">
            <Button
              className="w-full lg:h-12 h-10 uppercase lg:text-xs text-[10px] pinkbtn border-0 "
              type="submit"
              disabled={isCaptchaVisible && !captchaValidated}
              data-testid="login-submit"
            >
              {t('auth.login.form.submit')}
            </Button>
            <Button
              className="w-full lg:h-12 h-10 uppercase text-xs pinkbtn border-0 "
              type="submit"
              onClick={handleModalOpen}
              disabled={isCaptchaVisible && !captchaValidated}
              data-testid="login-submit"
            >
              Login With OTP
            </Button>
          </div>
          <p
            className={`block text-sm  my-4 cursor-pointer underline`}
            onClick={handleToggleContinue}
          >
            Log in with a different email
          </p>
        </div>

        <Modal
          portalId="account-address-new-address-modal"
          title="OTP Login"
          open={otpOpen}
          setOpen={setOtpOpen}
          className="w-full sm:w-[28rem] max-h-[90vh] overflow-y-auto"
        >
          <div className="p-4">
            {!isEmailValidated && (
              <div
                className={clsx(
                  'relative',
                  errors.email ? 'mb-4 pb-4' : 'mb-1'
                )}
              >
                <label className="lg:text-base text-xs font-semibold ">
                  Email*
                </label>
                <div className="relative">
                  <Input
                    labelStyle="floating"
                    className="lg:h-14 relative h-10 border_input_register pr-[50px]"
                    value={emailModalOtp}
                    placeholder="Enter Email"
                    onChange={(e) => handleemailotpvalidate(e)}
                    data-testid="login-email"
                  />
                  <Icon
                    name="mail"
                    size={18}
                    className="absolute h-full flex items-center top-0 right-4 cursor-pointer regitser_icon"
                  />
                </div>
                {emailOtpError && (
                  <p className="text-error absolute -bottom-2 left-0">
                    {emailOtpError}
                  </p>
                )}
              </div>
            )}

            {!isEmailValidated ? (
              <Button
                className="w-full lg:h-12 h-10 mt-2 uppercase text-xs pinkbtn border-0"
                onClick={handleEmailValidated}
                type="submit"
                disabled={isCaptchaVisible && !captchaValidated}
              >
                Send OTP
              </Button>
            ) : (
              <form className="mt-4">
                <div
                  id="inputs"
                  className={clsx(
                    'inputs flex gap-2 justify-center',
                    OtpError ? 'mb-4' : 'mb-0'
                  )}
                >
                  {otp.map((_, index) => (
                    <input
                      key={index}
                      className="input w-[40px] h-[40px] border border-[#C475AB] text-center"
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      ref={(el) => (inputsRef.current[index] = el)}
                      value={otp[index]}
                      onInput={(e) => handleInput(e, index)}
                      onKeyUp={(e) => handleKeyUp(e, index)}
                    />
                  ))}
                </div>
                {OtpError && (
                  <p className="text-error text-center">{OtpError}</p>
                )}
                <Button
                  type="submit"
                  className="w-full pinkbtn mt-6 p-2 bg-blue-500 text-white rounded"
                  onClick={handleOTPVerify}
                >
                  Verify OTP
                </Button>

                <p className="text-center mt-4">
                  Did you not receive the code?
                  <Button className="text-blue-500 pinkbtn ms-1">Resend OTP</Button>
                </p>
              </form>
            )}
          </div>
        </Modal>

        <p className="block text-sm cursor-pointer mb-4 mt-3 underline">
          <Link href="/privacy-policy">Privacy Policy</Link>
        </p>
      </form>

      <div className="lg:hidden block">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 pb-8 ">
          {/* <button onClick={handleloginG}>Sign in with Google</button> */}
          {oauthProviders.map((provider) => (
            <Button
              key={provider.key}
              className="w-full lg:h-14 h-8 uppercase text-[9px] font-semibold flex items-center justify-center gap-2 hover:bg-transparent hover:border hover:border-primary-800 hover:text-primary"
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
                  className="flex-shrink-0 social_image "
                />
              )}

              {provider.localeKey ? t(provider.localeKey) : provider.label}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
};
