'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useLocale } from 'next-intl';

import { Language } from '@/i18n/routing';
import { getDateFnsLocaleFromLanguage } from '@/lib/locale/get-date-fns-locale-from-language';
import { cn } from '@/lib/utils';

import { Button } from './button';
import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

export const DatePicker = ({
  date,
  setDate,
  label,
  disabled,
  hasError
}: {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  label?: string;
  disabled?: boolean;
  hasError?: boolean;
}) => {
  const locale = useLocale();

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            disabled={disabled}
            className={cn(
              'w-full justify-between rounded-lg border-sidebar-border bg-background p-3 text-left text-sm font-normal text-white',
              hasError && 'border-destructive'
            )}
          >
            {date ? (
              format(date, 'PPP', {
                locale: getDateFnsLocaleFromLanguage(locale as Language)
              })
            ) : (
              <span>{label || 'Pick a date'}</span>
            )}
            <CalendarIcon className='h-4 w-4 text-gray-500' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='z-[10010]'>
          <Calendar
            mode='single'
            selected={date}
            onSelect={setDate}
            required
            locale={getDateFnsLocaleFromLanguage(locale as Language)}
          />
        </PopoverContent>
      </Popover>
    </>
  );
};
