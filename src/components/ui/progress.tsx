'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

import { cn } from '@/lib/utils';

function Progress({
  className,
  value,
  progressBarClassName,
  excess,
  excessBarClassName,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
  excess?: number;
  progressBarClassName?: string;
  excessBarClassName?: string;
}) {
  return (
    <ProgressPrimitive.Root
      data-slot='progress'
      className={cn(
        'relative h-2 w-full overflow-hidden rounded-full bg-primary/20',
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot='progress-indicator'
        className={cn(
          'z-1 absolute left-0 top-0 h-full w-full flex-1 bg-primary transition-all',
          progressBarClassName
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
      {!!excess && (
        <ProgressPrimitive.Indicator
          data-slot='progress-indicator'
          className={cn(
            'relative z-0 h-full w-full flex-1 bg-primary/80 transition-all',
            excessBarClassName
          )}
          style={{ transform: `translateX(-${100 - (excess || 0)}%)` }}
        />
      )}
    </ProgressPrimitive.Root>
  );
}

export { Progress };
