'use client';

import { ReactNode, useState } from 'react';
import { Icon } from './icon';
import { twMerge } from 'tailwind-merge';

type AccordionProps = {
  isCollapse?: boolean;
  title?: string;
  subTitle?: string;
  icons?: string[];
  iconSize?: number;
  iconColor?: string;
  children?: ReactNode;
  className?: string;
  titleClassName?: string;
  dataTestId?: string;
};

export const Accordion = ({
  isCollapse = false,
  title,
  subTitle,
  icons = ['minus', 'plus'],
  iconSize = 16,
  iconColor = 'fill-[#000000]',
  children,
  className,
  titleClassName,
  dataTestId
}: AccordionProps) => {
  const [collapse, setCollapse] = useState(isCollapse);

  return (
    <div
      className={twMerge(
        'flex flex-col justify-center border_list_bottom mb-4 last:border-none',
        className
      )}
    >
      <div
        className="flex items-center justify-between p-3 border items-center cursor-pointer"
        onClick={() => setCollapse(!collapse)}
        data-testid={dataTestId}
      >
        <div className="flex flex-col">
          {title && (
            <h3 className={twMerge('text-sm font-semibold capitalize', titleClassName)}>{title}</h3>
          )}
          {subTitle && <h4 className="text-xs text-gray-700">{subTitle}</h4>}
        </div>

        {icons && (
          <Icon
            name={collapse ? icons[0] : icons[1]}
            size={iconSize}
            className={`fill-[${iconColor}]}`}
          />
        )}
      </div>
      {collapse && <div className="mt-3 p-3 text-sm">{children}</div>}
    </div>
  );
};
