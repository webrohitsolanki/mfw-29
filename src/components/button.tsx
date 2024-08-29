'use client';

import { ButtonProps } from '@theme/components/types';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Button = (props: ButtonProps) => {
  return (
    <button
      {...props}
      className={twMerge(
        clsx(
          [
            'px-4',
            'h-10',
            'text-xs',
            'bg-primary',
            'text-primary-foreground',
            'border',
            'border-primary',
            'transition-all',
            'hover:bg-white',
            'hover:border-primary',
            'hover:text-primary'
          ],
          props.appearance === 'outlined' && [
            'bg-transparent ',
            'text-primary ',
            'hover:border-1',
            'hover:bg-white ',
            'hover:text-black'
          ],
          props.appearance === 'ghost' && [
            'bg-transparent',
            'border-transparent',
            'text-primary',
            'hover:bg-white',
            'hover:border-1',
            'hover:text-black'
          ]
        ),
        props.className
      )}
    >
      {props.children}
    </button>
  );
};
