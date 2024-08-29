import clsx from 'clsx';
import { forwardRef, FocusEvent, useState } from 'react';
import { Control, Controller, FieldError } from 'react-hook-form';
import NumberFormat, { NumberFormatProps } from 'react-number-format';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
// import { InputProps } from '@theme/components/types';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends React.HTMLProps<HTMLInputElement> {
  label?: string;
  labelStyle?: 'default' | 'floating';
  error?: FieldError | undefined;
  control?: Control<any, any>;
  required?: boolean;
  phone?: boolean;
}

export const Input = forwardRef<
  HTMLInputElement,
  InputProps &
  Pick<
    NumberFormatProps,
    'format' | 'mask' | 'allowEmptyFormatting' | 'onValueChange'
  >
>((props, ref) => {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const {
    id,
    label,
    labelStyle,
    error,
    mask,
    format,
    required = false,
    phone,
    ...rest
  } = props;
  const hasFloatingLabel = label && labelStyle === 'floating';
  const inputClass = twMerge(
    clsx(
      'lg:text-base text-xs border px-2.5 h-10 placeholder:text-gray-600',
      'focus-visible:outline-none', // disable outline on focus
      { 'pt-3': hasFloatingLabel },
      error
        ? 'border-error focus:border-error'
        : 'border-gray-500 hover:border-black focus:border-black'
    ),
    props.className
  );
  const inputProps: any = {
    id,
    ref,
    className: inputClass,
    onFocus: () => setFocused(true),
    onBlur: (event: FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      setHasValue(!!event.target.value);
    },
    required: props.required
  };

  const Label = () => {
    if (!label) return null;

    return (
      <label
        htmlFor={id}
        className={clsx(
          'text-base text-black',
          {
            'absolute left-2.5 pointer-events-none transition-all transform -translate-y-1/2':
              hasFloatingLabel
          },
          { 'mb-2': !hasFloatingLabel },
          { 'top-1/3': hasFloatingLabel && (focused || hasValue) },
          { 'top-1/2': !(hasFloatingLabel && (focused || hasValue)) }
        )}
      >
        {label}* {required && <span className="text-secondary">*</span>}
      </label>
    );
  };

  return (
    <>
      <div className="flex flex-col w-full">
        <div className="relative flex w-full flex-col">
          {props.format ? (
            <>
              {labelStyle !== 'floating' && <Label />}
              <Controller
                name={props.name ?? ''}
                control={props.control}
                defaultValue={false}
                render={({ field }) => (
                  <NumberFormat
                    format={format}
                    mask={mask ?? ''}
                    {...rest}
                    {...field}
                    {...inputProps}
                  />
                )}
              />
              {labelStyle === 'floating' && <Label />}
            </>
          ) : phone ? (
            <>
              {labelStyle !== 'floating' && <Label />}
              <Controller
                name={props.name ?? ''}
                control={props.control}
                defaultValue=""
                render={({ field }) => (
                  <PhoneInput
                    {...field}
                    {...rest}
                    {...inputProps}
                    country={'us'}
                    onChange={field.onChange}
                  />
                )}
              />
              {labelStyle === 'floating' && <Label />}
            </>
          ) : (
            <>
              {labelStyle !== 'floating' && <Label />}
              <input {...rest} {...inputProps} />
              {labelStyle === 'floating' && <Label />}
            </>
          )}
        </div>
      </div>
      {error && (
        <span className="mt-1 lg:text-sm text-[8px] text-error">{error.message}</span>
      )}
    </>
  );
});

Input.displayName = 'Input-Phone';
