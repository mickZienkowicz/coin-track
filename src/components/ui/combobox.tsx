'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export function Combobox({
  items,
  value,
  onValueChange,
  hasError,
  popoverClassName,
  buttonDefaultLabel,
  commandInputPlaceholder,
  noResultsMessage
}: {
  items: { value: string; label: string }[];
  value: string;
  onValueChange: (value: string) => void;
  hasError?: boolean;
  popoverClassName?: string;
  buttonDefaultLabel?: string;
  commandInputPlaceholder?: string;
  noResultsMessage?: string;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className={cn('justify-between', hasError && 'border-destructive')}
        >
          {value
            ? items.find((item) => item.value === value)?.label
            : buttonDefaultLabel || 'Select items...'}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn('w-[240px] p-0', popoverClassName)}>
        <Command>
          <CommandInput
            placeholder={commandInputPlaceholder || 'Search items...'}
          />
          <CommandList>
            <CommandEmpty>{noResultsMessage || 'No items found.'}</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                >
                  {value === item.value && (
                    <Check className={cn('mr-2 h-4 w-4')} />
                  )}
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
