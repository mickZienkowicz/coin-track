import { cn } from '@/lib/utils';

export const GoalProgressInfoParagraph = ({
  label,
  value,
  className,
  side
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
  side?: 'left' | 'right';
}) => (
  <p className='flex flex-col'>
    <span
      className={cn(
        side === 'left' ? 'text-left' : 'text-right',
        'text-xl font-bold',
        className
      )}
    >
      {value}
    </span>
    <span
      className={cn(
        side === 'left' ? 'text-left' : 'text-right',
        'text-sm text-primary/70'
      )}
    >
      {label}
    </span>
  </p>
);
