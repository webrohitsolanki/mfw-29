'use client';

import { useAppDispatch, useAppSelector } from '@akinon/next/redux/hooks';
import { checkoutApi } from '@akinon/next/data/client/checkout';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { GuestLoginFormParams } from '@akinon/next/types';
import clsx from 'clsx';

import { Button, Checkbox, Input } from '@theme/components';
import { useLocalization } from '@akinon/next/hooks';
import { Link } from '@akinon/next/components';

const GuestloginFormSchema = (t) =>
  yup.object().shape({
    user_email: yup
      .string()
      .email(t('checkout.auth.form.login.error.email_control'))
      .required(t('checkout.auth.form.login.error.required')),
    phone_number: yup
      .string()
      .transform((value: string) => value.replace(/_/g, '').replace(/ /g, ''))
      .length(11, t('checkout.auth.form.login.error.phone_control'))
      .required(t('checkout.auth.form.login.error.required')),
    sms_allowed: yup
      .boolean()
      .oneOf([true], t('checkout.auth.form.login.error.required')),
    kvkk_confirm: yup
      .boolean()
      .oneOf([true], t('checkout.auth.form.login.error.required')),

  });

const GuestLogin = () => {
  const { t } = useLocalization();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError
  } = useForm<GuestLoginFormParams>({
    resolver: yupResolver(GuestloginFormSchema(t))
  });
  const { user_phone_format } = useAppSelector((state) => state.config);
  const dispatch = useAppDispatch();

  const onSubmit: SubmitHandler<GuestLoginFormParams> = async (data) => {
    try {
      const response = await dispatch(
        checkoutApi.endpoints.guestLogin.initiate(data)
      ).unwrap();

      Object.keys(response?.errors || {}).forEach((key) => {
        setError(key as keyof GuestLoginFormParams, {
          type: 'custom',
          message: response?.errors[key]?.join(', ')
        });
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={clsx(errors.user_email ? 'mb-8' : 'mb-4')}>
        <label className='text-base font-semibold'>Email:</label>
        <Input
          labelStyle="floating"
          // label={t('checkout.auth.form.login.email.placeholder')}
          name="email"
          className="h-14"
          {...register('user_email')}
          error={errors.user_email}
          data-testid="guest-email"

        />
      </div>

      <div className={clsx(errors.phone_number ? 'mb-8' : 'mb-4')}>
        <label className='text-base font-semibold'>Number:</label>
        <Input
          labelStyle="floating"
          // label={t('checkout.auth.form.login.phone.placeholder')}
          className="h-14"
          name="phone_number"
          type="tel"
          // format={user_phone_format.replace(/\9/g, '#')}
          mask="_"
          control={control}
          {...register('phone_number')}
          error={errors.phone_number}
          data-testid="guest-phone"
        />
      </div>

      <Button
        type="submit"
        className="w-full h-12 uppercase pinkbtn text-xs font-semibold mb-4"
        data-testid="guest-submit"
      >
        {t('checkout.auth.form.login.button')}
      </Button>

      {/* <div className="text-sm text-black-400 md:text-xs">
        <p className="mb-4">{t('checkout.auth.form.login.agreement.label')}</p>
        <Checkbox
          name="sms_allowed"
          // className={clsx('underline', errors.sms_allowed ? 'mb-8' : 'mb-4')}
          {...register('sms_allowed')}
          error={errors.sms_allowed}
          data-testid="guest-sms"
        >
          <Link href='terms-&-service' >{t('checkout.auth.form.login.agreement.terms_conditions')}</Link>
        </Checkbox>

        <Checkbox
          name="confirm"
          className={clsx('underline', errors.kvkk_confirm ? 'mb-8' : 'mb-4')}
          {...register('kvkk_confirm')}
          error={errors.kvkk_confirm}
          data-testid="guest-kvkk"
        >
          <Link href='privacy-policy'>{t('checkout.auth.form.login.agreement.privacy_policy')}</Link>
        </Checkbox>
      </div> */}

      <div className='flex gap-2 text-xs relative items-center'>
        <div>
          <Checkbox
            {...register('sms_allowed')}
            error={errors.sms_allowed}
            className='whitespace-nowrap'
            data-testid="register-agreement-1"
          >
          </Checkbox>
        </div>
        <div className='absolute top-0 left-6'>
          By creating an account, you agree to the{' '}
          <Link href='/privacy-policy' target="_blank" className="cursor-pointer">
            <u>Privacy Policy</u>
          </Link>{' '}
          &amp;{' '}
          <Link href='/terms-&-service' target="_blank" className="cursor-pointer">
            <u>Term & Services</u>
          </Link>
        </div>
      </div>
    </form>
  );
};

export default GuestLogin;
