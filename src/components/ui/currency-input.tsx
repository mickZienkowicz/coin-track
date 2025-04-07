import React from 'react';

import { cn } from '@/lib/utils';

import { Input, InputProps } from './input';

export const CurrencyInput = React.forwardRef<
  HTMLInputElement,
  InputProps & { currency: string }
>(({ className, currency, onChange: onChangeProp, ...props }, ref) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(',', '.');

    if (!isNaN(Number(value)) || value === '') {
      onChangeProp?.({ ...event, target: { ...event.target, value } });
    }
  };

  return (
    <div className='group relative'>
      <span className='absolute bottom-[1px] right-[1px] top-[1px] z-20 flex items-center justify-center rounded-xl bg-transparent px-4 text-sm font-semibold text-gray-500'>
        {currency}
      </span>
      <Input
        type='text'
        inputMode='decimal'
        step='0.01'
        placeholder='0.00'
        className={cn(className, 'pr-8 group-hover:bg-accent')}
        {...props}
        onChange={handleChange}
        ref={ref}
      />
    </div>
  );
});

CurrencyInput.displayName = 'CurrencyInput';
