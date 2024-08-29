'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AccountProfileFormType } from '@akinon/next/types';
import * as yup from 'yup';
import {
  Button,
  Checkbox,
  Input,
  Modal,
  Radio,
  Select
  // Link
} from '@theme/components';
import { useAppSelector } from '@akinon/next/redux/hooks';
import { useEffect, useState } from 'react';
import {
  useUpdateProfileMutation,
  useGetProfileInfoQuery
} from '@akinon/next/data/client/account';
// import { ROUTES } from '@theme/routes';
import { useLocalization } from '@akinon/next/hooks';
// import { Trans } from '@akinon/next/components/trans';
import 'react-phone-number-input/style.css';
// import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { getCountries, getCountryCallingCode } from 'react-phone-number-input';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import clsx from 'clsx';
import { CountryCode, parsePhoneNumber } from 'libphonenumber-js';
const accountProfileFormSchema = (t, selectedCountry) =>
  yup.object().shape({
    first_name: yup
      .string()
      .required(t('account.my_profile.form.required'))
      .matches(
        /^[a-zA-ZğüşöçıİĞÜŞÖÇ\s]+$/,
        t('account.my_profile.form.error.name_match')
      ),
    last_name: yup
      .string()
      .required(t('account.my_profile.form.required'))
      .matches(
        /^[a-zA-ZğüşöçıİĞÜŞÖÇ\s]+$/,
        t('account.my_profile.form.error.surname_match')
      ),
    birthdate: yup
      .object()
      .shape({
        day: yup.number().required(t('account.my_profile.form.required')),
        month: yup.number().required(t('account.my_profile.form.required')),
        year: yup.number().required(t('account.my_profile.form.required'))
      })
      .test(
        'isValidBirthdate',
        t('account.my_profile.form.birth_date.error.not_valid'),

        (value) => {
          const { day, month, year } = value;
          const date = new Date(`${year}-${month}-${day}`);

          return date && date <= new Date();
        }
      ),
    phone: yup.string(),
    // .required('phone Number required'),
    // .test(
    //   'isValidPhoneNumber',
    //   t('account.my_profile.form.phone.error.not_valid'),
    //   (value) => {
    //     console.log(value);
    //     console.log(parsePhoneNumber(value).country);
    //     return (
    //       // typeof value === 'string' &&
    //       isValidPhoneNumber(value, parsePhoneNumber(value).country)
    //     );
    //   }
    // ),
    // .transform((value: string) => value?.replace(/_/g, '').replace(/ /g, ''))
    // .length(11, t('account.my_profile.form.phone.error.not_valid'))
    // .required(t('account.my_profile.form.required'))
    gender: yup.string().required(t('account.my_profile.form.required'))
  });

export default function Page() {
  const { t } = useLocalization();
  // const { user_phone_format } = useAppSelector((state) => state.config);
  // const { user_phone_format } = useAppSelector((state) => state.config);
  const { data: profileInfo } = useGetProfileInfoQuery();
  const [updateProfile] = useUpdateProfileMutation();
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [phoneError, setPhoneError] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [responseMessage, setResponseMessage] = useState({
    title: '',
    content: ''
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm<AccountProfileFormType>({
    resolver: yupResolver(accountProfileFormSchema(t, selectedCountry))
  });

  // useEffect(() => {
  //   // Update form resolver whenever selectedCountry changes
  //   const schema = accountProfileFormSchema(t, selectedCountry);
  //   // Reinitialize form with the updated schema
  //   reset({}, { resolver: yupResolver(schema) });
  // }, [selectedCountry, t, reset]);

  const handleSuccess = () => {
    setResponseMessage({
      title: t('account.my_profile.form.success.title').toString(),
      content: t('account.my_profile.form.success.description').toString()
    });
    setIsModalOpen(true);
  };

  const handleError = () => {
    setResponseMessage({
      title: t('account.my_profile.form.error.title').toString(),
      content: t('account.my_profile.form.error.description').toString()
    });
    setIsModalOpen(true);
  };

  const handleModalClick = () => {
    setIsModalOpen(false);
  };

  // const onSubmit: SubmitHandler<AccountProfileFormType> = async (data) => {
  //   // console.log('data out', data);
  //   if (isValidPhoneNumber(phoneNumber)) {
  //     setPhoneError('');
  //     const dateOfBirth = `${data.birthdate.year}-${data.birthdate.month}-${data.birthdate.day}`;

  //     if ('birthdate' in data) {
  //       delete data.birthdate;
  //     }

  //     console.log('log', phoneNumber);

  //     updateProfile({
  //       date_of_birth: dateOfBirth,
  //       phone: phoneNumber,
  //       ...data
  //     })
  //       .unwrap()
  //       .then(handleSuccess)
  //       .catch(handleError);
  //   } else if (!phoneNumber) {
  //     setPhoneError('This field is required');
  //   } else {
  //     setPhoneError('Invalid phone number');
  //   }
  // };

  const onSubmit: SubmitHandler<AccountProfileFormType> = async (data) => {
    if (!phoneNumber) {
      setPhoneError('This field is required');
    } else if (isValidPhoneNumber(phoneNumber)) {
      setPhoneError('');

      const dateOfBirth = `${data.birthdate.year}-${data.birthdate.month}-${data.birthdate.day}`;

      if ('birthdate' in data) {
        delete data.birthdate;
      }


      updateProfile({
        date_of_birth: dateOfBirth,
        phone: phoneNumber,
        ...data
      })
        .unwrap()
        .then(handleSuccess)
        .catch(handleError);
    } else {
      setPhoneError('Invalid phone number');
    }
  };

  const buildOptionDays = () => {
    const days = Array.from({ length: 31 }, (_, index) => {
      const day = (index + 1).toString().padStart(2, '0');
      return { label: day, value: day };
    });

    return days;
  };

  const buildOptionMonths = () => {
    const months = [
      'january',
      'february',
      'march',
      'april',
      'may',
      'june',
      'july',
      'august',
      'september',
      'october',
      'november',
      'december'
    ];

    const options = months.map((month, index) => {
      const monthValue = (index + 1).toString().padStart(2, '0');
      return {
        label: t(`account.my_profile.form.months.${month}`),
        value: monthValue
      };
    });

    return options;
  };

  const buildOptionYears = () => {
    const currentYear = new Date().getFullYear();
    const minOffset = 0;
    const maxOffset = 80;

    const years = Array.from(
      { length: maxOffset - minOffset + 1 },
      (_, index) => {
        const year = currentYear - index;
        return { label: year, value: year };
      }
    );
    return years;
  };

  useEffect(() => {
    const todayDate = new Date().toISOString().slice(0, 10);

    const {
      first_name = '',
      last_name = '',
      phone = '',
      gender = '',
      email_allowed = false,
      sms_allowed = false,
      date_of_birth = todayDate
    } = profileInfo || {};
    setPhoneNumber(phone);

    const [year, month, day] =
      date_of_birth?.split('-') ?? todayDate.split('-');
    reset({
      first_name,
      last_name,
      phone,
      gender,
      email_allowed,
      sms_allowed,
      birthdate: {
        day,
        month,
        year
      }
    });
    // setPhoneError('');
  }, [profileInfo, reset]);

  // const CountryCodeDropdown = ({ selectedCountry, onChange }) => {
  //   const countries = getCountries();
  //   return (
  //     <select
  //       className="lg:h-14 h-10 bg-white border-[#C576AC] lg:text-base rounded-none text-xs border_register focus:outline-none px-3"
  //       value={selectedCountry}
  //       onChange={(e) => onChange(e.target.value)}
  //     >
  //       {countries.map((country) => (
  //         <option key={country} value={country}>
  //           {country} (+{getCountryCallingCode(country)})
  //         </option>
  //       ))}
  //     </select>
  //   );
  // };

  // const onCountryChange = (country) => {
  //   setSelectedCountry(country);
  //   // Update form schema or validation if necessary
  // };

  const onPhoneNumberChange = (value) => {
    if (!value) {
      setPhoneError('');
      return;
    }

    setPhoneNumber(value);

    // if (!value) {
    //   setPhoneError('This field is required.');
    // } else if (
    //   selectedCountry &&
    //   isValidPhoneNumber(value, selectedCountry as CountryCode)
    // ) {
    //   setPhoneError('');
    // } else {
    //   setPhoneError('Invalid phone number');
    // }
  };

  return (
    <div>
      <div className="p-6 bg-gray-150 flex items-center lg:flex-row flex-col">
        <h3 className="text-2xl text-center ">
          {t('account.my_profile.header.title')}
        </h3>
        <p className="border_line lg:block hidden"></p>
        <p className="text-center text-base">
          {t('account.my_profile.header.subtitle')}
        </p>
      </div>
      <div className="flex">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="border border-gray-500 mt-5 p-6 lg:px-24 lg:py-10 lg:w-full"
        >
          <div className="mb-5 flex flex-col gap-5 lg:flex-row w-full lg:gap-x-7">
            <div className="lg:w-6/12 w-full">
              <Input
                type="text"
                label={t('account.my_profile.form.name.placeholder')}
                className="w-full"
                {...register('first_name')}
                error={errors.first_name}
              />
            </div>
            <div className="lg:w-6/12 w-full">
              <Input
                type="text"
                label={t('account.my_profile.form.surname.placeholder')}
                className="w-full"
                {...register('last_name')}
                error={errors.last_name}
              />
            </div>
          </div>
          <div className="mb-5 flex flex-col gap-5 lg:flex-row w-full lg:gap-x-7">
            <div className="lg:w-6/12 w-full">
              <Input
                name="email"
                label={t('account.my_profile.form.email.placeholder')}
                type="email"
                value={profileInfo?.email ?? ''}
                disabled
                className="mb-5 w-full"
              />
            </div>

            {/* <div className="mb-5 lg:w-6/12 w-full">
              <Input
                label={t('account.my_profile.form.phone.placeholder')}
                type="tel"
                // format={user_phone_format.replace(/\9/g, '#')}
                mask="_"
                allowEmptyFormatting={true}
                control={control}
                className='w-full'
                {...register('phone')}
                classID='w-full'
                error={errors.phone}

              />
            </div> */}
            <div className="mb-5 lg:w-6/12 w-full">
              <label className="lg:text-base text-sm mb-2">Phone Number*</label>
              <br />
              <div className={clsx({ 'mb-4': errors.phone })}>
                <div className="flex items-center number_register relative mt-2">
                  <PhoneInput
                    name="phone"
                    international
                    type="tel"
                    value={phoneNumber}
                    {...register('phone')}
                    error={errors.phone}
                    onChange={onPhoneNumberChange}
                    className="lg:h-10 h-10 w-full border border-gray-500 bg-white focus:outline-none"
                  />
                </div>
                {phoneError && <p className="text_red text-xs">{phoneError}</p>}
                {errors.phone && (
                  <p className="text_red text-xs">{errors.phone.message}</p>
                )}
              </div>
            </div>
          </div>
          {/* </div> */}
          <div className="mb-5 flex flex-col gap-5 lg:flex-row w-full lg:gap-x-7">
            <div className="w-full lg:w-6/12">
              <label className="text-black mb-2 block">Birth Day*</label>
              <div className="flex items-center gap-2 sm:flex-row">
                <div className="lg:w-full  w-full">
                  <Select
                    className="w-full border-gray-400 text-base text-gray-800 bg-white"
                    options={buildOptionDays()}
                    {...register('birthdate.day')}
                  />
                </div>
                <div className="lg:w-full w-full">
                  <Select
                    className="w-full border-gray-400 text-base text-gray-800 bg-white"
                    options={buildOptionMonths()}
                    {...register('birthdate.month')}
                  />
                </div>
                <div className="lg:w-full w-full">
                  <Select
                    className="w-full border-gray-400 text-base text-gray-800 bg-white pr-0.5"
                    options={buildOptionYears()}
                    {...register('birthdate.year')}
                  />
                </div>
              </div>
              {errors && (
                <div className="mt-1 text-sm text-error">
                  {errors.birthdate?.message}
                </div>
              )}
            </div>
            <div className="mb-6 lg:w-6/12 w-full">
              <label className="text-base text-black mb-3 block">Gender*</label>
              <div className="flex flex-wrap gap-4">
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
                <div className="text-sm text-error">
                  {t('account.my_profile.form.required')}
                </div>
              )}
            </div>
          </div>

          <div className="mb-6">
            <label className="text-base text-black mb-3 block">
              {t('account.my_profile.form.communication_channel.title')}
            </label>
            <div className="flex gap-6">
              <Checkbox
                className="accent-primary"
                {...register('email_allowed')}
              >
                {t('account.my_profile.form.communication_channel.email')}
              </Checkbox>
              <Checkbox className="accent-primary" {...register('sms_allowed')}>
                {t('account.my_profile.form.communication_channel.sms')}
              </Checkbox>
            </div>
          </div>
          <Button type="submit" className="w-full pinkbtn">
            {t('account.my_profile.form.submit_button')}
          </Button>
        </form>
        {/* <div className="my-6 lg:ml-8">
          <h2 className="text-3xl mb-4">
            {t('account.my_profile.info.title')}
          </h2>
          <p className="text-sm font-medium">
            <Trans
              i18nKey="account.my_profile.info.content"
              components={{
                ContactLink: (
                  <Link href={ROUTES.ACCOUNT_CONTACT}>
                    {t('account.my_profile.info.contact')}
                  </Link>
                ),
                Faq: (
                  <Link href={ROUTES.ACCOUNT_FAQ}>
                    {t('account.my_profile.info.faq')}
                  </Link>
                )
              }}
            />
          </p>
        </div> */}
      </div>
      <Modal
        portalId="my-profile-modal"
        open={isModalOpen}
        setOpen={setIsModalOpen}
        title={'Success'}
      >
        <div className="flex flex-col items-center justify-center gap-6 p-6">
          <h3 className="text-base" data-testid="account-my-profile-response">
            {responseMessage.content}
          </h3>
          {/* <p className="text-center">{responseMessage.content}</p> */}
          <Button
            onClick={handleModalClick}
            appearance="outlined"
            className="font-medium px-10 py-2 pinkbtn"
          >
            {t('account.my_profile.form.close_button')}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

// 'use client';

// import { yupResolver } from '@hookform/resolvers/yup';
// import { SubmitHandler, useForm } from 'react-hook-form';
// import { AccountProfileFormType } from '@akinon/next/types';
// import * as yup from 'yup';
// import {
//   Button,
//   Checkbox,
//   Input,
//   Modal,
//   Radio,
//   Select
//   // Link
// } from '@theme/components';
// import { useAppSelector } from '@akinon/next/redux/hooks';
// import { useEffect, useState } from 'react';
// import {
//   useUpdateProfileMutation,
//   useGetProfileInfoQuery
// } from '@akinon/next/data/client/account';
// // import { ROUTES } from '@theme/routes';
// import { useLocalization } from '@akinon/next/hooks';
// import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';

// import clsx from 'clsx';
// import 'react-phone-number-input/style.css';
// // import PhoneInput from 'react-phone-input-2';
// import 'react-phone-input-2/lib/style.css';
// // import { Trans } from '@akinon/next/components/trans';

// const accountProfileFormSchema = (t) =>
//   yup.object().shape({
//     first_name: yup
//       .string()
//       .required(t('account.my_profile.form.required'))
//       .matches(
//         /^[a-zA-ZğüşöçıİĞÜŞÖÇ\s]+$/,
//         t('account.my_profile.form.error.name_match')
//       ),
//     last_name: yup
//       .string()
//       .required(t('account.my_profile.form.required'))
//       .matches(
//         /^[a-zA-ZğüşöçıİĞÜŞÖÇ\s]+$/,
//         t('account.my_profile.form.error.surname_match')
//       ),
//     birthdate: yup
//       .object()
//       .shape({
//         day: yup.number().required(t('account.my_profile.form.required')),
//         month: yup.number().required(t('account.my_profile.form.required')),
//         year: yup.number().required(t('account.my_profile.form.required'))
//       })
//       .test(
//         'isValidBirthdate',
//         t('account.my_profile.form.birth_date.error.not_valid'),

//         (value) => {
//           const { day, month, year } = value;
//           const date = new Date(`${year}-${month}-${day}`);

//           return date && date <= new Date();
//         }
//       ),
//     phone: yup
//       .string(),
//       // .transform((value: string) => value?.replace(/_/g, '').replace(/ /g, ''))
//       // .length(11, t('account.my_profile.form.phone.error.not_valid'))
//       // .required(t('account.my_profile.form.required')),
//     // .length(11, t('auth.register.form.error.phone_length'))
//     // .required(t('auth.register.form.error.required')),
//     gender: yup.string().required(t('account.my_profile.form.required'))
//   });

// export default function Page() {
//   const { t } = useLocalization();
//   // const { user_phone_format } = useAppSelector((state) => state.config);
//   // const { user_phone_format } = useAppSelector((state) => state.config);
//   const { data: profileInfo } = useGetProfileInfoQuery();
//   const [updateProfile] = useUpdateProfileMutation();
//   const [phoneError, setPhoneError] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');

//   const [responseMessage, setResponseMessage] = useState({
//     title: '',
//     content: ''
//   });

//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     control,
//     reset,
//     formState: { errors }
//   } = useForm<AccountProfileFormType>({
//     resolver: yupResolver(accountProfileFormSchema(t))
//   });

//   const handleSuccess = () => {
//     setResponseMessage({
//       title: t('account.my_profile.form.success.title').toString(),
//       content: t('account.my_profile.form.success.description').toString()
//     });
//     setIsModalOpen(true);
//   };

//   const handleError = () => {
//     setResponseMessage({
//       title: t('account.my_profile.form.error.title').toString(),
//       content: t('account.my_profile.form.error.description').toString()
//     });
//     // setIsModalOpen(true);
//   };

//   const handleModalClick = () => {
//     // setIsModalOpen(false);
//   };

//   const onSubmit: SubmitHandler<AccountProfileFormType> = async (data) => {
//     if (isValidPhoneNumber(phoneNumber)) {
//       setPhoneError('');
//       const dateOfBirth = `${data.birthdate.year}-${data.birthdate.month}-${data.birthdate.day}`;

//       if ('birthdate' in data) {
//         delete data.birthdate;
//       }

//       updateProfile({
//         date_of_birth: dateOfBirth,
//         ...data
//       })
//         .unwrap()
//         .then(handleSuccess)
//         .catch(handleError);
//     } else if (!phoneNumber) {
//       setPhoneError('This field is required')
//     } else {
//       setPhoneError('Invalid phone number');
//     }
//   };

//   const buildOptionDays = () => {
//     const days = Array.from({ length: 31 }, (_, index) => {
//       const day = (index + 1).toString().padStart(2, '0');
//       return { label: day, value: day };
//     });

//     return days;
//   };

//   const buildOptionMonths = () => {
//     const months = [
//       'january',
//       'february',
//       'march',
//       'april',
//       'may',
//       'june',
//       'july',
//       'august',
//       'september',
//       'october',
//       'november',
//       'december'
//     ];

//     const options = months.map((month, index) => {
//       const monthValue = (index + 1).toString().padStart(2, '0');
//       return {
//         label: t(`account.my_profile.form.months.${month}`),
//         value: monthValue
//       };
//     });

//     return options;
//   };

//   const buildOptionYears = () => {
//     const currentYear = new Date().getFullYear();
//     const minOffset = 0;
//     const maxOffset = 80;

//     const years = Array.from(
//       { length: maxOffset - minOffset + 1 },
//       (_, index) => {
//         const year = currentYear - index;
//         return { label: year, value: year };
//       }
//     );

//     return years;
//   };

//   useEffect(() => {
//     const todayDate = new Date().toISOString().slice(0, 10);

//     const {
//       first_name = '',
//       last_name = '',
//       phone = '',
//       gender = '',
//       email_allowed = false,
//       sms_allowed = false,
//       date_of_birth = todayDate
//     } = profileInfo || {};

//     const [year, month, day] =
//       date_of_birth?.split('-') ?? todayDate.split('-');

//     reset({
//       first_name,
//       last_name,
//       phone,
//       gender,
//       email_allowed,
//       sms_allowed,
//       birthdate: {
//         day,
//         month,
//         year
//       }
//     });
//   }, [profileInfo, reset]);

//   // const onPhoneNumberChange = (value) => {
//   //   if (typeof value !== 'string') {
//   //     setPhoneError('Invalid input');
//   //     return;
//   //   }
//   //   errors.phone = null;
//   //   setPhoneNumber(value);

//   //   // if (isValidPhoneNumber(value)) {
//   //   //   setPhoneError('');
//   //   // } else {
//   //   //   setPhoneError('Invalid phone number');
//   //   // }
//   // };

//   const onPhoneNumberChange = (value) => {
//     // errors.phone = null;
//     if (typeof value !== 'string') {
//       setPhoneError('Invalid input type');
//       return;
//     }
//     setPhoneNumber(value);
//   };

//   return (
//     <div>
//       <div className="p-6 bg-gray-150 flex items-center lg:flex-row flex-col">
//         <h3 className="text-2xl text-center ">
//           {t('account.my_profile.header.title')}
//         </h3>
//         <p className="border_line lg:block hidden"></p>
//         <p className="text-center text-base">
//           {t('account.my_profile.header.subtitle')}
//         </p>
//       </div>
//       <div className="flex">
//         <form
//           onSubmit={handleSubmit(onSubmit)}
//           className="border border-gray-500 mt-5 p-6 lg:px-24 lg:py-10 lg:w-full"
//         >
//           <div className="mb-5 flex flex-col gap-5 lg:flex-row w-full lg:gap-x-7">
//             <div className="lg:w-6/12 w-full">
//               <Input
//                 type="text"
//                 label={t('account.my_profile.form.name.placeholder')}
//                 className="w-full"
//                 {...register('first_name')}
//                 error={errors.first_name}
//               />
//             </div>
//             <div className="lg:w-6/12 w-full">
//               <Input
//                 type="text"
//                 label={t('account.my_profile.form.surname.placeholder')}
//                 className="w-full"
//                 {...register('last_name')}
//                 error={errors.last_name}
//               />
//             </div>
//           </div>
//           <div className="mb-5 flex flex-col gap-5 lg:flex-row w-full lg:gap-x-7">
//             <div className="lg:w-6/12 w-full">
//               <Input
//                 name="email"
//                 label={t('account.my_profile.form.email.placeholder')}
//                 type="email"
//                 value={profileInfo?.email ?? ''}
//                 disabled
//                 className="mb-5 w-full"
//               />
//             </div>
//             <div className="mb-5 lg:w-6/12 w-full">
//               <label className="lg:text-base text-sm mb-2">Phone Number*</label>
//               <br />
//               <div className={clsx({ 'mb-4': errors.phone })}>
//                 <div className="flex items-center number_register relative mt-2">
//                   <PhoneInput
//                     international
//                     value={phoneNumber}
//                     error={errors.phone}
//                     {...register('phone')}
//                     onChange={onPhoneNumberChange}
//                     className="lg:h-10 h-10 w-full border border-gray-500 bg-white focus:outline-none"
//                   />
//                 </div>
//                 {phoneError && <p className="text_red text-xs">{phoneError}</p>}
//                 {errors.phone && (
//                   <p className="text_red text-xs">{errors.phone.message}</p>
//                 )}
//               </div>
//             </div>
//           </div>
//           <div className="mb-5 flex flex-col gap-5 lg:flex-row w-full lg:gap-x-7">
//             <div className="w-full lg:w-6/12">
//               <label className="text-black mb-2 block">Birth Day*</label>
//               <div className="flex items-center gap-2 sm:flex-row">
//                 <div className="lg:w-full  w-full">
//                   <Select
//                     className="w-full border-gray-400 text-base text-gray-800 bg-white"
//                     options={buildOptionDays()}
//                     {...register('birthdate.day')}
//                   />
//                 </div>
//                 <div className="lg:w-full w-full">
//                   <Select
//                     className="w-full border-gray-400 text-base text-gray-800 bg-white"
//                     options={buildOptionMonths()}
//                     {...register('birthdate.month')}
//                   />
//                 </div>
//                 <div className="lg:w-full w-full">
//                   <Select
//                     className="w-full border-gray-400 text-base text-gray-800 bg-white pr-0.5"
//                     options={buildOptionYears()}
//                     {...register('birthdate.year')}
//                   />
//                 </div>
//               </div>
//               {errors && (
//                 <div className="mt-1 text-sm text-error">
//                   {errors.birthdate?.message}
//                 </div>
//               )}
//             </div>
//             <div className="mb-6 lg:w-6/12 w-full">
//               <label className="text-base text-black mb-3 block">Gender*</label>
//               <div className="flex flex-wrap gap-4">
//                 <Radio
//                   className="accent-primary"
//                   name="gender"
//                   value="female"
//                   {...register('gender')}
//                 >
//                   {t('account.my_profile.form.gender.female')}
//                 </Radio>
//                 <Radio
//                   className="accent-primary"
//                   name="gender"
//                   value="male"
//                   {...register('gender')}
//                 >
//                   {t('account.my_profile.form.gender.male')}
//                 </Radio>
//                 <Radio
//                   className="accent-primary"
//                   name="gender"
//                   value="none"
//                   {...register('gender')}
//                 >
//                   {t('account.my_profile.form.gender.other')}
//                 </Radio>
//               </div>
//               {errors.gender?.type === 'typeError' && (
//                 <div className="text-sm text-error">
//                   {t('account.my_profile.form.required')}
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="mb-6">
//             <label className="text-base text-black mb-3 block">
//               {t('account.my_profile.form.communication_channel.title')}
//             </label>
//             <div className="flex gap-6">
//               <Checkbox
//                 className="accent-primary"
//                 {...register('email_allowed')}
//               >
//                 {t('account.my_profile.form.communication_channel.email')}
//               </Checkbox>
//               <Checkbox className="accent-primary" {...register('sms_allowed')}>
//                 {t('account.my_profile.form.communication_channel.sms')}
//               </Checkbox>
//             </div>
//           </div>
//           <Button type="submit" className="w-full pinkbtn">
//             {t('account.my_profile.form.submit_button')}
//           </Button>
//         </form>
//         {/* <div className="my-6 lg:ml-8">
//           <h2 className="text-3xl mb-4">
//             {t('account.my_profile.info.title')}
//           </h2>
//           <p className="text-sm font-medium">
//             <Trans
//               i18nKey="account.my_profile.info.content"
//               components={{
//                 ContactLink: (
//                   <Link href={ROUTES.ACCOUNT_CONTACT}>
//                     {t('account.my_profile.info.contact')}
//                   </Link>
//                 ),
//                 Faq: (
//                   <Link href={ROUTES.ACCOUNT_FAQ}>
//                     {t('account.my_profile.info.faq')}
//                   </Link>
//                 )
//               }}
//             />
//           </p>
//         </div> */}
//       </div>
//       <Modal
//         portalId="my-profile-modal"
//         open={isModalOpen}
//         setOpen={setIsModalOpen}
//       >
//         <div className="flex flex-col items-center justify-center gap-12 p-6">
//           <h3
//             className="text-2xl font-bold"
//             data-testid="account-my-profile-response"
//           >
//             {responseMessage.title}
//           </h3>
//           <p className="text-center">{responseMessage.content}</p>
//           <Button
//             onClick={handleModalClick}
//             appearance="outlined"
//             className="font-medium px-10 py-2 pinkbtn"
//           >
//             {t('account.my_profile.form.close_button')}
//           </Button>
//         </div>
//       </Modal>
//     </div>
//   );
// }
