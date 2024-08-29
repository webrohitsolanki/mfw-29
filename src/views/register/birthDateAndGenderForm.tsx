// import { Radio } from '@akinon/next/components';
// import { useLocalization } from '@akinon/next/hooks';
// import { yupResolver } from '@hookform/resolvers/yup';
// import { Select } from '@theme/components';
// import { RegisterFormType } from '@theme/types';
// import React from 'react';
// import { useForm } from 'react-hook-form';
// import * as yup from 'yup';
// import { Register } from '.';

// interface FormValues extends RegisterFormType {
//     dateOfBirth: {
//         day: string;
//         month: string;
//         year: string;
//     };
// }

// const BirthDateAndGenderForm = () => {
//     const { t, locale } = useLocalization();

//     const registerFormSchema = yup.object().shape({
//         dateOfBirth: yup.object().shape({
//             day: yup.number().required(t('account.my_profile.form.required')),
//             month: yup.number().required(t('account.my_profile.form.required')),
//             year: yup.number().required(t('account.my_profile.form.required'))
//         }).test(
//             'isValidBirthdate',
//             t('account.my_profile.form.birth_date.error.not_valid'),
//             (value) => {
//                 const { day, month, year } = value;
//                 const date = new Date(`${year}-${month}-${day}`);
//                 return date && date <= new Date();
//             }
//         ),
//         gender: yup.string().required(t('account.my_profile.form.required'))
//     });

//     const {
//         register,
//         handleSubmit,
//         formState: { errors },
//         control,
//         getValues
//     } = useForm<FormValues>({
//         resolver: yupResolver(registerFormSchema)
//     });

//     const onSubmit = (data: FormValues) => {
//         // Here you can send `data` wherever you need in your application
//         <Register datas={data} />
//         // Example: API call, dispatch action, etc.
//     };

//     const buildOptionDays = () => {
//         const days = Array.from({ length: 31 }, (_, index) => {
//             const day = (index + 1).toString().padStart(2, '0');
//             return { label: day, value: day };
//         });
//         return days;
//     };

//     const buildOptionMonths = () => {
//         const months = [
//             'january',
//             'february',
//             'march',
//             'april',
//             'may',
//             'june',
//             'july',
//             'august',
//             'september',
//             'october',
//             'november',
//             'december'
//         ];

//         const options = months.map((month, index) => {
//             const monthValue = (index + 1).toString().padStart(2, '0');
//             return {
//                 label: t(`account.my_profile.form.months.${month}`),
//                 value: monthValue
//             };
//         });

//         return options;
//     };

//     const buildOptionYears = () => {
//         const currentYear = new Date().getFullYear();
//         const minOffset = 0;
//         const maxOffset = 80;

//         const years = Array.from(
//             { length: maxOffset - minOffset + 1 },
//             (_, index) => {
//                 const year = currentYear - index;
//                 return { label: year.toString(), value: year.toString() };
//             }
//         );

//         return years;
//     };

//     return (
//         <div className="mb-5 flex flex-col gap-5 lg:flex-row w-full lg:gap-x-7">
//             <div className="w-6/12">
//                 <label className="text-black mb-2 block">Birth Day*</label>
//                 <div className="flex flex-col items-center gap-2 sm:flex-row">
//                     <div className="w-full sm:w-24">
//                         <Select
//                             className="w-full border-gray-400 text-base text-gray-800 bg-white"
//                             options={buildOptionDays()}
//                             {...register('dateOfBirth.day')}
//                         />
//                     </div>
//                     <div className="w-full sm:w-24">
//                         <Select
//                             className="w-full border-gray-400 text-base text-gray-800 bg-white"
//                             options={buildOptionMonths()}
//                             {...register('dateOfBirth.month')}
//                         />
//                     </div>
//                     <div className="w-full sm:w-24">
//                         <Select
//                             className="w-full border-gray-400 text-base text-gray-800 bg-white pr-0.5"
//                             options={buildOptionYears()}
//                             {...register('dateOfBirth.year')}
//                         />
//                     </div>
//                 </div>
//                 {/* {errors.dateOfBirth && (
//                     <div className="mt-1 text-sm text-error">
//                         {t(errors.dateOfBirth.message)}
//                     </div>
//                 )} */}
//             </div>
//             <div className="mb-6 w-6/12">
//                 <label className="text-base mb-3 block">Gender*</label>
//                 <div className="flex flex-wrap gap-4">
//                     <Radio
//                         className="accent-primary"
//                         name="gender"
//                         value="female"
//                         {...register('gender')}
//                     >
//                         {t('account.my_profile.form.gender.female')}
//                     </Radio>
//                     <Radio
//                         className="accent-primary"
//                         name="gender"
//                         value="male"
//                         {...register('gender')}
//                     >
//                         {t('account.my_profile.form.gender.male')}
//                     </Radio>
//                     <Radio
//                         className="accent-primary"
//                         name="gender"
//                         value="other"
//                         {...register('gender')}
//                     >
//                         {t('account.my_profile.form.gender.other')}
//                     </Radio>
//                 </div>
//                 {errors.gender && (
//                     <div className="text-sm text-error">
//                         {t(errors.gender.message)}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default BirthDateAndGenderForm;
