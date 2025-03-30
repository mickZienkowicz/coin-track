import React from 'react';

import { cn } from '@/lib/utils';

import { Input, InputProps } from './input';

export const CurrencyInput = React.forwardRef<
  HTMLInputElement,
  InputProps & { currency: string }
>(({ className, currency, ...props }, ref) => {
  return (
    <div className='group relative'>
      <span className='absolute right-3 top-1/2 -translate-y-1/2 bg-background text-sm font-semibold text-gray-500 group-hover:bg-accent'>
        {currency}
      </span>
      <Input
        type='number'
        step='0.01'
        placeholder='0.00'
        className={cn(className, 'group-hover:bg-accent')}
        {...props}
        ref={ref}
      />
    </div>
  );
});

CurrencyInput.displayName = 'CurrencyInput';
