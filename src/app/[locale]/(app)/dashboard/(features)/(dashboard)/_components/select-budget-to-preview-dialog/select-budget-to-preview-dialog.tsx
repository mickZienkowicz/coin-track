'use client';

import { useState } from 'react';
import { format, isBefore, isSameDay } from 'date-fns';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useRouter } from '@/i18n/navigation';
import { pathGenerators } from '@/lib/paths';

type Option = {
  id: string;
  label: string;
  date: Date;
};

export const SelectBudgetToPreviewDialog = ({
  children,
  options
}: {
  children?: React.ReactNode;
  options: Option[];
}) => {
  const t = useTranslations('dashboard.selectBudgetToPreviewDialog');
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<Option>(options?.[0]);

  const handleConfirm = () => {
    router.push(
      isBefore(new Date(), selectedOption.date) ||
        isSameDay(new Date(), selectedOption.date)
        ? pathGenerators.budget()
        : pathGenerators.budgetFromDate(
            format(selectedOption.date, 'yyyy-MM-dd')
          )
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button size='sm' data-tour='see-history-of-finances-preview-button'>
            {t('button')}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent data-tour='see-history-of-finances-preview-dialog'>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <div className='grid gap-4'>
          <Select
            value={selectedOption.id}
            onValueChange={(value) =>
              setSelectedOption(options.find((option) => option.id === value)!)
            }
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder={t('selectBudgetToPreview')} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleConfirm}>{t('previewButton')}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
