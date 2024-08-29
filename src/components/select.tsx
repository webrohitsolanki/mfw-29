import { forwardRef } from 'react';
import { SelectProps } from '@theme/components/types';
import clsx from 'clsx';
import { Icon } from './icon';
import { twMerge } from 'tailwind-merge';
import { Image } from '@akinon/next/components';

const Select = forwardRef<HTMLSelectElement, SelectProps>((props, ref) => {
  const {
    className,
    options,
    borderless = false,
    icon,
    iconSize,
    error,
    label,
    image,
    required = false,
    ...rest
  } = props;

  return (
    <label
      className={clsx('flex flex-col lg:text-base text-sm relative', {
        'pl-7': icon
      })}
    >
      {/* {options && (

      )} */}

      {label && (
        <span className="mb-1">
          {label} {required && <span className="">*</span>}
        </span>
      )}
      <select
        {...rest}
        ref={ref}
        className={twMerge(
          clsx(
            'cursor-pointer h-8  w-50 px-3.5 shrink-0 outline-none',
            !borderless &&
            'border border-gray-200 transition-all duration-150 hover:border-primary'
          ),
          className
        )}
      >

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className={option.class}
            // style={{ backgroundImage: `url(${image})` }}
          >
            {option.label}
          </option>

        ))}
      </select>
      {error && (
        <span className="mt-1 text-sm text-error">{error.message}</span>
      )}
    </label>
  );
});

Select.displayName = 'Select';

export { Select };
