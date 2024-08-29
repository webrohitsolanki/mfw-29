import React, { useEffect, useState } from 'react';
import Style from './index.module.css';
import { Button, Icon, Input, Radio } from '@akinon/next/components';
import { Checkbox } from '@theme/components';
import { boolean } from 'yup';
import { getCountries, getCountryCallingCode } from 'react-phone-number-input';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-input-2/lib/style.css';
import 'react-phone-number-input/style.css';
import clsx from 'clsx';
import { useRouter } from '@akinon/next/hooks';

interface FormData {
  first_name: string;
  last_name: string;
  gender: string;
  company_name: string;
  position_title: string;
  company_registration_number: string;
  id_passport_number: string;
  email: string;
  mobile_number: string;
  website: string;
  industry: string;
  product_types: string;
  proposed_product_listings: string;
  average_skus_per_product: string;
  ecommerce_departments: object;
  tenant_plan: string;
  on_marketplaces: string;
  average_domestic_sales_monthly: string;
  average_order_weight_grams: string;
  average_order_value_usd: string;
  average_international_sales_monthly: string;
  average_international_order_weight: string;
  average_international_order_value: string;
  how_did_you_hear: string;
  additional_information: string;
  application_date: string;
  authorized_signature: boolean;
  confirmation: boolean;
  registration_certificate?: File;
  signature?: File;
}

interface Errors {
  first_name: string;
  last_name: string;
  gender: string;
  company_name: string;
  position_title: string;
  company_registration_number: string;
  id_passport_number: string;
  email: string;
  mobile_number: string;
  website: string;
  industry: string;
  product_types: string;
  proposed_product_listings: string;
  average_skus_per_product: string;
  ecommerce_departments: object;
  tenant_plan: string;
  on_marketplaces: string;
  average_domestic_sales_monthly: string;
  average_order_weight_grams: string;
  average_order_value_usd: string;
  average_international_sales_monthly: string;
  average_international_order_weight: string;
  average_international_order_value: string;
  how_did_you_hear: string;
  additional_information: string;
  application_date: string;
  authorized_signature: boolean;
  confirmation: boolean;
  registration_certificate?: File;
  signature?: File;
}

const TenantApplication = () => {
  const [phoneError, setPhoneError] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [maxDate, setMaxDate] = useState('');
  const [fileName, setFileName] = useState('');
  const router = useRouter();
  const [fileName1, setFileName1] = useState('');
  const [formData, setFormData] = useState<FormData>({
    first_name: '',
    last_name: '',
    gender: '',
    company_name: '',
    position_title: '',
    company_registration_number: '',
    id_passport_number: '',
    email: '',
    mobile_number: '',
    website: '',
    industry: '',
    product_types: '',
    proposed_product_listings: '',
    average_skus_per_product: '',
    ecommerce_departments: {},
    tenant_plan: '',
    on_marketplaces: '',
    average_domestic_sales_monthly: '',
    average_order_weight_grams: '',
    average_order_value_usd: '',
    average_international_sales_monthly: '',
    average_international_order_weight: '',
    average_international_order_value: '',
    how_did_you_hear: '',
    additional_information: '',
    application_date: '',
    authorized_signature: false,
    confirmation: false,
    registration_certificate: null,
    signature: null
  });

  const [errors, setErrors] = useState<Errors>({
    first_name: '',
    last_name: '',
    gender: '',
    company_name: '',
    position_title: '',
    company_registration_number: '',
    id_passport_number: '',
    authorized_signature: false,
    confirmation: false,
    email: '',
    mobile_number: '',
    website: '',
    industry: '',
    product_types: '',
    proposed_product_listings: '',
    average_skus_per_product: '',
    ecommerce_departments: {},
    tenant_plan: '',
    on_marketplaces: '',
    average_domestic_sales_monthly: '',
    average_order_weight_grams: '',
    average_order_value_usd: '',
    average_international_sales_monthly: '',
    average_international_order_weight: '',
    average_international_order_value: '',
    how_did_you_hear: '',
    additional_information: '',
    application_date: '',
    registration_certificate: null,
    signature: null
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: ''
    }));
  };

  const validate = (): boolean => {
    const newErrors: Errors = { ...errors };

    const requiredFields = [
      'first_name',
      'last_name',
      'gender',
      'company_name',
      'position_title',
      'company_registration_number',
      'id_passport_number',
      'email',
      'mobile_number',
      'website',
      'industry',
      'product_types',
      'proposed_product_listings',
      'average_skus_per_product',
      'ecommerce_departments',
      'tenant_plan',
      'on_marketplaces',
      // 'marketplacesNames',
      'average_domestic_sales_monthly',
      'average_order_weight_grams',
      'average_order_value_usd',
      'average_international_sales_monthly',
      'average_international_order_weight',
      'average_international_order_value',
      'how_did_you_hear',
      'additional_information',
      'application_date',
      'authorized_signature',
      'confirmation',
      'registration_certificate',
      'signature'
    ];

    requiredFields.forEach((field) => {
      if (typeof formData[field] === 'string' && !formData[field].trim()) {
        newErrors[field] = 'This field is required';
      } else if (typeof formData[field] === 'boolean' && !formData[field]) {
        newErrors[field] = 'This field is required';
      } else {
        newErrors[field] = '';
      }
    });

    if (!phoneNumber || !phoneNumber.trim()) {
      newErrors.mobile_number = 'This field is required';
    } else if (isValidPhoneNumber(phoneNumber)) {
      newErrors.mobile_number = '';
    }
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (file) {
      setFormData({
        ...formData,
        [name]: file
      });
      setFileName(file.name);
    }
  };

  const handleRemoveFile = () => {
    setFormData({
      ...formData,
      registration_certificate: null
    });
    setFileName('');
  };

  const handleFileChange1 = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (file) {
      setFormData({
        ...formData,
        [name]: file
      });
      setFileName1(file.name);
    }
  };

  const handleRemoveFile1 = () => {
    setFormData({
      ...formData,
      registration_certificate: null
    });
    setFileName1('');
  };

  const onPhoneNumberChange = (phoneNumber) => {
    errors.mobile_number = null;
    if (typeof phoneNumber !== 'string') {
      // setPhoneError('Invalid input type');
      return;
    }
    setPhoneNumber(phoneNumber);
    if (isValidPhoneNumber(phoneNumber) === false) {
      setPhoneError('Invalid phone number');
    } else {
      setPhoneError('');
    }
  };

  // const handleCheckboxChange = (event) => {
  //   const { name, value, checked } = event.target;

  //   if (name === 'ecommerce_departments') {
  //     let updatedDepartments = formData.ecommerce_departments
  //       .split(',')
  //       .map((department) => department.trim())
  //       .filter((department) => department); // filter out empty strings

  //     if (checked) {
  //       if (!updatedDepartments.includes(value)) {
  //         updatedDepartments.push(value);
  //       }
  //     } else {
  //       updatedDepartments = updatedDepartments.filter(
  //         (department) => department !== value
  //       );
  //     }

  //     setFormData((prevState) => ({
  //       ...prevState,
  //       ecommerce_departments: updatedDepartments.join(', ')
  //     }));
  //   } else {
  //     setFormData((prevState) => ({
  //       ...prevState,
  //       [name]: ''
  //     }));
  //   }
  // };

  const handleCheckboxChange = (event) => {
    const { name, value, checked } = event.target;

    if (name === 'ecommerce_departments') {
      setFormData((prevState) => ({
        ...prevState,
        ecommerce_departments: {
          ...prevState.ecommerce_departments,
          [`"${value}"`]: `"${value}"`
        }
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    formData.mobile_number = phoneNumber;
    // formData.ecommerce_departments = JSON.parse(
    //   formData.ecommerce_departments
    // );

    const isValid = validate();

    if (isValid) {
      const formDataToSend = new FormData();

      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });


      try {
        const response = await fetch(
          'https://2231-157-119-200-84.ngrok-free.app/api/applications/',
          {
            method: 'POST',
            body: formDataToSend
          }
        );


        if (!response.ok) {
          throw new Error('Network response was not ok');
        } else {
          window.location.href = '/tenant-application/';
        }

        const data = await response.json();
      } catch (error) {
        console.error('There was an error submitting the form!', error);
      }
    }
  };

  useEffect(() => {
    const dtToday = new Date();

    const month = (dtToday.getMonth() + 1).toString().padStart(2, '0');
    const day = dtToday.getDate().toString().padStart(2, '0');
    const year = dtToday.getFullYear();

    const maxDate = `${year}-${month}-${day}`;
    setMaxDate(maxDate);
  }, []);

  return (
    <div className="container-md container main_container_header">
      <div className="lg:w-9/12 w-full mx-auto">
        <h1 className="lg:text-5xl text-2xl text-[#003744] my-10 w-full mx-auto text-center">
          <i>Tenant Application</i>
        </h1>
        <div className="border lg:px-16 lg:py-5 p-3">
          <h2 className="text-center lg:text-2xl text-base font-semibold">
            Mall For Women Tenant Application
          </h2>
          <p className="text-center lg:text-base text-xs color=[#C576AC]">
            For all tenant plans. Please complete & sign digitally. Its FREE to
            apply.
          </p>
          <form onSubmit={handleSubmit} className="w-full mt-8 relative">
            <div className="flex w-full lg:flex-row flex-col items-center mt-5 gap-7">
              <div className="lg:w-6/12 w-full relative">
                <label className="text-base">First Name *</label>
                <Input
                  className="w-full text-base h-14"
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                />
                {errors.first_name && (
                  <p className="text_red absolute -bottom-5 left-0  text-xs mt-2">
                    {errors.first_name}
                  </p>
                )}
              </div>
              <div className="lg:w-6/12 w-full relative">
                <label className="text-base">Last Name *</label>
                <Input
                  className="w-full text-base h-14"
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                />
                {errors.last_name && (
                  <p className="text_red text-xs mt-2 absolute -bottom-5 left-0">
                    {errors.last_name}
                  </p>
                )}
              </div>
            </div>
            <div className="text-base mt-8 relative ">
              <label className="text-base">Gender*</label>
              <div className="flex mt-2 items-center w-full tenant_radio_group">
                <Radio
                  value="Male"
                  className="w-4/12 text-base"
                  name="gender"
                  checked={formData.gender === 'Male'}
                  onChange={handleChange}
                >
                  Male
                </Radio>
                <Radio
                  className="w-4/12 text-base"
                  value="Female"
                  name="gender"
                  checked={formData.gender === 'Female'}
                  onChange={handleChange}
                >
                  Female
                </Radio>
              </div>
              {errors.gender && (
                <p className="text_red text-xs mt-2 absolute -bottom-5 left-0">
                  {errors.gender}
                </p>
              )}
            </div>
            <div className="w-full mt-8 relative">
              <label className="text-base">Company Name*</label>
              <Input
                className="w-full text-base h-14"
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
              />
              {errors.company_name && (
                <p className="text_red text-xs mt-2 absolute -bottom-5 left-0">
                  {errors.company_name}
                </p>
              )}
            </div>
            <div className="w-full mt-8 relative">
              <label className="text-base">Position/Title*</label>
              <Input
                className="w-full text-base h-14"
                type="text"
                name="position_title"
                value={formData.position_title}
                onChange={handleChange}
              />
              {errors.position_title && (
                <p className="text_red text-xs mt-2 absolute -bottom-5 left-0">
                  {errors.position_title}
                </p>
              )}
            </div>
            <div className="w-full mt-8 relative">
              <label className="text-base">Company Registration Number*</label>
              <Input
                className="w-full text-base h-14"
                type="text"
                name="company_registration_number"
                value={formData.company_registration_number}
                onChange={handleChange}
              />
              {errors.company_registration_number && (
                <p className="text_red text-xs mt-2 absolute -bottom-5 left-0">
                  {errors.company_registration_number}
                </p>
              )}
            </div>
            <div className="w-full mt-8 relative">
              <label className="text-base">
                Average International Order Number*
              </label>
              <Input
                className="w-full text-base h-14"
                type="number"
                name="average_international_order_value"
                value={formData.average_international_order_value}
                onChange={handleChange}
              />
              {errors.average_international_order_value && (
                <p className="text_red text-xs mt-2 absolute -bottom-5 left-0">
                  {errors.average_international_order_value}
                </p>
              )}
            </div>
            <div className="w-full mt-8 relative h-52 pb-10 outline-dashed outline-1 outline-[#C576AC] ">
              <div className="flex flex-col justify-center items-center h-full">
                <Icon name="upload-file" size={24} className="text-[#C576AC]" />

                {!fileName ? (
                  <>
                    <h2 className="mt-2 text-xl">
                      Upload Registration Certificate
                    </h2>
                    <Button className="pinkbtn mt-2 w-[250px]">
                      BROWSE FOR FILE
                    </Button>
                    <label className="absolute top-0 bottom-0 right-0 left-0 z-20 opacity-0">
                      <Input
                        className="text-base w-full h-full"
                        type="file"
                        name="registration_certificate"
                        onChange={handleFileChange}
                      />
                    </label>
                  </>
                ) : (
                  <div className="mt-4 text-center">
                    <p className="mt-2 text-xl">Uploaded file: {fileName}</p>
                    <Button className="pinkbtn mt-2" onClick={handleRemoveFile}>
                      REMOVE FILE
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="w-full mt-8 relative">
              <label className="text-base">ID Number/Passport Number*</label>
              <Input
                className="w-full text-base h-14"
                type="number"
                name="id_passport_number"
                value={formData.id_passport_number}
                onChange={handleChange}
              />
              {errors.id_passport_number && (
                <p className="text_red text-xs mt-2 absolute -bottom-5 left-0">
                  {errors.id_passport_number}
                </p>
              )}
            </div>
            <div className="w-full mt-8 relative">
              <label className="text-base">Email*</label>
              <Input
                className="w-full text-base h-14"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text_red text-xs mt-2 absolute -bottom-5 left-0">
                  {errors.email}
                </p>
              )}
            </div>
            <div className="w-full mt-8 relative">
              <label className="text-base">Mobile Number*</label>
              {/* <Input
                className="w-full text-base h-14
                type="number"
                name="mobile_number"
                value={formData.mobile_number}
                onChange={handleChange}
              /> */}
              <PhoneInput
                international
                // defaultCountry={selectedCountry}
                value={phoneNumber}
                error={errors.mobile_number}
                onChange={onPhoneNumberChange}
                className="lg:h-14 h-10 w-full border border-gray-500 bg-white focus:outline-none"
              />
              {errors.mobile_number && (
                <p className="text_red text-xs mt-2 absolute -bottom-5 left-0">
                  {errors.mobile_number}
                </p>
              )}
              {phoneError && (
                <p className="lg:text-[14px] mt-2 text-error text-[8px]">
                  {phoneError}
                </p>
              )}
            </div>
            <div className="w-full mt-8 relative">
              <label className="text-base">Website*</label>
              <Input
                className="w-full text-base h-14"
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
              />
              {errors.website && (
                <p className="text_red text-xs mt-2 absolute -bottom-5 left-0">
                  {errors.website}
                </p>
              )}
            </div>
            <div className="w-full mt-8 relative">
              <label className="text-base">Industry*</label>
              <Input
                className="w-full text-base h-14"
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
              />
              {errors.industry && (
                <p className="text_red text-xs mt-2 absolute -bottom-5 left-0">
                  {errors.industry}
                </p>
              )}
            </div>
            <div className="w-full mt-8 relative">
              <label className="text-base">Product Types*</label>
              <Input
                className="w-full text-base h-14"
                type="text"
                name="product_types"
                value={formData.product_types}
                onChange={handleChange}
              />
              {errors.product_types && (
                <p className="text_red text-xs mt-2 absolute -bottom-5 left-0">
                  {errors.product_types}
                </p>
              )}
            </div>
            <div className="flex lg:flex-row flex-col w-full gap-7 mt-8 items-center ">
              <div className="lg:w-6/12 w-full relative ">
                <label className="text-base">
                  Proposed Product or Service Listings*
                </label>
                <div className="flex items-center justify-between mt-5 tenant_radio_group">
                  <Radio
                    name="proposed_product_listings"
                    value="1-4"
                    checked={formData.proposed_product_listings === '1-4'}
                    onChange={handleChange}
                  >
                    1-4
                  </Radio>
                  <Radio
                    name="proposed_product_listings"
                    value="5-9"
                    checked={formData.proposed_product_listings === '5-9'}
                    onChange={handleChange}
                    // radioTextClassName="text-base"
                  >
                    5-9
                  </Radio>
                  <Radio
                    name="proposed_product_listings"
                    value="10+"
                    checked={formData.proposed_product_listings === '10+'}
                    onChange={handleChange}
                  >
                    10+
                  </Radio>
                </div>
                {errors.proposed_product_listings && (
                  <p className="text_red text-xs mt-2 absolute -bottom-5 left-0">
                    {errors.proposed_product_listings}
                  </p>
                )}
              </div>
              <div className="lg:w-6/12 w-full relative">
                <label className="text-base">
                  Average number of SKUs per product*
                </label>
                <Input
                  className="w-full text-base h-14"
                  type="number"
                  name="average_skus_per_product"
                  value={formData.average_skus_per_product}
                  onChange={handleChange}
                />
                {errors.average_skus_per_product && (
                  <p className="text_red text-xs mt-2 absolute -bottom-5 left-0">
                    {errors.average_skus_per_product}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-8 relative">
              <label className="text-base">
                Mall For Women E-Commerce Departments*
              </label>
              <div className="w-full mt-5 gap-7">
                {[
                  'Beauty',
                  'Hair',
                  'Fashion',
                  'Intimate',
                  'Bath & Body',
                  'Health & Wellness',
                  'Home & Decor',
                  'Gadgets',
                  'Kids',
                  'Food & Beverage',
                  'Books',
                  'Other'
                ].map((department) => (
                  <Checkbox
                    className="text-base mt-2"
                    name="ecommerce_departments"
                    key={department}
                    value={department}
                    checked={
                      formData.ecommerce_departments[department] || false
                    }
                    onChange={handleCheckboxChange}
                  >
                    {department}
                  </Checkbox>
                ))}
              </div>
              {/* {!formData.ecommerce_departments &&
                errors.ecommerce_departments && (
                  <p className="text_red text-xs mt-2 absolute -bottom-5 left-0">
                    {errors.ecommerce_departments}
                  </p>
                )} */}
            </div>
            <div className="text-base mt-8 relative ">
              <label className="text-base">Tenant Plan*</label>
              <div className="flex lg:flex-row flex-col mt-5 gap-2 lg:items-center w-full tenant_radio_group">
                <Radio
                  value="Entry"
                  className="w-4/12"
                  name="tenant_plan"
                  checked={formData.tenant_plan === 'Entry'}
                  onChange={handleChange}
                >
                  Entry tenant $35/Mo.
                </Radio>
                <Radio
                  value="Key"
                  className="w-4/12"
                  name="tenant_plan"
                  checked={formData.tenant_plan === 'Key'}
                  onChange={handleChange}
                >
                  Key tenant $65/Mo.
                </Radio>
                <Radio
                  value="Anchor"
                  className="w-4/12"
                  name="tenant_plan"
                  checked={formData.tenant_plan === 'Anchor'}
                  onChange={handleChange}
                >
                  Anchor tenant $125/Mo.
                </Radio>
                {/* {[
                  'Entry tenant $35/Mo.',
                  'Key tenant $65/Mo.',
                  'Anchor tenant $35/Mo.'
                ].map((plan) => (
                  <Radio
                    className="w-4/12 lg:whitespace-normal whitespace-nowrap"
                    key={plan}
                    value={plan}
                    name="tenant_plan"
                    checked={formData.tenant_plan === plan}
                    onChange={handleChange}
                  >
                    {plan}
                  </Radio>
                ))} */}
              </div>
              {errors.tenant_plan && (
                <p className="text_red text-xs mt-2 absolute -bottom-5 left-0">
                  {errors.tenant_plan}
                </p>
              )}
            </div>
            <div className="text-base mt-8 relative ">
              <label className="text-base">
                Are you on any marketplaces? (Such as Amazon or Alibaba)*
              </label>
              <div className="flex mt-5 items-center w-full tenant_radio_group">
                <Radio
                  value="yes"
                  className="w-4/12"
                  name="on_marketplaces"
                  checked={formData.on_marketplaces === 'yes'}
                  onChange={handleChange}
                >
                  Yes
                </Radio>
                <Radio
                  className="w-4/12"
                  value="no"
                  name="on_marketplaces"
                  checked={formData.on_marketplaces === 'no'}
                  onChange={handleChange}
                >
                  No
                </Radio>
              </div>
              {errors.on_marketplaces && (
                <p className="text_red text-xs mt-2 absolute -bottom-5 left-0">
                  {errors.on_marketplaces}
                </p>
              )}
            </div>
            <div className="flex lg:flex-row flex-col gap-7 mt-8">
              <div className="lg:w-6/12 w-full relative">
                <label className="text-base">
                  Average number of domestic sales monthly*
                </label>
                <Input
                  className="w-full text-base h-14"
                  type="number"
                  name="average_domestic_sales_monthly"
                  value={formData.average_domestic_sales_monthly}
                  onChange={handleChange}
                />
                {errors.average_domestic_sales_monthly && (
                  <p className="text_red text-xs mt-2 absolute -bottom-5 left-0">
                    {errors.average_domestic_sales_monthly}
                  </p>
                )}
              </div>
              <div className="lg:w-6/12 w-full relative">
                <label className="text-base">
                  Average weight per order in grams (g)?*
                </label>
                <Input
                  className="w-full text-base h-14"
                  type="text"
                  name="average_order_weight_grams"
                  value={formData.average_order_weight_grams}
                  onChange={handleChange}
                />
                {errors.average_order_weight_grams && (
                  <p className="text_red text-xs mt-2 absolute -bottom-5 left-0">
                    {errors.average_order_weight_grams}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-7 lg:flex-row flex-col mt-8">
              <div className="lg:w-6/12 w-full relative">
                <label className="text-base">
                  Average value per order in USD?*
                </label>
                <Input
                  className="w-full text-base h-14"
                  type="text"
                  name="average_order_value_usd"
                  value={formData.average_order_value_usd}
                  onChange={handleChange}
                />
                {errors.average_order_value_usd && (
                  <p className="text_red text-xs mt-2 absolute -bottom-5 left-0">
                    {errors.average_order_value_usd}
                  </p>
                )}
              </div>
              <div className="lg:w-6/12 w-full relative">
                <label className="text-base">Average weight per order?*</label>
                <Input
                  className="w-full text-base h-14"
                  type="text"
                  name="average_international_order_weight"
                  value={formData.average_international_order_weight}
                  onChange={handleChange}
                />
                {errors.average_international_order_weight && (
                  <p className="text_red text-xs mt-2 absolute -bottom-5 left-0">
                    {errors.average_international_order_weight}
                  </p>
                )}
              </div>

              {/* <div className='lg:w-6/12 lg:block hidden w-full'></div> */}
            </div>
            <div className="flex gap-7 mt-8">
              <div className="lg:w-6/12 w-full relative">
                <label className="text-base">
                  Average number of international (export) sales monthly*
                </label>
                <Input
                  className="w-full text-base h-14"
                  type="number"
                  name="average_international_sales_monthly"
                  value={formData.average_international_sales_monthly}
                  onChange={handleChange}
                />
                {errors.average_international_sales_monthly && (
                  <p className="text_red text-xs mt-2 absolute -bottom-5 left-0">
                    {errors.average_international_sales_monthly}
                  </p>
                )}
              </div>

              <div className="lg:w-6/12 lg:block hidden w-full"></div>
            </div>
            <div className="text-base mt-8 relative">
              <label className="text-base">
                How did you hear about Mall For Women?*
              </label>
              <div className="flex lg:flex-row flex-col mt-5 gap-2 lg:items-center flex-wrap lg:gap-1 justify-between w-full tenant_radio_group">
                {[
                  'Social Media',
                  'Google Search',
                  'Exhibition',
                  'Event',
                  'Word of Mouth',
                  'Other'
                ].map((source) => (
                  <Radio
                    value={source}
                    className="text-base"
                    name="how_did_you_hear"
                    key={source}
                    checked={formData.how_did_you_hear === source}
                    onChange={handleChange}
                  >
                    {source}
                  </Radio>
                ))}
              </div>
              {errors.how_did_you_hear && (
                <p className="text_red text-xs mt-2 absolute -bottom-5 left-0">
                  {errors.how_did_you_hear}
                </p>
              )}
            </div>
            <div className="w-full mt-8 relative">
              <label className="text-base">Additional Information</label>
              <Input
                className="w-full text-base h-14"
                type="textarea"
                name="additional_information"
                value={formData.additional_information}
                onChange={handleChange}
              />
              {errors.additional_information && (
                <p className="text_red text-xs mt-2 absolute -bottom-5 left-0">
                  {errors.additional_information}
                </p>
              )}
            </div>
            <div className="w-full mt-8 relative flex items-start gap-2">
              <Checkbox
                className="text-base flex mt-1"
                name="confirmation"
                checked={formData.confirmation}
                onChange={handleChange}
              ></Checkbox>
              <span className="text-base">
                I hereby confirm that all of the information provided in this
                application is true and correct to the best of my knowledge. Any
                false information or attempt to mislead Mall For Women will
                result in your application being declined.*
              </span>

              {errors.confirmation && (
                <p className="text_red text-xs mt-2 absolute -bottom-5 left-0">
                  {errors.confirmation}
                </p>
              )}
            </div>
            <div className=" gap-7 mt-8">
              <div
                className={clsx(
                  ' w-full relative',
                  errors.application_date && 'mb-4'
                )}
              >
                <label className="text-base ">Date (DD/MM/YYYY)*</label>
                <Input
                  className="w-full uppercase"
                  type="date"
                  name="application_date"
                  allowEmptyFormatting
                  placeholder="DD/MM/YYYY"
                  max={maxDate}
                  value={formData.application_date}
                  onChange={handleChange}
                />
                {errors.application_date && (
                  <p className="text_red text-xs mt-2 absolute -bottom-5 left-0">
                    {errors.application_date}
                  </p>
                )}
              </div>
              <div className="w-full mt-10 relative flex lg:items-center  gap-2">
                <Checkbox
                  classID="text-base"
                  name="authorized_signature"
                  checked={formData.authorized_signature}
                  onChange={handleChange}
                  className="lg:mt-0 mt-1"
                ></Checkbox>
                <span className="text-base">
                  I am duly authorized to sign this application on behalf of my
                  company.*
                </span>
                {errors.authorized_signature && (
                  <p className="text_red text-xs mt-2 absolute  -bottom-5 left-0">
                    {errors.authorized_signature}
                  </p>
                )}
              </div>
            </div>
            <div className="w-full mt-8 relative h-52 pb-10 outline-dashed outline-1 outline-[#C576AC] ">
              <div className="flex flex-col justify-center items-center h-full">
                <Icon name="upload-file" size={24} className="text-[#C576AC]" />

                {!fileName1 ? (
                  <>
                    <h2 className="mt-2 text-xl">Upload Signature</h2>
                    <Button className="pinkbtn mt-2 w-[250px]">
                      BROWSE FOR FILE
                    </Button>
                    <label className="absolute top-0 bottom-0 right-0 left-0 z-20 opacity-0">
                      <Input
                        className="text-base w-full h-full"
                        type="file"
                        name="signature"
                        onChange={handleFileChange1}
                      />
                    </label>
                  </>
                ) : (
                  <div className="mt-4 text-center">
                    <p className="mt-2 text-xl">
                      Uploaded Signature: {fileName1}
                    </p>
                    <Button
                      className="pinkbtn mt-2"
                      onClick={handleRemoveFile1}
                    >
                      REMOVE FILE
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <Button className="pinkbtn mt-5 w-full uppercase" type="submit">
              Submit
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TenantApplication;
