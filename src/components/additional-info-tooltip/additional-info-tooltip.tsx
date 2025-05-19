import { Info } from 'lucide-react';

import { cn } from '@/lib/utils';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../ui/tooltip';

export const AdditionalInfoTooltip = ({
  text,
  className
}: {
  text: string;
  className?: string;
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className={cn('cursor-pointer p-1', className)}>
          <Info className='size-4.5 text-primary/70' />
        </TooltipTrigger>
        <TooltipContent className='max-w-[300px] p-3'>
          <p className='text-sm font-normal'>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
