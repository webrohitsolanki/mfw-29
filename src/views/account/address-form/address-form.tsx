import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { AddressType, AddressFormType } from '@akinon/next/types';
import {
  Button,
  Checkbox,
  Icon,
  Input,
  Radio,
  Select
} from '@theme/components';
import {
  useGetCountriesQuery,
  useGetCitiesQuery,
  useGetTownshipsQuery,
  useGetDistrictsQuery
} from '@akinon/next/data/client/address';
import { useAppSelector } from '@akinon/next/redux/hooks';
import { useLocalization } from '@akinon/next/hooks';
import 'react-phone-number-input/style.css';
// import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { getCountries, getCountryCallingCode } from 'react-phone-number-input';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import clsx from 'clsx';

type SelectOptionType = {
  label: string;
  value: string | number;
};

interface Props {
  data?: any;
  onSubmit: (data: any) => void;
}

const makeAddressFormSchema = (t, { phoneNumberLength }) =>
  yup.object().shape({
    title: yup.string().required(t('account.address_book.form.error.required')),
    first_name: yup
      .string()
      .required(t('account.address_book.form.error.required')),
    last_name: yup
      .string()
      .required(t('account.address_book.form.error.required')),
    phone_number: yup
      .string()
      .required(t('account.address_book.form.error.required')),
    // .transform((value: string) => value.replace(/_/g, '').replace(/ /g, ''))
    // .length(
    //   phoneNumberLength,
    //   t('account.address_book.form.error.phone_length')
    // )
    country: yup
      .string()
      .required(t('account.address_book.form.error.required')),
    city: yup.string().required(t('account.address_book.form.error.required')),
    township: yup
      .string()
      .required(t('account.address_book.form.error.required')),
    district: yup
      .string()
      .required(t('account.address_book.form.error.required')),
    line: yup
      .string()
      .required(t('account.address_book.form.error.required'))
      .min(10, t('account.address_book.form.error.line_min'))
      .max(255, t('account.address_book.form.error.line_max')),
    postcode: yup
      .string()
      .min(5, t('account.address_book.form.error.postcode_min'))
      .max(5, t('account.address_book.form.error.postcode_max'))
      .required(t('account.address_book.form.error.required')),
    company_name: yup.string().nullable(),
    tax_no: yup.string().nullable(),
    tax_office: yup.string().nullable(),
    e_bill_taxpayer: yup.boolean().nullable()
  });

export const AddressForm = (props: Props) => {
  const { t } = useLocalization();

  const { data, onSubmit } = props;

  const [selectedCountryPhone, setSelectedCountry] = useState('US');
  const [phoneError, setPhoneError] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const config = useAppSelector((state) => state.config);
  const addressFormSchema = makeAddressFormSchema(t, {
    phoneNumberLength: config.user_phone_format.length
  });

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    reset,
    formState: { errors }
  } = useForm<AddressFormType>({
    resolver: yupResolver(addressFormSchema),
    defaultValues: { is_corporate: AddressType.individual, type: 'customer' }
  });

  const selectedFormType = watch('is_corporate');
  const selectedCountry = watch('country');
  const selectedCity = watch('city');
  const selectedTownship = watch('township');

  const { data: country } = useGetCountriesQuery();
  const { data: city } = useGetCitiesQuery(selectedCountry, {
    skip: !selectedCountry
  });
  const { data: township } = useGetTownshipsQuery(selectedCity, {
    skip: !selectedCity
  });
  const { data: district } = useGetDistrictsQuery(selectedTownship, {
    skip: !selectedTownship
  });

  const countryOptions = useMemo(() => {
    if (country) {
      const options: SelectOptionType[] = [
        { label: t('account.address_book.form.country.placeholder'), value: '' }
      ];
      options.push(
        ...country.results.map((item) => ({ label: item.name, value: item.pk }))
      );
      return options;
    }
    return [];
  }, [country]);

  const cityOptions = useMemo(() => {
    if (city) {
      const options: SelectOptionType[] = [
        {
          label: t('account.address_book.form.province.placeholder'),
          value: ''
        }
      ];
      options.push(
        ...city.results.map((item) => ({ label: item.name, value: item.pk }))
      );
      return options;
    }
    return [];
  }, [city]);

  const townshipOptions = useMemo(() => {
    if (township) {
      const options: SelectOptionType[] = [
        {
          label: t('account.address_book.form.township.placeholder'),
          value: ''
        }
      ];
      options.push(
        ...township.results.map((item) => ({
          label: item.name,
          value: item.pk
        }))
      );
      return options;
    }
    return [];
  }, [township]);

  const districtOptions = useMemo(() => {
    if (district) {
      const options: SelectOptionType[] = [
        {
          label: t('account.address_book.form.district.placeholder'),
          value: ''
        }
      ];
      options.push(
        ...district.results.map((item) => ({
          label: item.name,
          value: item.pk
        }))
      );

      return options;
    }
    return [];
  }, [district]);

  useEffect(() => {
    if (data && country) {
      setPhoneNumber(data.phone_number);
      reset({
        ...data,
        is_corporate:
          String(data.is_corporate) === AddressType.company ? 'true' : 'false' // TODO: Fix this! This hack for radio buttons can't be set to boolean value
      });
    }
  }, [data, country, reset]);

  const CountryCodeDropdown = ({ selectedCountryPhone, onChange }) => {
    const countries = getCountries();
    return (
      <select
        className="lg:h-14 h-10 bg-white border-[#C576AC] lg:text-base rounded-none text-xs border_register focus:outline-none px-3"
        value={selectedCountryPhone}
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

  // const onPhoneNumberChange = (value) => {
  //   setPhoneNumber(value);

  //   if (!value) {
  //     setPhoneError('This field is required.');
  //   } else if (isValidPhoneNumber(value)) {
  //     setPhoneError('');
  //   } else {
  //     setPhoneError('Invalid phone number');
  //   }
  // };

  const onPhoneNumberChange = (value: string | undefined) => {
    if (value) {
      errors.phone_number = null;

      setValue('phone_number', value); // Update the form value
      if (isValidPhoneNumber(value)) {
        setPhoneError('');
      } else {
        setPhoneError('Invalid phone number');
      }
    } else {
      setPhoneError('This field is required.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col py-4 px-6 gap-6"
    >
      <div className="flex gap-8">
        <Radio
          {...register('is_corporate')}
          value="false"
          data-testid="address-form-personal"
        >
          <span className="text-base">
            {t('account.address_book.form.type.personal')}
          </span>
        </Radio>
        <Radio
          {...register('is_corporate')}
          value="true"
          data-testid="address-form-corporate"
        >
          <span className="text-base">
            {t('account.address_book.form.type.corporate')}
          </span>
        </Radio>
      </div>
      <div>
        <Input
          label={t('account.address_book.form.address_title.placeholder')}
          {...register('title')}
          error={errors.title}
          data-testid="address-form-title"
        />
      </div>
      <div>
        <Input
          label={t('account.address_book.form.name.placeholder')}
          {...register('first_name')}
          error={errors.first_name}
          data-testid="address-form-first-name"
        />
      </div>
      <div>
        <Input
          label={t('account.address_book.form.surname.placeholder')}
          {...register('last_name')}
          error={errors.last_name}
          data-testid="address-form-last-name"
        />
      </div>
      {/* <div>
        <Input
          label={t('account.address_book.form.phone.placeholder')}
          // format={config.user_phone_format.replaceAll(/\9/g, '#')}
          mask="_"
          allowEmptyFormatting={true}
          control={control}
          {...register('phone_number')}
          error={errors.phone_number}
          data-testid="address-form-phone"
        />
      </div> */}
      <div className="mb-1">
        <label className="lg:text-base text-sm">Phone Number*</label>
        <div className={clsx('mt-2',{ 'mb-1': errors.phone_number })}>
          <div className="flex items-center number_register relative">
            <PhoneInput
              international
              error={errors.phone_number}
              value={phoneNumber}
              {...register('phone_number')}
              onChange={onPhoneNumberChange}
              className="lg:h-10 h-10 w-full border border-gray-500 bg-white focus:outline-none"
            />
          </div>
          <>
            {phoneError && <p className="text_red text-[14px]">{phoneError}</p>}
            {errors.phone_number ? (
              <p className="text_red text-[14px]">
                {errors.phone_number.message}
              </p>
            ) : null}
          </>
        </div>
      </div>
      {/* TODO: Fix select and textarea components */}
      <div>
        <label className="lg:text-base text-sm ">Country*</label>
        <Select
          className="w-full border-gray-500 text-sm mt-2 h-10"
          options={countryOptions}
          {...register('country')}
          error={errors.country}
          data-testid="address-form-country"
          // label={t('account.address_book.form.country.title')}
        />
      </div>
      {city && (
        <div>
          <label className="lg:text-base text-sm ">State*</label>
          <Select
            className="w-full border-gray-500 text-sm mt-2 h-10"
            options={cityOptions}
            {...register('city')}
            error={errors.city}
            data-testid="address-form-city"
            // label={t('account.address_book.form.province.title')}
          />
        </div>
      )}
      {township && (
        <div className="flex gap-4">
          <div className="flex-1">
            <div>
              <label className="lg:text-base text-sm ">Township*</label>
              <Select
                className="w-full border-gray-500 text-sm mt-2 h-10"
                options={townshipOptions}
                {...register('township')}
                error={errors.township}
                data-testid="address-form-township"
                // label={t('account.address_book.form.township.title')}
                // label="City"
              />
            </div>
          </div>
          {district && (
            <div className="flex-1">
              <div>
                <label className="lg:text-base text-sm ">District*</label>
                <Select
                  className="w-full border-gray-500 text-sm mt-2 h-10"
                  options={districtOptions}
                  {...register('district')}
                  error={errors.district}
                  data-testid="address-form-district"
                  // label={t('account.address_book.form.district.title')}
                  // label="Township"
                />
              </div>
            </div>
          )}
        </div>
      )}
      <label className="lg:text-base text-sm relative">
        <>
          <span>{t('account.address_book.form.address.title')}</span>
          <span> *</span>
        </>

        <textarea
          {...register('line')}
          rows={6}
          className={clsx(
            'block w-full mt-2 border p-2',
            errors.line
              ? 'border-error focus:border-error'
              : 'border-gray-500 hover:border-black focus:border-black'
          )}
          data-testid="address-form-address-field"
        />
        {errors.line && (
          <span
            className="absolute -bottom-5 left-0 text-sm text-error"
            data-testid="address-form-address-field-error"
          >
            {errors.line.message}
          </span>
        )}
      </label>
      <div>
        <Input
          type="number"
          label={t('account.address_book.form.post_code.placeholder')}
          {...register('postcode')}
          error={errors.postcode}
          data-testid="address-form-post-code"
          className="no-spinner-input"
        />
      </div>
      {selectedFormType === AddressType.company && (
        <>
          <div>
            <label className="lg:text-base text-sm ">Company Name</label>
            <Input
              type="text"
              // label={t('account.address_book.form.company_name.placeholder')}
              {...register('company_name')}
              error={errors.company_name}
              data-testid="address-form-company-name"
            />
          </div>
          <div>
            <label className="lg:text-base text-sm ">Tax No</label>
            <Input
              type="number"
              // label={t('account.address_book.form.tax_no.placeholder')}
              {...register('tax_no')}
              error={errors.tax_no}
              data-testid="address-form-tax-no"
            />
          </div>
          <div>
            <label className="lg:text-base text-sm ">Tax Office</label>
            <Input
              type="text"
              // label={t('account.address_book.form.tax_office.placeholder')}
              {...register('tax_office')}
              error={errors.tax_office}
              data-testid="address-form-tax-office"
            />
          </div>
          <Checkbox
            className="accent-primary"
            {...register('e_bill_taxpayer')}
            data-testid="address-form-taxpayer"
          >
            {t('account.address_book.form.taxpayer.title')}
          </Checkbox>
        </>
      )}
      <Button
        type="submit"
        className="flex pinkbtn items-center text-base justify-center font-semibold gap-2"
        data-testid="address-form-submit"
      >
        <span>Save</span>
        {/* <Icon name="chevron-end" size={12} className="fill-white" /> */}
      </Button>
    </form>
  );
};
