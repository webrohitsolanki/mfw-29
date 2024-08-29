import { forwardRef } from 'react';
import { RadioProps } from '@theme/components/types';
import { twMerge } from 'tailwind-merge';

const Radio = forwardRef<HTMLInputElement, RadioProps>((props, ref) => {
  const { children, ...rest } = props;

  return (
    <label className={twMerge('flex items-center ', props.className)}>
      <input type="radio" {...rest} ref={ref} className="w-4 h-4" />
      {children && <span className=" ml-2">{children}</span>}
    </label>
  );
});

Radio.displayName = 'Radio';

export { Radio };
