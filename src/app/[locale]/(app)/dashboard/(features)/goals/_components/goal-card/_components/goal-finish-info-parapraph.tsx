import { cn } from '@/lib/utils';

export const GoalFinishInfoParapraph = ({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <p className={cn('text-[15px] font-medium text-primary/70', className)}>
    {children}
  </p>
);
