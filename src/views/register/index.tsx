'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import { signIn, SignInOptions } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '@akinon/next/redux/hooks';
import { RegisterFormType } from '@theme/types';
import { Button, Checkbox, Icon, Modal } from '@theme/components';
import * as yup from 'yup';
import { useCaptcha, useLocalization, useRouter } from '@akinon/next/hooks';
import { AuthError } from '@akinon/next/types';
import PluginModule, { Component } from '@akinon/next/components/plugin-module';
import PasswordRulesFeedback from '@theme/components/password-rules-feedback';
import { showPopup as showOtpPopup } from '@akinon/pz-otp/src/redux/reducer';
// import DatePicker from 'react-datepicker';
import { Link, Radio } from '@akinon/next/components';
// import { DatePicker } from '@elements';
import { FaCalendarAlt } from 'react-icons/fa';
import 'react-phone-number-input/style.css';
// import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { validatePhoneNumberLength } from 'libphonenumber-js/core';
import { P } from 'pino';
import { Input } from '@theme/components/input-phone';
import axios from 'axios';
import { getCountries, getCountryCallingCode } from 'react-phone-number-input';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import { pushRegistrationEvent } from '@theme/utils/gtm';

const registerFormSchema = (t) =>
  yup.object().shape({
    email: yup
      .string()
      .email(t('auth.register.form.error.email_valid'))
      .required(t('auth.register.form.error.required')),
    first_name: yup
      .string()
      .required(t('auth.register.form.error.required'))
      .min(2, t('auth.register.form.error.name_min'))
      .max(50, t('auth.register.form.error.name_max'))
      .matches(
        /^[a-zA-ZğüşöçıİĞÜŞÖÇ\s]+$/,
        t('auth.register.form.error.name_match')
      ),
    last_name: yup
      .string()
      .required(t('auth.register.form.error.required'))
      .min(2, t('auth.register.form.error.surname_min'))
      .max(50, t('auth.register.form.error.surname_max'))
      .matches(
        /^[a-zA-ZğüşöçıİĞÜŞÖÇ\s]+$/,
        t('auth.register.form.error.surname_match')
      ),
    password: yup
      .string()
      .required(t('auth.register.form.error.required'))
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{6,}$/,
        'The password must be exactly 8 characters long and include at least one uppercase letter, one lowercase letter, one special character, and one numeric digit.'
      )
      .max(50, t('auth.register.form.error.password_max')),
    gender: yup.string().required(t('account.my_profile.form.required')),
    phone: yup
      .string()
      .transform((value: string) =>
        value
          .replace(' ', '')
          .replace('(', '')
          .replace('-', '')
          .replace('+', '')
          .replace(') ', '')
      )
      // .length(11, t('auth.register.form.error.phone_length'))
      .required(t('auth.register.form.error.required')),
    confirm: yup
      .boolean()
      .oneOf([true], t('auth.register.form.error.required')),
    kvkk_confirm: yup
      .boolean()
      .oneOf([true], t('auth.register.form.error.required'))
  });

export const Register = () => {
  const { t, locale } = useLocalization();
  const dispatch = useAppDispatch();
  const [openModal, setOpenModal] = useState(false);
  const otpPopupVisible = useAppSelector((state) => state.otp?.isPopupVisible);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [maxDate, setMaxDate] = useState('');
  const [formError, setFormError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { user_phone_format } = useAppSelector((state) => state.config);
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [phoneError, setPhoneError] = useState('');
  const [contentModal, setContentModal] = useState({
    title: undefined,
    description: undefined
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError,
    getValues,
    watch
  } = useForm<RegisterFormType>({
    resolver: yupResolver(registerFormSchema(t))
  });

  const router = useRouter();
  const passwordValue = watch('password', '');

  const {
    CaptchaView,
    validated: captchaValidated,
    isVisible: isCaptchaVisible,
    validate: validateCaptcha
  } = useCaptcha();

  const registerHandler: SubmitHandler<RegisterFormType> = async (data) => {
    return await signIn('default', {
      redirect: false,
      callbackUrl: '/',
      captchaValidated,
      ...data
    } as SignInOptions);
  };

  const onSubmit: SubmitHandler<RegisterFormType> = async (data) => {
    if (isValidPhoneNumber(phoneNumber)) {
      setPhoneError('');
    } else {
      setPhoneError('Invalid phone number');
      return;
    }
    const registerResponse = await registerHandler(data);

    if (registerResponse.error === 'Captcha') {
      if (await validateCaptcha()) {
        onSubmit(data);
      }
      return;
    }

    if (registerResponse.error) {
      const errors: AuthError[] = JSON.parse(registerResponse.error);

      if (errors.find((error) => error.type === 'captcha')) {
        if (await validateCaptcha()) {
          onSubmit(data);
        }
        return;
      } else if (errors.find((error) => error.type === 'otp')) {
        if (showOtpPopup) {
          dispatch(showOtpPopup());
        }
        return;
      }

      const fieldErrors = errors.find((error) => error.type === 'field_errors')
        ?.data as { name: string; value: string[] }[];
      const nonFieldErrors = errors.find(
        (error) => error.type === 'non_field_errors'
      )?.data as string[];

      fieldErrors?.forEach((item) => {
        setError(item.name as keyof RegisterFormType, {
          type: 'custom',
          message: item.value.join(', ')
        });
      });

      if (nonFieldErrors?.length) {
        setFormError(nonFieldErrors.join(', '));
      }

      return;
    }

    // if (registerResponse.url) {
    //   router.replace(registerResponse.url);
    //   return;
    // }

    if (registerResponse.url) {
      pushRegistrationEvent(data, 'email');
      window.location.href = registerResponse.url + '?register=true';
      return;
    }
  };

  const modalChange = (e, content) => {
    e.preventDefault(e);
    setContentModal(content);
    setOpenModal(true);
  };

  useEffect(() => {
    const dtToday = new Date();

    const month = (dtToday.getMonth() + 1).toString().padStart(2, '0');
    const day = dtToday.getDate().toString().padStart(2, '0');
    const year = dtToday.getFullYear();

    const maxDate = `${year}-${month}-${day}`;
    setMaxDate(maxDate);
  }, []);

  const CountryCodeDropdown = ({ selectedCountry, onChange }) => {
    const countries = getCountries();
    return (
      <select
        className="lg:h-14 h-10 bg-white border-[#C576AC] lg:text-base rounded-none text-xs border_register focus:outline-none px-3"
        value={selectedCountry}
        onChange={(e) => onChange(e.target.value)}
      >
        {countries.map((country) => (
          <option key={country} value={country}>
            {country} (+{getCountryCallingCode(country)})
          </option>
        ))}
      </select>
    );
  };

  const onCountryChange = (country) => {
    setSelectedCountry(country);
  };

  const onPhoneNumberChange = (value) => {
    errors.phone = null;
    if (typeof value !== 'string') {
      setPhoneError('Invalid input type');
      return;
    }

    setPhoneNumber(value);

    if (isValidPhoneNumber(value)) {
      setPhoneError('');
    } else {
      setPhoneError('Invalid phone number');
    }
  };

  return (
    <section className="w-full py-10 px-5 lg:py-20 md:py-0 md:block google_translate md:px-8 md:mx-auto lg:px-16 register_bg">
      <Modal
        title={contentModal.title}
        portalId="portal-modal-container"
        open={openModal}
        setOpen={setOpenModal}
        className="w-3/4 md:max-w-xl"
      >
        <div className="p-4 max-h-80 overflow-auto">
          {contentModal.description}
        </div>
      </Modal>
      {otpPopupVisible && (
        <PluginModule
          component={Component.Otp}
          props={{
            data: getValues(),
            submitAction: registerHandler
          }}
        />
      )}
      {/* <h2 className="mb-3 text-center text-2xl text-black-800 font-light md:mb-9 md:text-2xl">
        Sign Up
      </h2> */}

      {/* <p className="mb-3 text-xs leading-4 text-primary-400">
        {t('auth.register.subtitle')}
      </p> */}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 lg:py-20"
      >
        <input type="hidden" value="register" {...register('formType')} />
        <input type="hidden" value={locale} {...register('locale')} />

        <div
          className={clsx('lg:flex', {
            'mb-4': errors.first_name || errors.last_name
          })}
        >
          <div className="w-full lg:pr-2">
            <label className="lg:text-base text-sm font-semibold">
              First Name*
            </label>
            <br />

            <Input
              labelStyle="floating"
              // label={t('auth.register.form.name.placeholder')}
              className="block lg:h-14 h-10  border_input_register"
              {...register('first_name')}
              error={errors.first_name}
              data-testid="register-name"
            />
          </div>

          <div className="w-full mt-4 lg:pl-2 lg:mt-0">
            <label className="lg:text-base text-sm font-semibold">
              Last Name*
            </label>
            <br />

            <Input
              labelStyle="floating"
              // label={t('auth.register.form.surname.placeholder')}
              className="block lg:h-14 h-10  border_input_register"
              {...register('last_name')}
              error={errors.last_name}
              data-testid="register-surname"
            />
          </div>
        </div>

        <div>
          <label className="lg:text-base text-sm font-semibold mb-4">
            Phone Number*
          </label>
          <br />
          <div className={clsx({ 'mb-4': errors.phone })}>
            <div className="flex items-center number_register relative">
              {/* <CountryCodeDropdown
                selectedCountry={selectedCountry}
                onChange={onCountryChange}
              /> */}

              <PhoneInput
                international
                // defaultCountry={selectedCountry}
                value={phoneNumber}
                error={errors.phone}
                {...register('phone')}
                onChange={onPhoneNumberChange}
                className="lg:h-14 h-10 w-full border_input_register  bg-white focus:outline-none"
              />
            </div>
            <>
              {phoneError && (
                <p className="lg:text-[14px] mt-2 text-error text-[8px]">
                  {phoneError}
                </p>
              )}
              {errors.phone && (
                <p className="lg:text-[14px] mt-2 text-error text-[8px]">
                  {errors.phone.message}
                </p>
              )}
            </>
          </div>
          {/* <Input
            labelStyle="floating"
            // label={t('auth.register.form.phone.placeholder')}
            // format={user_phone_format.replace(/\9/g, '#')}
            allowEmptyFormatting
            mask="_"

            /> */}
          {/* <PhoneInput
            // error={errors.phone}
            placeholder="Enter phone number"
            // control={control}
            data-testid="register-phone"
            value={phoneNumber}
            // allowEmptyFormatting
            // mask="_"
            // labelStyle="floating"
            country={'us'}
            // defaultCountry="US"
            {...register('phone')}
            onChange={handleCountryChnage}
            inputProps={{ required: true }}
          />
          {!valid && <p className='text_red text-sm'>Enter a Valid Number</p>} */}
        </div>

        <div className={clsx({ 'mb-4': errors.email })}>
          <label className="lg:text-base text-sm font-semibold">
            Email ID*
          </label>
          <br />
          <div>
            <Input
              labelStyle="floating"
              // label={t('auth.register.form.email.placeholder')}
              className="lg:h-14 h-10 border_input_register"
              {...register('email')}
              error={errors.email}
              data-testid="register-email"
            />
          </div>
        </div>

        <div className={clsx('relative', { 'mb-4': errors.password })}>
          <label className=" text-sm font-semibold">
            <span className="text-base">Password*</span>
          </label>
          <br />
          <div className="relative">
            <Input
              labelStyle="floating"
              // label={t('auth.register.form.password.placeholder')}
              className={`lg:h-14 h-10 pr-16 border_input_register ${
                showPassword ? 'text-base' : 'lg:text-2xl'
              }`}
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              data-testid="register-password"
            />
            <Icon
              size={25}
              className="absolute h-full flex items-center top-0 right-4 cursor-pointer regitser_icon"
              name={showPassword ? 'eye-on' : 'eye-off'}
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>

          {errors.password && (
            <span className="mt-1 lg:text-sm text-[8px]  text-error">
              {errors.password.message}
            </span>
          )}

          {/* <PasswordRulesFeedback
            password={passwordValue}
            isVisible={errors?.password?.message ? true : false}
          /> */}
        </div>

        <div className="flex lg:flex-row flex-col gap-4 w-full ">
          <div className="lg:w-1/2 w-full relative  lg:pr-0">
            <label className="lg:text-base text-sm font-semibold">
              Date Of Birth*
            </label>
            <br />
            <div>
              <div className="absolute top-11 bg-white z-10 right-3 cursor-pointer calendar_icon">
                <FaCalendarAlt />
              </div>
              <Input
                // labelStyle="floating"
                // label='DD-MM-YYYY'
                // placeholder='DD/MM/YYYY'
                className="lg:h-14 h-10 border_input_register uppercase lg:min-w-auto min-w-full"
                type="date"
                // format='##-##-####'
                allowEmptyFormatting
                mask="_"
                max={maxDate}
                control={control}
                {...register('date_of_birth')}
                // error={errors.date_of_birth}
                // data-testid="register-date_of_birth"
                // max={getCurrentDate()}
              />
            </div>
          </div>
          <div className="lg:w-1/2 w-full relative  lg:pr-0">
            <div className={clsx({ 'mb-4': errors.marriage_anniversary })}>
              <label className="lg:text-base text-sm font-semibold">
                Anniversary Date
              </label>
              <br />
              <div className="absolute lg:top-11 top-10 bg-white z-10 right-3 cursor-pointer calendar_icon">
                <FaCalendarAlt />
              </div>
              <Input
                labelStyle="floating"
                // label='DD-MM-YYYY'
                // placeholder='DD/MM/YYYY'
                className="lg:h-14 h-10 border_input_register uppercase lg:min-w-auto min-w-full"
                type="date"
                // format='####-##-##'
                max={maxDate}
                allowEmptyFormatting
                mask="_"
                control={control}
                {...register('marriage_anniversary')}
                error={errors.marriage_anniversary}
                data-testid="register-phone"
                // max={getCurrentDate()}
              />
            </div>
          </div>
        </div>

        <div className="mb-2 w-6/12">
          <label className="lg:text-base text-sm font-semibold">Gender*</label>
          <br />
          <div className="flex flex-wrap gap-4 w-max">
            <Radio
              className="accent-primary"
              name="gender"
              value="female"
              {...register('gender')}
            >
              {t('account.my_profile.form.gender.female')}
            </Radio>
            <Radio
              className="accent-primary"
              name="gender"
              value="male"
              {...register('gender')}
            >
              {t('account.my_profile.form.gender.male')}
            </Radio>
            <Radio
              className="accent-primary"
              name="gender"
              value="none"
              {...register('gender')}
            >
              {t('account.my_profile.form.gender.other')}
            </Radio>
          </div>
          {errors.gender?.type === 'typeError' && (
            <div className="lg:text-[14px] text-[9px] mt-2 text-error">
              {t('account.my_profile.form.required')}
            </div>
          )}
        </div>

        <div className="text-sm text-black-400 md:text-xs">
          {/* <p className="mb-4">{t('auth.register.form.agreements.title')}:</p> */}
          <div className="flex gap-2 relative items-center ">
            <div>
              <Checkbox
                {...register('confirm')}
                error={errors.confirm}
                data-testid="register-agreement-1"
              ></Checkbox>
            </div>
            <div className="absolute lg:top-0 top-[-10px] left-6 lg:text-xs text-[10px]">
              By creating an account, you agree to the{' '}
              <Link
                href="/privacy-policy"
                target="_blank"
                className="cursor-pointer"
              >
                <u>Privacy Policy</u>
              </Link>{' '}
              &amp;{' '}
              <Link
                href="/shipping-policy"
                target="_blank"
                className="cursor-pointer"
              >
                <u>Shipping Policy</u>
              </Link>
            </div>
          </div>

          {/* <Checkbox
            className={clsx(errors.kvkk_confirm ? 'mb-8' : 'mb-4')}
            {...register('kvkk_confirm')}
            error={errors.kvkk_confirm}
            data-testid="register-agreement-2"
          >
            {t('auth.register.form.agreements.kvkk.label')}
            <br />
            <span className="cursor-pointer">
              <b
                onClick={(e) => {
                  modalChange(e, STATIC_CONTENT.content_2);
                }}
              >
                <u>{t('auth.register.form.agreements.read_approve')}</u>
              </b>
            </span>
          </Checkbox>

          <Checkbox
            className="mb-4"
            {...register('email_allowed')}
            data-testid="register-agreement-3"
          >
            {t('auth.register.form.agreements.email_communication.label')}
            <br />
            <span className="cursor-pointer">
              <b
                onClick={(e) => {
                  modalChange(e, STATIC_CONTENT.content_3);
                }}
              >
                <u>{t('auth.register.form.agreements.read_approve')}</u>
              </b>
            </span>
          </Checkbox>

          <Checkbox
            className="mb-4"
            {...register('sms_allowed')}
            data-testid="register-agreement-4"
          >
            {t('auth.register.form.agreements.sms_communication.label')} <br />
            <span className="cursor-pointer">
              <b
                onClick={(e) => {
                  modalChange(e, STATIC_CONTENT.content_4);
                }}
              >
                <u>{t('auth.register.form.agreements.read_approve')}</u>
              </b>
            </span>
          </Checkbox> */}
        </div>

        <label className="text-error mb-2 hidden"></label>

        {formError && <p className="text-error text-xs">{formError}</p>}

        <div className="flex justify-center">
          <CaptchaView className="mb-5" data-testid="register-captcha" />
        </div>

        <Button
          className="text-xs pinkbtn font-semibold uppercase w-full lg:h-14 h-10"
          type="submit"
          disabled={isCaptchaVisible && !captchaValidated}
          data-testid="register-submit"
        >
          Submit
        </Button>
        {/* <p className="text-xs text-gray-600 italic mt-3">
          {t('auth.register.form.mandatory_fields')}
        </p> */}
      </form>
    </section>
  );
};

// 'use client';

// import { yupResolver } from '@hookform/resolvers/yup';
// import clsx from 'clsx';
// import { signIn, SignInOptions } from 'next-auth/react';
// import { useEffect, useRef, useState } from 'react';
// import { SubmitHandler, useForm } from 'react-hook-form';
// import { useAppDispatch, useAppSelector } from '@akinon/next/redux/hooks';
// import { RegisterFormType } from '@theme/types';
// import { Button, Checkbox, Icon, Modal } from '@theme/components';
// import * as yup from 'yup';
// import { useCaptcha, useLocalization, useRouter } from '@akinon/next/hooks';
// import { AuthError } from '@akinon/next/types';
// import PluginModule, { Component } from '@akinon/next/components/plugin-module';
// import PasswordRulesFeedback from '@theme/components/password-rules-feedback';
// import { showPopup as showOtpPopup } from '@akinon/pz-otp/src/redux/reducer';
// // import DatePicker from 'react-datepicker';
// import { Link, Radio } from '@akinon/next/components';
// // import { DatePicker } from '@elements';
// import { FaCalendarAlt } from 'react-icons/fa';
// import 'react-phone-number-input/style.css';
// // import PhoneInput from 'react-phone-input-2';
// import 'react-phone-input-2/lib/style.css';
// import { validatePhoneNumberLength } from 'libphonenumber-js/core';
// import { P } from 'pino';
// import { Input } from '@theme/components/input-phone';
// import axios from 'axios';
// import { getCountries, getCountryCallingCode } from 'react-phone-number-input';
// import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
// import { pushRegistrationEvent } from '@theme/utils/gtm';

// const registerFormSchema = (t) =>
//   yup.object().shape({
//     email: yup
//       .string()
//       .email(t('auth.register.form.error.email_valid'))
//       .required(t('auth.register.form.error.required')),
//     first_name: yup
//       .string()
//       .required(t('auth.register.form.error.required'))
//       .min(2, t('auth.register.form.error.name_min'))
//       .max(50, t('auth.register.form.error.name_max'))
//       .matches(
//         /^[a-zA-ZğüşöçıİĞÜŞÖÇ\s]+$/,
//         t('auth.register.form.error.name_match')
//       ),
//     last_name: yup
//       .string()
//       .required(t('auth.register.form.error.required'))
//       .min(2, t('auth.register.form.error.surname_min'))
//       .max(50, t('auth.register.form.error.surname_max'))
//       .matches(
//         /^[a-zA-ZğüşöçıİĞÜŞÖÇ\s]+$/,
//         t('auth.register.form.error.surname_match')
//       ),
//     password: yup
//       .string()
//       .required(t('auth.register.form.error.required'))
//       .matches(
//         /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{6,}$/,
//         'The password must be exactly 8 characters long and include at least one uppercase letter, one lowercase letter, one special character, and one numeric digit.'
//       )
//       .max(50, t('auth.register.form.error.password_max')),
//     gender: yup.string().required(t('account.my_profile.form.required')),
//     phone: yup
//       .string()
//       .transform((value: string) =>
//         value
//           .replace(' ', '')
//           .replace('(', '')
//           .replace('-', '')
//           .replace('+', '')
//           .replace(') ', '')
//       )
//       // .length(11, t('auth.register.form.error.phone_length'))
//       .required(t('auth.register.form.error.required')),
//     confirm: yup
//       .boolean()
//       .oneOf([true], t('auth.register.form.error.required')),
//     kvkk_confirm: yup
//       .boolean()
//       .oneOf([true], t('auth.register.form.error.required'))
//   });

// export const Register = () => {
//   const { t, locale } = useLocalization();
//   const dispatch = useAppDispatch();
//   const [openModal, setOpenModal] = useState(false);
//   const otpPopupVisible = useAppSelector((state) => state.otp?.isPopupVisible);
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [maxDate, setMaxDate] = useState('');
//   const [formError, setFormError] = useState(null);
//   const [showPassword, setShowPassword] = useState(false);
//   const { user_phone_format } = useAppSelector((state) => state.config);
//   const [selectedCountry, setSelectedCountry] = useState('US');
//   const [phoneError, setPhoneError] = useState('');
//   const [isContinue, setIsContinue] = useState(false);
//   const [OtpError, setOtpError] = useState('');
//   const [ModalOtp, SetModalOtp] = useState('');
//   const [otpOpen, setOtpOpen] = useState(false);
//   const [otp, setOtp] = useState(new Array(6).fill(''));
//   const [isOtpValid, setOtpValid] = useState(false);
//   const [contentModal, setContentModal] = useState({
//     title: undefined,
//     description: undefined
//   });

//   const {
//     register,
//     handleSubmit,
//     control,
//     formState: { errors },
//     setError,
//     getValues,
//     watch
//   } = useForm<RegisterFormType>({
//     resolver: yupResolver(registerFormSchema(t))
//   });

//   const router = useRouter();
//   const passwordValue = watch('password', '');

//   const {
//     CaptchaView,
//     validated: captchaValidated,
//     isVisible: isCaptchaVisible,
//     validate: validateCaptcha
//   } = useCaptcha();

//   const registerHandler: SubmitHandler<RegisterFormType> = async (data) => {
//     if (isOtpValid) {
//       return await signIn('default', {
//         redirect: false,
//         callbackUrl: '',
//         captchaValidated,
//         ...data
//       } as SignInOptions);
//     } else {
//       setOtpOpen(true);
//       console.log('Please verify your otp');
//     }

//     return;
//   };

//   const handlotpvalidate = (e) => {
//     SetModalOtp(e.target.value);
//   };

//   const handleEmailValidated = async (e) => {
//     e.preventDefault();
//     const emailValue = ModalOtp;
//     console.log(emailValue);

//     if (emailValue) {
//       setOtpOpen(true);
//     }

//     // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     // if (!emailValue) {
//     //   setEmailOtpError('Please enter your email.');
//     //   return;
//     // }

//     // if (!emailRegex.test(emailValue)) {
//     //   setEmailOtpError('Enter valid email.');
//     //   return;
//     // }

//     // if (!emailOtpError) {
//     //   setIsEmailValidated(true);
//     // }

//     // setUserName(true);

//     const response = await fetch(
//       'https://b7cdecc42eb647c8ae0ec5c59ca52d1f.lb.akinoncloud.com/send-otp/',
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ email: emailValue })
//       }
//     );

//     const data = await response.json();
//     if (!data.exists) {
//       setIsContinue(true);
//     }
//   };

//   const handleModalOpen = () => {
//     setOtpOpen(true);
//   };
//   const handleOTPVerify = async (e) => {
//     e.preventDefault();

//     const emailUser = ModalOtp;
//     console.log(emailUser, 'emailUser');

//     const otpValue = otp.join('');
//     console.log(otpValue, 'otpValue');

//     if (otpValue.length !== 6) {
//       setOtpError('Invalid OTP length. Expected 6 digits.');
//       return;
//     }

//     try {
//       const response: Response = await fetch(
//         'https://b7cdecc42eb647c8ae0ec5c59ca52d1f.lb.akinoncloud.com/verify-otp/',
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({
//             email: emailUser,
//             otp: otpValue
//           })
//         }
//       );

//       const data = await response.json();
//       console.log(data,"data");

//       // console.log(data);

//       if (!data) {
//         setOtpError(data.detail);
//         return;
//       } else if (data) {
//         setOtpError(data.detail);
//         console.log('hello');
//         window.location.href = '/' + '?sucess=true';
//       }
//     } catch (error) {
//       console.error('Failed to verify OTP:', error);
//     }
//   };

//   const onSubmit: SubmitHandler<RegisterFormType> = async (data) => {
//     if (isValidPhoneNumber(phoneNumber)) {
//       setPhoneError('');
//     } else {
//       setPhoneError('Invalid phone number');
//       return;
//     }

//     const registerResponse = await registerHandler(data);
//     console.log(registerResponse);

//     // if (registerResponse.error === 'Captcha') {
//     //   if (await validateCaptcha()) {
//     //     onSubmit(data);
//     //   }
//     //   return;
//     // }

//     if (registerResponse.error) {
//       const errors: AuthError[] = JSON.parse(registerResponse.error);

//       // if (errors.find((error) => error.type === 'captcha')) {
//       //   if (await validateCaptcha()) {
//       //     onSubmit(data);
//       //   }
//       //   return;
//       // } else if (errors.find((error) => error.type === 'otp')) {
//       //   if (showOtpPopup) {
//       //     dispatch(showOtpPopup());
//       //   }
//       //   return;
//       // }

//       const fieldErrors = errors.find((error) => error.type === 'field_errors')
//         ?.data as { name: string; value: string[] }[];
//       const nonFieldErrors = errors.find(
//         (error) => error.type === 'non_field_errors'
//       )?.data as string[];

//       fieldErrors?.forEach((item) => {
//         setError(item.name as keyof RegisterFormType, {
//           type: 'custom',
//           message: item.value.join(', ')
//         });
//       });

//       if (nonFieldErrors?.length) {
//         setFormError(nonFieldErrors.join(', '));
//       }

//       return;
//     }

//     // if (registerResponse.url) {
//     //   router.replace(registerResponse.url);
//     //   return;
//     // }

//     console.log(registerResponse);

//     if (registerResponse.url) {
//       pushRegistrationEvent(data, 'email');
//       // window.location.href = registerResponse.url + '?register=true';
//       // return;
//     }
//   };

//   const modalChange = (e, content) => {
//     e.preventDefault(e);
//     setContentModal(content);
//     setOpenModal(true);
//   };

//   useEffect(() => {
//     const dtToday = new Date();

//     const month = (dtToday.getMonth() + 1).toString().padStart(2, '0');
//     const day = dtToday.getDate().toString().padStart(2, '0');
//     const year = dtToday.getFullYear();

//     const maxDate = `${year}-${month}-${day}`;
//     setMaxDate(maxDate);
//   }, []);

//   const CountryCodeDropdown = ({ selectedCountry, onChange }) => {
//     const countries = getCountries();
//     return (
//       <select
//         className="lg:h-14 h-10 bg-white border-[#C576AC] lg:text-base rounded-none text-xs border_register focus:outline-none px-3"
//         value={selectedCountry}
//         onChange={(e) => onChange(e.target.value)}
//       >
//         {countries.map((country) => (
//           <option key={country} value={country}>
//             {country} (+{getCountryCallingCode(country)})
//           </option>
//         ))}
//       </select>
//     );
//   };

//   const onCountryChange = (country) => {
//     setSelectedCountry(country);
//   };

//   const onPhoneNumberChange = (value) => {
//     errors.phone = null;
//     if (typeof value !== 'string') {
//       setPhoneError('Invalid input type');
//       return;
//     }

//     setPhoneNumber(value);

//     if (isValidPhoneNumber(value)) {
//       setPhoneError('');
//     } else {
//       setPhoneError('Invalid phone number');
//     }
//   };

//   const inputsRef = useRef([]);

//   const handleInput = (e, index) => {
//     const val = e.target.value;

//     if (isNaN(val)) {
//       e.target.value = '';
//       return;
//     }

//     const newOtp = [...otp];
//     newOtp[index] = val;
//     setOtp(newOtp);

//     if (val !== '' && index < inputsRef.current.length - 1) {
//       inputsRef.current[index + 1].focus();
//     }
//   };

//   const handleKeyUp = (e, index) => {
//     const key = e.key.toLowerCase();

//     if (key === 'backspace' || key === 'delete') {
//       const newOtp = [...otp];
//       newOtp[index] = '';
//       setOtp(newOtp);

//       if (index > 0) {
//         inputsRef.current[index - 1].focus();
//       }
//     }
//   };

//   return (
//     <section className="w-full py-10 px-5 lg:py-20 md:py-0 md:block google_translate md:px-8 md:mx-auto lg:px-16 register_bg">
//       <Modal
//         title={contentModal.title}
//         portalId="portal-modal-container"
//         open={openModal}
//         setOpen={setOpenModal}
//         className="w-3/4 md:max-w-xl"
//       >
//         <div className="p-4 max-h-80 overflow-auto">
//           {contentModal.description}
//         </div>
//       </Modal>
//       {otpPopupVisible && (
//         <PluginModule
//           component={Component.Otp}
//           props={{
//             data: getValues(),
//             submitAction: registerHandler
//           }}
//         />
//       )}
//       {/* <h2 className="mb-3 text-center text-2xl text-black-800 font-light md:mb-9 md:text-2xl">
//         Sign Up
//       </h2> */}

//       {/* <p className="mb-3 text-xs leading-4 text-primary-400">
//         {t('auth.register.subtitle')}
//       </p> */}

//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="flex flex-col gap-4 lg:py-20"
//       >
//         <input type="hidden" value="register" {...register('formType')} />
//         <input type="hidden" value={locale} {...register('locale')} />

//         <div
//           className={clsx('lg:flex', {
//             'mb-4': errors.first_name || errors.last_name
//           })}
//         >
//           <div className="w-full lg:pr-2">
//             <label className="lg:text-base text-sm font-semibold">
//               First Name*
//             </label>
//             <br />

//             <Input
//               labelStyle="floating"
//               // label={t('auth.register.form.name.placeholder')}
//               className="block lg:h-14 h-10  border_input_register"
//               {...register('first_name')}
//               error={errors.first_name}
//               data-testid="register-name"
//             />
//           </div>

//           <div className="w-full mt-4 lg:pl-2 lg:mt-0">
//             <label className="lg:text-base text-sm font-semibold">
//               Last Name*
//             </label>
//             <br />

//             <Input
//               labelStyle="floating"
//               // label={t('auth.register.form.surname.placeholder')}
//               className="block lg:h-14 h-10  border_input_register"
//               {...register('last_name')}
//               error={errors.last_name}
//               data-testid="register-surname"
//             />
//           </div>
//         </div>

//         <div>
//           <label className="lg:text-base text-sm font-semibold mb-4">
//             Phone Number*
//           </label>
//           <br />
//           <div className={clsx({ 'mb-4': errors.phone })}>
//             <div className="flex items-center number_register relative">
//               {/* <CountryCodeDropdown
//                 selectedCountry={selectedCountry}
//                 onChange={onCountryChange}
//               /> */}

//               <PhoneInput
//                 international
//                 // defaultCountry={selectedCountry}
//                 value={phoneNumber}
//                 error={errors.phone}
//                 {...register('phone')}
//                 onChange={onPhoneNumberChange}
//                 className="lg:h-14 h-10 w-full border_input_register  bg-white focus:outline-none"
//               />
//             </div>
//             <>
//               {phoneError && (
//                 <p className="lg:text-[14px] mt-2 text-error text-[8px]">
//                   {phoneError}
//                 </p>
//               )}
//               {errors.phone && (
//                 <p className="lg:text-[14px] mt-2 text-error text-[8px]">
//                   {errors.phone.message}
//                 </p>
//               )}
//             </>
//           </div>
//           {/* <Input
//             labelStyle="floating"
//             // label={t('auth.register.form.phone.placeholder')}
//             // format={user_phone_format.replace(/\9/g, '#')}
//             allowEmptyFormatting
//             mask="_"

//             /> */}
//           {/* <PhoneInput
//             // error={errors.phone}
//             placeholder="Enter phone number"
//             // control={control}
//             data-testid="register-phone"
//             value={phoneNumber}
//             // allowEmptyFormatting
//             // mask="_"
//             // labelStyle="floating"
//             country={'us'}
//             // defaultCountry="US"
//             {...register('phone')}
//             onChange={handleCountryChnage}
//             inputProps={{ required: true }}
//           />
//           {!valid && <p className='text_red text-sm'>Enter a Valid Number</p>} */}
//         </div>

//         <div className={clsx({ 'mb-4': errors.email })}>
//           <label className="lg:text-base text-sm font-semibold">
//             Email ID*
//           </label>
//           <br />
//           <Input
//             labelStyle="floating"
//             className="lg:h-14 relative h-10 border_input_register pr-[50px]"
//             value={ModalOtp}
//             placeholder="Enter Email"
//             onChange={(e) => handlotpvalidate(e)}
//             data-testid="login-email"
//           />
//         </div>

//         <div className={clsx('relative', { 'mb-4': errors.password })}>
//           <label className=" text-sm font-semibold">
//             <span className="text-base">Password*</span>
//           </label>
//           <br />
//           <div className="relative">
//             <Input
//               labelStyle="floating"
//               // label={t('auth.register.form.password.placeholder')}
//               className={`lg:h-14 h-10 pr-16 border_input_register ${
//                 showPassword ? 'text-base' : 'lg:text-2xl'
//               }`}
//               type={showPassword ? 'text' : 'password'}
//               {...register('password')}
//               data-testid="register-password"
//             />
//             <Icon
//               size={25}
//               className="absolute h-full flex items-center top-0 right-4 cursor-pointer regitser_icon"
//               name={showPassword ? 'eye-on' : 'eye-off'}
//               onClick={() => setShowPassword(!showPassword)}
//             />
//           </div>

//           {errors.password && (
//             <span className="mt-1 lg:text-sm text-[8px]  text-error">
//               {errors.password.message}
//             </span>
//           )}

//           {/* <PasswordRulesFeedback
//             password={passwordValue}
//             isVisible={errors?.password?.message ? true : false}
//           /> */}
//         </div>

//         <div className="flex lg:flex-row flex-col gap-4 w-full ">
//           <div className="lg:w-1/2 w-full relative  lg:pr-0">
//             <label className="lg:text-base text-sm font-semibold">
//               Date Of Birth*
//             </label>
//             <br />
//             <div>
//               <div className="absolute top-11 bg-white z-10 right-3 cursor-pointer calendar_icon">
//                 <FaCalendarAlt />
//               </div>
//               <Input
//                 // labelStyle="floating"
//                 // label='DD-MM-YYYY'
//                 // placeholder='DD/MM/YYYY'
//                 className="lg:h-14 h-10 border_input_register uppercase lg:min-w-auto min-w-full"
//                 type="date"
//                 // format='##-##-####'
//                 allowEmptyFormatting
//                 mask="_"
//                 max={maxDate}
//                 control={control}
//                 {...register('date_of_birth')}
//                 // error={errors.date_of_birth}
//                 // data-testid="register-date_of_birth"
//                 // max={getCurrentDate()}
//               />
//             </div>
//           </div>
//           <div className="lg:w-1/2 w-full relative  lg:pr-0">
//             <div className={clsx({ 'mb-4': errors.marriage_anniversary })}>
//               <label className="lg:text-base text-sm font-semibold">
//                 Anniversary Date
//               </label>
//               <br />
//               <div className="absolute lg:top-11 top-10 bg-white z-10 right-3 cursor-pointer calendar_icon">
//                 <FaCalendarAlt />
//               </div>
//               <Input
//                 labelStyle="floating"
//                 // label='DD-MM-YYYY'
//                 // placeholder='DD/MM/YYYY'
//                 className="lg:h-14 h-10 border_input_register uppercase lg:min-w-auto min-w-full"
//                 type="date"
//                 // format='####-##-##'
//                 max={maxDate}
//                 allowEmptyFormatting
//                 mask="_"
//                 control={control}
//                 {...register('marriage_anniversary')}
//                 error={errors.marriage_anniversary}
//                 data-testid="register-phone"
//                 // max={getCurrentDate()}
//               />
//             </div>
//           </div>
//         </div>

//         <div className="mb-2 w-6/12">
//           <label className="lg:text-base text-sm font-semibold">Gender*</label>
//           <br />
//           <div className="flex flex-wrap gap-4 w-max">
//             <Radio
//               className="accent-primary"
//               name="gender"
//               value="female"
//               {...register('gender')}
//             >
//               {t('account.my_profile.form.gender.female')}
//             </Radio>
//             <Radio
//               className="accent-primary"
//               name="gender"
//               value="male"
//               {...register('gender')}
//             >
//               {t('account.my_profile.form.gender.male')}
//             </Radio>
//             <Radio
//               className="accent-primary"
//               name="gender"
//               value="none"
//               {...register('gender')}
//             >
//               {t('account.my_profile.form.gender.other')}
//             </Radio>
//           </div>
//           {errors.gender?.type === 'typeError' && (
//             <div className="lg:text-[14px] text-[9px] mt-2 text-error">
//               {t('account.my_profile.form.required')}
//             </div>
//           )}
//         </div>

//         <div className="text-sm text-black-400 md:text-xs">
//           {/* <p className="mb-4">{t('auth.register.form.agreements.title')}:</p> */}
//           <div className="flex gap-2 relative items-center ">
//             <div>
//               <Checkbox
//                 {...register('confirm')}
//                 error={errors.confirm}
//                 data-testid="register-agreement-1"
//               ></Checkbox>
//             </div>
//             <div className="absolute lg:top-0 top-[-10px] left-6 lg:text-xs text-[10px]">
//               By creating an account, you agree to the{' '}
//               <Link
//                 href="/privacy-policy"
//                 target="_blank"
//                 className="cursor-pointer"
//               >
//                 <u>Privacy Policy</u>
//               </Link>{' '}
//               &amp;{' '}
//               <Link
//                 href="/shipping-policy"
//                 target="_blank"
//                 className="cursor-pointer"
//               >
//                 <u>Shipping Policy</u>
//               </Link>
//             </div>
//           </div>

//           {/* <Checkbox
//             className={clsx(errors.kvkk_confirm ? 'mb-8' : 'mb-4')}
//             {...register('kvkk_confirm')}
//             error={errors.kvkk_confirm}
//             data-testid="register-agreement-2"
//           >
//             {t('auth.register.form.agreements.kvkk.label')}
//             <br />
//             <span className="cursor-pointer">
//               <b
//                 onClick={(e) => {
//                   modalChange(e, STATIC_CONTENT.content_2);
//                 }}
//               >
//                 <u>{t('auth.register.form.agreements.read_approve')}</u>
//               </b>
//             </span>
//           </Checkbox>

//           <Checkbox
//             className="mb-4"
//             {...register('email_allowed')}
//             data-testid="register-agreement-3"
//           >
//             {t('auth.register.form.agreements.email_communication.label')}
//             <br />
//             <span className="cursor-pointer">
//               <b
//                 onClick={(e) => {
//                   modalChange(e, STATIC_CONTENT.content_3);
//                 }}
//               >
//                 <u>{t('auth.register.form.agreements.read_approve')}</u>
//               </b>
//             </span>
//           </Checkbox>

//           <Checkbox
//             className="mb-4"
//             {...register('sms_allowed')}
//             data-testid="register-agreement-4"
//           >
//             {t('auth.register.form.agreements.sms_communication.label')} <br />
//             <span className="cursor-pointer">
//               <b
//                 onClick={(e) => {
//                   modalChange(e, STATIC_CONTENT.content_4);
//                 }}
//               >
//                 <u>{t('auth.register.form.agreements.read_approve')}</u>
//               </b>
//             </span>
//           </Checkbox> */}
//         </div>

//         <label className="text-error mb-2 hidden"></label>

//         {formError && <p className="text-error text-xs">{formError}</p>}

//         <div className="flex justify-center">
//           <CaptchaView className="mb-5" data-testid="register-captcha" />
//         </div>

//         <Button
//           className="text-xs pinkbtn font-semibold uppercase w-full lg:h-14 h-10"
//           type="submit"
//           onClick={handleEmailValidated}
//           disabled={isCaptchaVisible && !captchaValidated}
//           data-testid="register-submit"
//         >
//           Submit
//         </Button>

//         <Modal
//           portalId="account-address-new-address-modal"
//           title="OTP Login"
//           open={otpOpen}
//           setOpen={setOtpOpen}
//           className="w-full sm:w-[28rem] max-h-[90vh] overflow-y-auto"
//         >
//           <div className="p-4">
//             {/* {!isEmailValidated && (
//               <div
//                 className={clsx(
//                   'relative',
//                   errors.email ? 'mb-4 pb-4' : 'mb-1'
//                 )}
//               >
//                 <label className="lg:text-base text-xs font-semibold ">
//                   Email*
//                 </label>
//                 <div className="relative">
//                   <Input
//                     labelStyle="floating"
//                     className="lg:h-14 relative h-10 border_input_register pr-[50px]"
//                     value={ModalOtp}
//                     placeholder="Enter Email"
//                     onChange={(e) => handlotpvalidate(e)}
//                     data-testid="login-email"
//                   />
//                   <Icon
//                     name="mail"
//                     size={18}
//                     className="absolute h-full flex items-center top-0 right-4 cursor-pointer regitser_icon"
//                   />
//                 </div>
//                 {emailOtpError && (
//                   <p className="text-error absolute -bottom-2 left-0">
//                     {emailOtpError}
//                   </p>
//                 )}
//               </div>
//             )} */}

//             {/* {!isEmailValidated ? (
//               <Button
//                 className="w-full lg:h-12 h-10 mt-2 uppercase text-xs pinkbtn border-0"
//                 onClick={handleEmailValidated}
//                 type="submit"
//                 disabled={isCaptchaVisible && !captchaValidated}
//               >
//                 Send OTP
//               </Button>
//             ) : ( */}
//             <form className="mt-4">
//               <div
//                 id="inputs"
//                 className={clsx(
//                   'inputs flex gap-2 justify-center',
//                   OtpError ? 'mb-4' : 'mb-0'
//                 )}
//               >
//                 {otp.map((_, index) => (
//                   <input
//                     key={index}
//                     className="input w-[40px] h-[40px] border border-[#C475AB] text-center"
//                     type="text"
//                     inputMode="numeric"
//                     maxLength={1}
//                     ref={(el) => (inputsRef.current[index] = el)}
//                     value={otp[index]}
//                     onInput={(e) => handleInput(e, index)}
//                     onKeyUp={(e) => handleKeyUp(e, index)}
//                   />
//                 ))}
//               </div>
//               {OtpError && <p className="text-error text-center">{OtpError}</p>}
//               <Button
//                 type="submit"
//                 className="w-full pinkbtn mt-6 p-2 bg-blue-500 text-white rounded"
//                 onClick={handleOTPVerify}
//               >
//                 Verify OTP
//               </Button>

//               <p className="text-center mt-4">
//                 Did you not receive the code?
//                 <Button className="text-blue-500 pinkbtn ms-1">
//                   Resend OTP
//                 </Button>
//               </p>
//             </form>
//             {/* )} */}
//           </div>
//         </Modal>
//         {/* <p className="text-xs text-gray-600 italic mt-3">
//           {t('auth.register.form.mandatory_fields')}
//         </p> */}
//       </form>
//     </section>
//   );
// };
