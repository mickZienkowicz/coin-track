import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

import { AdditionalInfoTooltip } from '../additional-info-tooltip';
import { FormControl, FormItem, FormLabel, FormMessage } from './form';

export const FormItemWrapper = ({
  label,
  children,
  className,
  disabled,
  additionalInfo
}: {
  label?: string | ReactNode;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  additionalInfo?: string;
}) => (
  <FormItem className={cn('gap-1.5 text-left', className)}>
    {label && (
      <FormLabel
        className={cn(
          'mb-1 text-start font-semibold',
          disabled && 'opacity-50'
        )}
      >
        {label}
        {additionalInfo && <AdditionalInfoTooltip text={additionalInfo} />}
      </FormLabel>
    )}
    <FormControl>{children}</FormControl>
    <FormMessage className='text-sm font-normal' />
  </FormItem>
);
