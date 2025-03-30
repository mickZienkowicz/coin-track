import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

import { FormControl, FormItem, FormLabel, FormMessage } from './form';

export const FormItemWrapper = ({
  label,
  children,
  className,
  disabled
}: {
  label?: string | ReactNode;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
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
      </FormLabel>
    )}
    <FormControl>{children}</FormControl>
    <FormMessage className='text-sm font-normal' />
  </FormItem>
);
