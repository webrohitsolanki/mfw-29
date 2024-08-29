// 'use client';

// import { yupResolver } from '@hookform/resolvers/yup';
// import clsx from 'clsx';
// import { signIn, SignInOptions } from 'next-auth/react';
// import { useState } from 'react';
// import { SubmitHandler, useForm, Controller } from 'react-hook-form';
// import { useAppDispatch, useAppSelector } from '@akinon/next/redux/hooks';
// import { RegisterFormType } from '@theme/types';
// import { Button, Checkbox, Icon, Input, Modal, Select } from '@theme/components';
// import * as yup from 'yup';
// import { useCaptcha, useLocalization, useRouter } from '@akinon/next/hooks';
// import { AuthError } from '@akinon/next/types';
// import PluginModule, { Component } from '@akinon/next/components/plugin-module';
// import PasswordRulesFeedback from '@theme/components/password-rules-feedback';
// import { showPopup as showOtpPopup } from '@akinon/pz-otp/src/redux/reducer';
// import BirthDateAndGenderForm from './birthDateAndGenderForm';

// // export interface FormValues extends RegisterFormType {
// //   dateOfBirth: DateOfBirth;
// // }

// // interface DateOfBirth {
// //   day: string;
// //   month: string;
// //   year: string;
// // }

// // import { setConstantValue } from 'typescript';

// const registerFormSchema = (t) =>
//     yup.object().shape({
//         email: yup
//             .string()
//             .email(t('auth.register.form.error.email_valid'))
//             .required(t('auth.register.form.error.required')),
//         first_name: yup
//             .string()
//             .required(t('auth.register.form.error.required'))
//             .min(2, t('auth.register.form.error.name_min'))
//             .max(50, t('auth.register.form.error.name_max'))
//             .matches(
//                 /^[a-zA-ZğüşöçıİĞÜŞÖÇ\s]+$/,
//                 t('auth.register.form.error.name_match')
//             ),
//         last_name: yup
//             .string()
//             .required(t('auth.register.form.error.required'))
//             .min(2, t('auth.register.form.error.surname_min'))
//             .max(50, t('auth.register.form.error.surname_max'))
//             .matches(
//                 /^[a-zA-ZğüşöçıİĞÜŞÖÇ\s]+$/,
//                 t('auth.register.form.error.surname_match')
//             ),
//         // remove password
//         password: yup
//             .string()
//             .required(t('auth.register.form.error.required'))
//             // .matches(
//             //   /^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[^a-zA-Z\d]).{6,}$/,
//             //   t('auth.register.form.error.password_rule')
//             // )
//             .max(50, t('auth.register.form.error.password_max')),
//         phone: yup
//             .string()
//             .transform((value: string) => value.replace(/_/g, '').replace(/ /g, ''))
//             .length(11, t('auth.register.form.error.phone_length'))
//             .required(t('auth.register.form.error.required')),
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
//         confirm: yup
//             .boolean()
//             .oneOf([true], t('auth.register.form.error.required')),
//         kvkk_confirm: yup
//             .boolean()
//             .oneOf([true], t('auth.register.form.error.required'))
//     });

// export const Register = ({ datas }) => {
//     const { t, locale } = useLocalization();
//     const dispatch = useAppDispatch();
//     const [openModal, setOpenModal] = useState(false);
//     const otpPopupVisible = useAppSelector((state) => state.otp?.isPopupVisible);

//     const [contentModal, setContentModal] = useState({
//         title: undefined,
//         description: undefined
//     });

//     const STATIC_CONTENT = {
//         content_1: {
//             title: t('auth.register.form.agreements.membership.modal_title'),
//             description:
//                 "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"
//         },
//         content_2: {
//             title: t('auth.register.form.agreements.kvkk.modal_title'),
//             description:
//                 "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of 'de Finibus Bonorum et Malorum' (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, 'Lorem ipsum dolor sit amet..', comes from a line in section 1.10.32. The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham."
//         },
//         content_3: {
//             title: t('auth.register.form.agreements.email_communication.modal_title'),
//             description:
//                 "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
//         },
//         content_4: {
//             title: t('auth.register.form.agreements.sms_communication.modal_title'),
//             description:
//                 "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
//         }
//     };

//     const {
//         register,
//         handleSubmit,
//         control,
//         formState: { errors },
//         setError,
//         getValues,
//         watch
//     } = useForm<RegisterFormType>({
//         resolver: yupResolver(registerFormSchema(t))
//     });

//     const router = useRouter();
//     const passwordValue = watch('password', '');

//     const {
//         CaptchaView,
//         validated: captchaValidated,
//         isVisible: isCaptchaVisible,
//         validate: validateCaptcha
//     } = useCaptcha();

//     const [formError, setFormError] = useState(null);
//     const [showPassword, setShowPassword] = useState(false);
//     const { user_phone_format } = useAppSelector((state) => state.config);

//     const registerHandler: SubmitHandler<RegisterFormType> = async (data) => {

//         return await signIn('default', {
//             redirect: false,
//             callbackUrl: '/',
//             captchaValidated,
//             ...data
//         } as SignInOptions);
//     };

//     const onSubmit: SubmitHandler<RegisterFormType> = async (data) => {
//         const { dateOfBirth, ...formData } = data;
//         // const dateOfBirth = `${data.dateOfBirth.year}-${data.dateOfBirth.month}-${data.dateOfBirth.day}`;
//         const dateOfBirthString = `${dateOfBirth.day}-${dateOfBirth.month}-${dateOfBirth.year}`;

//         // const dataToSend = {
//         //   ...formData,
//         //   dateOfBirth: {
//         //     day: dateOfBirth.day,
//         //     month: dateOfBirth.month,
//         //     year: dateOfBirth.year
//         //   }
//         // };

//         const dateOfBirthFormatted = {
//             day: dateOfBirth.day.toString(),
//             month: dateOfBirth.month.toString(),
//             year: dateOfBirth.year.toString()
//         };
//         const dataToSend = {
//             ...formData,
//             dateOfBirth: dateOfBirthFormatted
//         };

//         const registerResponse = await registerHandler(dataToSend);
//         if (registerResponse.error === 'Captcha') {
//             if (await validateCaptcha()) {
//                 onSubmit(data);
//             }
//             return;
//         }

//         if (registerResponse.error) {
//             const errors: AuthError[] = JSON.parse(registerResponse.error);

//             if (errors.find((error) => error.type === 'captcha')) {
//                 if (await validateCaptcha()) {
//                     onSubmit(data);
//                 }

//                 return;
//             } else if (errors.find((error) => error.type === 'otp')) {
//                 if (showOtpPopup) {
//                     dispatch(showOtpPopup());
//                 }

//                 return;
//             }

//             const fieldErrors = errors.find((error) => error.type === 'field_errors')
//                 ?.data as { name: string; value: string[] }[];
//             const nonFieldErrors = errors.find(
//                 (error) => error.type === 'non_field_errors'
//             )?.data as string[];

//             fieldErrors?.forEach((item) => {
//                 setError(item.name as keyof RegisterFormType, {
//                     type: 'custom',
//                     message: item.value.join(', ')
//                 });
//             });

//             if (nonFieldErrors?.length) {
//                 setFormError(nonFieldErrors.join(', '));
//             }

//             return;
//         }

//         if (registerResponse.url) {
//             router.replace(registerResponse.url);
//             return;
//         }

//         // router.push('/');
//     };

//     const modalChange = (e, content) => {
//         e.preventDefault(e);
//         setContentModal(content);
//         setOpenModal(true);
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
//     // const handleDateChange = (event) => {

//     //   const date = new Date(event.target.value);
//     //   setValue('birthdate', {
//     //     day: date.getDate(),
//     //     month: date.getMonth() + 1,
//     //     year: date.getFullYear(),
//     //   });
//     // };

//     return (
//         <section className= "w-full py-10 px-5 md:py-0 md:block md:px-8 md:mx-auto lg:px-16" >
//         <Modal
//         title={ contentModal.title }
//     portalId = "portal-modal-container"
//     open = { openModal }
//     setOpen = { setOpenModal }
//     className = "w-3/4 md:max-w-xl"
//         >
//         <div className="p-4 max-h-80 overflow-auto" >
//             { contentModal.description }
//             < /div>
//             < /Modal>
//     {
//         otpPopupVisible && (
//             <PluginModule
//           component={ Component.Otp }
//         props = {{
//             data: getValues(),
//                 submitAction: registerHandler
//         }
//     }
//     />
//       )}
// <h2 className="mb-3 text-lg text-start text-black-800 font-light md:mb-9 md:text-2xl" >
//     { t('auth.register.title') }
//     < /h2>

//     < p className = "mb-3 text-xs leading-4 text-primary-400" >
//         { t('auth.register.subtitle') }
//         < /p>

//         < form onSubmit = { handleSubmit(onSubmit) } className = "flex flex-col gap-4" >
//             <input type="hidden" value = "register" {...register('formType') } />
//                 < input type = "hidden" value = { locale } {...register('locale') } />

//                     < div className = { clsx({ 'mb-4': errors.email })}>
//                         {/* email */ }
//                         < Input
// labelStyle = "floating"
// label = { t('auth.register.form.email.placeholder') }
// className = "h-14"
// {...register('email') }
// error = { errors.email }
// data - testid="register-email"
// required
//     />
//     </div>

//     < div
// className = {
//     clsx('lg:flex', {
//         'mb-4': errors.first_name || errors.last_name
// })}
//         >
//     <div className="w-full lg:pr-2" >
//         {/* first name */ }
//         < Input
// labelStyle = "floating"
// label = { t('auth.register.form.name.placeholder') }
// className = "block h-14"
// {...register('first_name') }
// error = { errors.first_name }
// data - testid="register-name"
// required
//     />
//     </div>



//     < div className = "w-full mt-4 lg:pl-2 lg:mt-0" >
//         {/* surname */ }
//         < Input
// labelStyle = "floating"
// label = { t('auth.register.form.surname.placeholder') }
// className = "block h-14"
// {...register('last_name') }
// error = { errors.last_name }
// data - testid="register-surname"
// required
//     />
//     </div>

// {/* <div className="w-full mt-4 lg:pl-2 lg:mt-0">
//             dob
//             <Input
//               labelStyle="floating"
//               // label={t('auth.register.form.name.placeholder')}
//               label={"dob"}
//               className="block h-14"
//               {...register('dob')}
//               error={errors.dob}
//               data-testid="register-dob"
//               required
//             />
//           </div> */}
// </div>

//     < div
// className = {
//     clsx('lg:flex', {
//         'mb-4': errors.dateOfBirth
// })}
//         >
// {/* <div className="w-full lg:pr-2">
//               first name
//             <Input
//               labelStyle="floating"
//               type='Date'
//               // label={t('auth.register.form.name.placeholder')}
//               label={"marriage Annivesary"}
//               className="block h-14"
//               {...register('marriage_annivesary')}
//               error={errors.marriage_annivesary}
//               data-testid="register-marriage_annivesary"
//               required
//             />
//           </div> */}

//     < div className = "w-6/12" >
//         <label className="text-black mb-2 block" > Birth Day * </label>
//             < div className = "flex flex-col items-center gap-2 sm:flex-row" >
//                 <div className="w-full sm:w-24" >
//                     <Select
//                   className="w-full border-gray-400 text-base text-gray-800 bg-white"
// options = { buildOptionDays() }
// {...register('dateOfBirth.day') }
// />
//     < /div>
//     < div className = "w-full sm:w-24" >
//         <Select
//                   className="w-full border-gray-400 text-base text-gray-800 bg-white"
// options = { buildOptionMonths() }
// {...register('dateOfBirth.month') }
// />
//     < /div>
//     < div className = "w-full sm:w-24" >
//         <Select
//                   className="w-full border-gray-400 text-base text-gray-800 bg-white pr-0.5"
// options = { buildOptionYears() }
// {...register('dateOfBirth.year') }
// />
//     < /div>
//     < /div>
// {/* {errors.dateOfBirth && (
//                     <div className="mt-1 text-sm text-error">
//                         {t(errors.dateOfBirth.message)}
//                     </div>
//                 )} */}
// </div>

// {/* <div className="w-full mt-4 lg:pl-2 lg:mt-0">
//             surname
//             <Input
//               labelStyle="floating"
//               label={t('auth.register.form.surname.placeholder')}
//               className="block h-14"
//               {...register('last_name')}
//               error={errors.last_name}
//               data-testid="register-surname"
//               required
//             />
//           </div> */}

// <div className="w-full mt-4 lg:pl-2 lg:mt-0" >
//     {/* dob */ }
// {/* <Input
//               labelStyle="floating"
//               type='Date'
//               // label={t('auth.register.form.name.placeholder')}
//               label={"dob"}
//               className="block h-14"
//               {...register('dateOfBirth')}
//               // onChange={handleDateChange}
//               // error={errors.birthdate}
//               data-testid="register-birthdate"
//               required
//             /> */}
// </div>
//     < /div>

//     < div className = { clsx('relative', { 'mb-4': errors.password })}>
//         <div className="relative" >
//             {/* password */ }
//             < Input
// labelStyle = "floating"
// label = { t('auth.register.form.password.placeholder') }
// className = "h-14 pr-16"
// type = { showPassword? 'text': 'password' }
// {...register('password') }
// data - testid="register-password"
// required
//     />
//     {/* show password icon */ }
//     < Icon
// size = { 25}
// className = "absolute h-full flex items-center top-0 right-4 cursor-pointer"
// name = { showPassword? 'eye-on': 'eye-off' }
// onClick = {() => setShowPassword(!showPassword)}
// />
//     < /div>

// {
//     errors.password && (
//         <span className="mt-1 text-sm text-error" >
//             { errors.password.message }
//             < /span>
//           )
// }

// <PasswordRulesFeedback
//             password={ passwordValue }
// isVisible = { errors?.password?.message? true: false }
//     />
//     </div>



//     < div className = { clsx({ 'mb-4': errors.gender })}>
//         {/* gender */ }
//         < Input
// labelStyle = "floating"
// label = { "gender"}
// className = "h-14"
// {...register('gender') }
// error = { errors.email }
// data - testid="register-gender"
// required
//     />
//     </div>

//     < div className = { clsx({ 'mb-4': errors.phone })}>
//         {/* phoneNo */ }
//         < Input
// labelStyle = "floating"
// label = { t('auth.register.form.phone.placeholder') }
// className = "h-14"
// format = { user_phone_format.replace(/\9/g, '#') }
// allowEmptyFormatting
// mask = "_"
// control = { control }
// {...register('phone') }
// error = { errors.phone }
// data - testid="register-phone"
// required
//     />
//     </div>

//     < div className = "text-sm text-black-400 md:text-xs" >
//         <p className="mb-4" > { t('auth.register.form.agreements.title') }: </p>

//             < Checkbox
// className = { clsx(errors.confirm ? 'mb-8' : 'mb-4') }
// {...register('confirm') }
// error = { errors.confirm }
// data - testid="register-agreement-1"
//     >
//     { t('auth.register.form.agreements.membership.label') }
//     < br />
//     <span className="cursor-pointer" >
//         <b
//                 onClick={
//     (e) => {
//         modalChange(e, STATIC_CONTENT.content_1);
//     }
// }
//               >
//     <u>{ t('auth.register.form.agreements.click_contract_text') } < /u>
//     < /b>
//     < /span>
//     < /Checkbox>

//     < Checkbox
// className = { clsx(errors.kvkk_confirm ? 'mb-8' : 'mb-4') }
// {...register('kvkk_confirm') }
// error = { errors.kvkk_confirm }
// data - testid="register-agreement-2"
//     >
//     { t('auth.register.form.agreements.kvkk.label') }
//     < br />
//     <span className="cursor-pointer" >
//         <b
//                 onClick={
//     (e) => {
//         modalChange(e, STATIC_CONTENT.content_2);
//     }
// }
//               >
//     <u>{ t('auth.register.form.agreements.read_approve') } < /u>
//     < /b>
//     < /span>
//     < /Checkbox>

//     < Checkbox
// className = "mb-4"
// {...register('email_allowed') }
// data - testid="register-agreement-3"
//     >
//     { t('auth.register.form.agreements.email_communication.label') }
//     < br />
//     <span className="cursor-pointer" >
//         <b
//                 onClick={
//     (e) => {
//         modalChange(e, STATIC_CONTENT.content_3);
//     }
// }
//               >
//     <u>{ t('auth.register.form.agreements.read_approve') } < /u>
//     < /b>
//     < /span>
//     < /Checkbox>

//     < Checkbox
// className = "mb-4"
// {...register('sms_allowed') }
// data - testid="register-agreement-4"
//     >
//     { t('auth.register.form.agreements.sms_communication.label') } < br />
//     <span className="cursor-pointer" >
//         <b
//                 onClick={
//     (e) => {
//         modalChange(e, STATIC_CONTENT.content_4);
//     }
// }
//               >
//     <u>{ t('auth.register.form.agreements.read_approve') } < /u>
//     < /b>
//     < /span>
//     < /Checkbox>
//     < /div>

//     < label className = "text-error mb-2 hidden" > </label>

// {
//     formError && <p className="text-error text-xs" > { formError } < /p>}

//         < div className = "flex justify-center" >
//             <CaptchaView className="mb-5" data - testid="register-captcha" />
//                 </div>

//                 < Button
//     className = "text-xs font-semibold uppercase w-full h-14"
//     type = "submit"
//     disabled = { isCaptchaVisible && !captchaValidated
// }
// data - testid="register-submit"
//     >
//     { t('auth.register.form.submit') }
//     < /Button>

//     < p className = "text-xs text-gray-600 italic mt-3" >
//         { t('auth.register.form.mandatory_fields') }
//         < /p>
//         < /form>
//         < /section>
//   );
// };