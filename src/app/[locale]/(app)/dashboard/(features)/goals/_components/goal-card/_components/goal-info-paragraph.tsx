import { cn } from '@/lib/utils';

export const GoalInfoParagraph = ({
  label,
  value,
  className
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) => {
  return (
    <p className={cn('mt-1 text-sm text-primary/70', className)}>
      {label} <span className='font-bold text-primary/70'>{value}</span>
    </p>
  );
};
