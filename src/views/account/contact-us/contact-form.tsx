import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  FileInput,
  Input,
  LoaderSpinner,
  Select,
  Link
} from '@theme/components';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAppSelector } from '@akinon/next/redux/hooks';
import {
  useGetContactSubjectsQuery,
  useGetOrdersQuery,
  useSendContactMutation
} from '@akinon/next/data/client/account';
import { ContactFormType } from '@akinon/next/types';
import * as yup from 'yup';
import { useLocalization } from '@akinon/next/hooks';
import { Image } from '@akinon/next/components';
import 'react-phone-number-input/style.css';
// import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { getCountries, getCountryCallingCode } from 'react-phone-number-input';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import clsx from 'clsx';

const countryCodes = [
  { code: '+1', name: 'USA' },
  { code: '+44', name: 'UK' },
  { code: '+91', name: 'India' }
  // Add more country codes as needed
];

const contactFormSchema = (t) =>
  yup.object().shape({
    full_name: yup.string().required(t('account.contact.form.error.required')),
    // last_name: yup.string().required(t('account.contact.form.error.required')),
    email: yup
      .string()
      .email(t('account.contact.form.error.email_valid'))
      .required(t('account.contact.form.error.required')),
    phone: yup
      .string()
      // .transform((value: string) => value.replace(/_/g, '').replace(/ /g, ''))
      // .length(11, t('account.contact.form.error.phone_length'))
      .required(t('account.contact.form.error.required')),
    subject: yup.string().required(t('account.contact.form.error.required')),
    message: yup
      .string()
      .required(t('account.contact.form.error.required'))
      .min(10, t('account.contact.form.error.message_length'))
      .label('message'),
    order: yup
      .string()
      .nullable()
      .notRequired()
      .when('subject', {
        is: (value) => value === '2',
        then: yup.string().required(t('account.contact.form.error.required'))
      })
  });

const ContactForm = () => {
  const { t } = useLocalization();
  const { data: session, status } = useSession();
  const [valueChnage, setValueChange] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [phoneError, setPhoneError] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const filteredOrders = [
    { label: t('account.contact.form.order.placeholder'), value: '' }
  ];
  const filteredSubjects = [
    { label: t('account.contact.form.subject.placeholder'), value: '' }
  ];
  const [selectedSubject, setSelectedSubject] = useState(null);
  const { user_phone_format } = useAppSelector((state) => state.config);

  const {
    data: contactSubject,
    isLoading: subjectLoading,
    isSuccess: subjectSuccess
  } = useGetContactSubjectsQuery();

  const {
    data: orders,
    isLoading: ordersLoading,
    isSuccess: ordersSuccess
  } = useGetOrdersQuery(
    {},
    {
      skip: status === 'unauthenticated' || status === 'loading'
    }
  );

  const [sendContact, { isSuccess: formSuccess }] = useSendContactMutation();

  if (ordersSuccess) {
    orders?.results?.map((item) => {
      filteredOrders.push({ label: item.number, value: item.id.toString() });
    });
  }

  if (subjectSuccess) {
    contactSubject
      ?.filter((item) => {
        if (status === 'unauthenticated') {
          return !item.is_order_needed;
        }

        return item;
      })
      .forEach((item) => {
        filteredSubjects.push({ label: item.text, value: item.id });
      });
  }

  const {
    register,
    reset,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<ContactFormType>({
    resolver: yupResolver(contactFormSchema(t))
  });

  const onSubmit: SubmitHandler<ContactFormType> = (data) => {
    if (!data.phone) {
      // setPhoneError('This field is required');
      return;
    } else if (!isValidPhoneNumber(phoneNumber)) {
      setPhoneError('Invalid phone number');
      return;
    } else {
      setPhoneError('');
      sendContact(data);
    }
  };

  const handleChange = (e) => {
    setSelectedSubject(e.target.value);
    setValueChange(e.target.value);
  };

  useEffect(() => {
    reset({
      full_name:
        session?.user?.firstName && session?.user?.lastName
          ? `${session?.user?.firstName} ${session?.user?.lastName}`
          : '',
      // firstName: session?.user?.firstName,
      // lastName: session?.user?.lastName,
      email: session?.user?.email,
      phone: session?.user?.phone
    });
    window.scrollTo(0, 0);
  }, [session, reset]);

  // const validatePhoneNumber = (value) => {
  //   const phoneNumberRegex = /^\d{10}$/;
  //   return phoneNumberRegex.test(value) || 'Phone number must be 10 digits';
  // };

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulating data fetch
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  if (isLoading) {
    return (
      <div className="mb-5">
        <LoaderSpinner />
      </div>
    );
  }

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
    if (typeof value !== 'string') {
      setPhoneError('Invalid input');
      return;
    }
    // errors.phone = null;
    setPhoneNumber(value);

    if (isValidPhoneNumber(value)) {
      setPhoneError('');
    } else {
      setPhoneError('Invalid phone number');
    }
  };

  return (
    <div className="flex-1 ">
      <div className="p-4 lg:p-2">
        <h2 className="lg:text-[50px] text-[26px] text-center text-[#003744] mb-5">
          <i>{t('account.contact.header.title')}</i>
        </h2>
        {/* <p className="text-center">{t('account.contact.header.subtitle')}</p> */}
      </div>
      <div className="flex flex-col-reverse lg:flex-row">
        {formSuccess ? (
          <div>
            <div className="border border-gray-500 w-full p-6 lg:px-24 lg:py-10 lg:w-[670px] h-full lg:rounded-none lg:rounded-tl-[15px] lg:rounded-bl-[15px] flex  rounded-[15px] flex-col justify-center ">
              {/* <div className="border border-gray-500 w-full p-6 lg:px-24 lg:py-10 lg:w-[670px] h-full lg:rounded-none lg:rounded-tl-[15px] lg:rounded-bl-[15px]  rounded-[15px] flex-col justify-center "> */}
              <h3 className="text-3xl mb-5">
                {t('account.contact.form.success.title')}
              </h3>
              <p className="text-sm mb-4">
                {t('account.contact.form.success.description')}
              </p>
              <Link href={'/'} className="underline">
                {t('account.contact.form.success.button')}
              </Link>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="border lg:w-6/12 w-full lg:rounded-s-[15px]  p-6 lg:px-10 lg:py-10 border-[#e442b1]"
          >
            <div className="flex items-center lg:gap-5 lg:flex-row flex-col">
              <div className="mb-5 w-full">
                <Input
                  label="Full Name"
                  className="mb-1"
                  {...register('full_name')}
                  error={errors.full_name}
                />
              </div>
              {/* <div className="mb-5 lg:w-6/12 w-full">
                <Input
                  label='Last Name'
                  className="mb-1"
                  {...register('lastName')}
                error={errors.full_name}

                />
              </div> */}
            </div>
            <div className="mb-5">
              <Input
                label={t('account.contact.form.email.placeholder')}
                type="email"
                className="mb-1"
                {...register('email')}
                error={errors.email}
              />
            </div>
            <div className="mb-5">
              {/* <Input
                label={t('account.contact.form.phone.placeholder')}
                type="tel"
                className="mb-1"
                // format={user_phone_format.replace(/\9/g, '#')}
                mask="_"
                allowEmptyFormatting={true}
                control={control}
                {...register('phone')}
                error={errors.phone}

              /> */}
              <div className="mb-4">
                <label className="lg:text-base text-sm ">Phone Number*</label>
                <br />
                <div className={clsx({ 'mb-4': errors.phone })}>
                  <div className="flex items-center number_register relative">
                    <PhoneInput
                      international
                      value={phoneNumber}
                      {...register('phone')}
                      onChange={onPhoneNumberChange}
                      className="lg:h-10 h-10 w-full border border-gray-500 bg-white focus:outline-none"
                    />
                  </div>
                  <>
                    {phoneError && (
                      <p className="text_red text-[14px]">{phoneError}</p>
                    )}
                    {errors.phone && (
                      <p className="text_red text-[14px]">
                        {errors.phone.message}
                      </p>
                    )}
                  </>
                </div>
              </div>
              {/* {errors.phone && (
                <p className="error-message">{errors.phone.message}</p>
              )} */}
            </div>

            <div className="mb-5 relative">
              {subjectLoading && <LoaderSpinner />}
              {subjectSuccess && (
                <>
                  <Select
                    className="w-full mb-1 border-gray-500 text-sm h-11"
                    options={filteredSubjects}
                    {...register('subject')}
                    error={errors.subject}
                    onChange={handleChange}
                    label={t('account.contact.form.subject.title')}
                    required
                  />
                </>
              )}
            </div>

            {selectedSubject === '2' && (
              <div className="mb-5 relative">
                {ordersLoading && <LoaderSpinner />}
                {ordersSuccess && (
                  <>
                    <Select
                      className="w-full mb-1 border-gray-500 text-sm"
                      options={filteredOrders}
                      {...register('order')}
                      error={errors.order}
                      label={t('account.contact.form.order.title')}
                      required
                    />
                  </>
                )}
              </div>
            )}

            <label className="text-base text-black mb-2 top-1/2">
              Additional Information <span className="">*</span>
            </label>
            <Input
              className=""
              rows={7}
              name="message"
              {...register('message')}
            />
            {errors.message && (
              <span className="text-sm text-error">{errors.message.message}</span>
            )}
            {/* <label className="text-xs text-gray-800 mb-2 block">
                {t('account.contact.form.file.title')}
              </label> */}
            {/* <FileInput className="w-full mb-5" title="test" /> */}
            <Button
              type="submit"
              className="w-full mt-5 pinkbtn border-0 font-medium"
            >
              {t('account.contact.form.submit_button')}
            </Button>
          </form>
        )}

        <div className="lg:w-6/12 w-full relative h-auto block">
          <Image
            width={100}
            height={100}
            alt="Contact Us"
            className="lg:mb-0 mb-5 overflow-hidden  block w-full h-full lg:rounded-none rounded-[15px]"
            src="/images/local/contact-us.png"
          />
          {/* <div className='absolute bottom-5 lg:left-10 text-white lg:text-5xl left-2 w-6/12 text-2xl lg:w-5/12'>
            <h2>We love to hear from you</h2>
          </div> */}
        </div>
        {/* <div className="my-6 lg:ml-8">
            <h2 className="text-3xl mb-4">
              {' '}
              {t('account.contact.address_title')}
            </h2>
            <div className="mb-4">
              <h3 className="font-medium text-sm">London</h3>
              <p className="text-sm">7 Bell Yard, London, WC2A 2JR</p>
              <p className="text-sm">+44 20 3740 62 63</p>
            </div>
            <div className="mb-4">
              <h3 className="font-medium text-sm">İstanbul</h3>
              <p className="text-sm">YTU Davutpasa Teknopark A1 Z10</p>
              <p className="text-sm">+90 212 483 72 45</p>
            </div>
            <div className="mb-4">
              <h3 className="font-medium text-sm">Dubai</h3>
              <p className="text-sm">Level 21 Al Habtoor Business Tower</p>
              <p className="text-sm">+971 4275 6336</p>
            </div>
            <div className="mb-4">
              <h3 className="font-medium text-sm">Athens</h3>
              <p className="text-sm">Averof 18a, Chalandri</p>
              <p className="text-sm">+30 21 1411 6000</p>
            </div>
          </div> */}
      </div>
    </div>
  );
};

export default ContactForm;
