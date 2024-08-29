import { useCallback } from 'react';
import clsx from 'clsx';
import { Icon } from '@theme/components';
import { twMerge } from 'tailwind-merge';
import { Button } from '@akinon/next/components';

export type Props = {
  title: string;
  icon?: string;
  index: number;
  setSelectedTab: (index: number) => void;
  isActive?: boolean;
  iconPosition?: string;
  className?: string;
};

export const Tab = (props: Props) => {
  const {
    title,
    setSelectedTab,
    index,
    isActive,
    icon,
    iconPosition,
    className
  } = props;

  const handleOnClick = useCallback(() => {
    setSelectedTab(index);
  }, [setSelectedTab, index]);

  return (
    <Button
      onClick={handleOnClick}
      className={twMerge(
        clsx(
          'flex items-center pinkbtn justify-center px-4 py-2 gap-3 cursor-pointer uppercase break-words',
          isActive ? 'bg-primary' : 'bg-gray-100',
          isActive ? 'text-white' : 'text-primary',
          {
            'flex-col': iconPosition === 'top',
            'flex-col-reverse': iconPosition === 'bottom',
            'flex-row-reverse': iconPosition === 'end'
          }
        ),
        className
      )}
    >
      {icon && (
        <Icon
          name={icon}
          size={16}
          className={isActive ? 'fill-white' : 'fill-primary'}
        />
      )}
      {title}
    </Button>
  );
};
