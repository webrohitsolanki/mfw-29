'use client';

import React, { useEffect, useMemo } from 'react';
import { VariantOption, VariantType } from '@akinon/next/types';
import { usePathname, useSearchParams } from 'next/navigation';
import clsx from 'clsx';
import { useRouter, useLocalization } from '@akinon/next/hooks';

type VariantProps = {
  className?: string;
  onChange?: (option: VariantOption) => void;
} & VariantType;

export const Variant = (props: VariantProps) => {
  const { t } = useLocalization();
  const { attribute_key, attribute_name, options, onChange } = props;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const selectedVariant = useMemo(
    () => options.find((option) => option.is_selected),
    [options]
  );

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    const selectedOption = options.find(
      (option) => option.value === selectedValue
    );

    if (selectedOption && onChange) {
      onChange(selectedOption);
    }

    params.set(attribute_key, selectedValue);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div
      className={clsx('flex flex-col w-full sm:my-0 my-4', props.className)}
      data-testid={`product-variant-${attribute_name}`}
    >
      <p className="flex gap-2 text-left w-full lg:text-base text-sm pb-1 font-bold leading-4">
        <span className='lg:text-base text-[12px]'>{attribute_name} * -</span>
        <span
          className="font-bold text-[12px]"
          data-testid={`product-variant-${attribute_name}-value`}
        >
          {selectedVariant?.value}
        </span>
      </p>
      <select
        className="h-10 px-4 w-full transition-colors duration-200 text-xs cursor-pointer bg-white border border-black "
        value={selectedVariant?.value || ''}
        onChange={handleChange}
      >
        <option>Please Select</option>
        {options.map((option, i) => (
          <>
            <option
              key={i}
              value={option.value}
              className="cursor-pointer"
              disabled={
                !option.is_selectable || !option.is_selectable_without_stock
              }
            >
              {option.value}
            </option>
          </>
        ))}
      </select>
    </div>
  );
};

export default Variant;
