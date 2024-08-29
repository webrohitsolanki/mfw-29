import { forwardRef, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { Icon } from './icon';
import { twMerge } from 'tailwind-merge';
import { Image } from '@akinon/next/components';

interface SelectItem {
  value: string | number;
  label: string;
  class?: string;
  image?: string; // Optional image property
}

interface SelectProps {
  className?: string;
  options: SelectItem[];
  borderless?: boolean;
  icon?: string;
  iconSize?: number;
  error?: { message: string };
  label?: string;
  required?: boolean;
  [key: string]: any; // Allow additional props
}

const SelectCurrency = forwardRef<HTMLDivElement, SelectProps>((props, ref) => {
  const {
    className,
    options = [],
    borderless = false,
    icon,
    iconSize,
    error,
    label,
    required = false,
    ...rest
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(
    options[0]?.value?.toString() || ''
  );

  const handleSelect = (value: string | number) => {
    const stringValue = value.toString();
    setSelectedValue(stringValue);
    setIsOpen(false);
    rest.onChange?.({ target: { value: stringValue } });
  };

  // const selectedOption = options.find(
  //   (option) => option.value === selectedValue
  // );

  // Memoized selectedOption
  const selectedOption = useMemo(() => {
    return options.find((option) => option.value === selectedValue);
  }, [options, selectedValue]);


  return (
    <label
      className={clsx('flex flex-col lg:text-base text-sm relative', {
        'pl-7': icon
      })}
    >
      {label && (
        <span className="mb-1">
          {label} {required && <span className="">*</span>}
        </span>
      )}
      <div
        {...rest}
        ref={ref}
        className={twMerge(
          clsx(
            'cursor-pointer h-8 w-50 px-3.5 shrink-0 outline-none relative',
            !borderless &&
              'border-gray-200 transition-all duration-150 hover:border-primary',
            className
          )
        )}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div className="flex items-center justify-between gap-2">
          {selectedOption?.image && (
            <Image
              src={selectedOption.image}
              alt={selectedOption.label}
              width={20}
              height={20}
              className="w-6 h-6"
            />
          )}
          <span>{selectedOption?.label || 'Select an option'}</span>
          {icon && <Icon name="chevron-down" size={iconSize} />}
        </div>
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 bg-white border border-gray-200 z-10 mt-1">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className="cursor-pointer flex items-center p-2 hover:bg-gray-100"
            >
              {option.image && (
                <Image
                  src={option.image}
                  alt={option.label}
                  width={20}
                  height={20}
                  className="w-6 h-6"
                />
              )}
              <span>{option.label}</span>
            </div>
          ))}
        </div>
      )}
      {error && (
        <span className="mt-1 text-sm text-error">{error.message}</span>
      )}
    </label>
  );
});

SelectCurrency.displayName = 'SelectCurrency';

export { SelectCurrency };
