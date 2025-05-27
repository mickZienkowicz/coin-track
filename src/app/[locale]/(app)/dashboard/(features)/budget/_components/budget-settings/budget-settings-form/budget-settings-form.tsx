'use client';

import { Suspense } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Interval, type Budget } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { IntervalSelectContent } from '@/app/[locale]/(app)/dashboard/_components/interval-select-content';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Form, FormField } from '@/components/ui/form';
import { FormItemWrapper } from '@/components/ui/form-item-wrapper';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { dateSchemaWithMinDate } from '@/lib/dates/date-schema-with-min-date';
import { getUtcMiddayDateOfGivenDate } from '@/lib/dates/get-utc-midday-date-of-given-date';
import { pathGenerators } from '@/lib/paths';
import { updateBudget } from '@/server/budget/actions/update-budget';
import { revalidatePathAction } from '@/server/revalidate/actions/revalidate-path';

const formSchema = z.object({
  interval: z.nativeEnum(Interval),
  startDate: dateSchemaWithMinDate({ message: 'Start date is required.' }),
  transferPouchBalance: z.enum(['yes', 'no'])
});

export const BudgetSettingsForm = ({
  budget,
  closeDialog
}: {
  budget: Budget;
  closeDialog: () => void;
}) => {
  const t = useTranslations('budgetSettings.form');
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interval: budget.interval,
      startDate: budget.startDate,
      transferPouchBalance: budget.transferPouchBalance ? 'yes' : 'no'
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updateBudget,
    onError: () => {
      toast.error(t('error'));
    },
    onSuccess: async ({ success, message }) => {
      if (!success) {
        toast.error(message);
        form.reset();

        return;
      }

      closeDialog();
      toast.success(message);
      revalidatePathAction(pathGenerators.budget());
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    mutate({
      id: budget.id,
      interval: values.interval,
      startDate: getUtcMiddayDateOfGivenDate(values.startDate),
      transferPouchBalance: values.transferPouchBalance === 'yes'
    });
  };

  return (
    <Suspense>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex w-full flex-col gap-5'
        >
          <FormField
            control={form.control}
            name='interval'
            render={({ field, fieldState }) => (
              <FormItemWrapper
                label={t('intervalField.label')}
                additionalInfo={t('intervalField.additionalInfo')}
              >
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger
                    className='w-full'
                    hasError={!!fieldState.error}
                  >
                    <SelectValue placeholder={t('intervalField.placeholder')} />
                  </SelectTrigger>
                  <IntervalSelectContent />
                </Select>
              </FormItemWrapper>
            )}
          />

          <FormField
            control={form.control}
            name='startDate'
            render={({ field, fieldState }) => (
              <FormItemWrapper
                label={t('startDateField.label')}
                additionalInfo={t('startDateField.additionalInfo')}
              >
                <DatePicker
                  date={field.value}
                  setDate={field.onChange}
                  hasError={!!fieldState.error}
                />
              </FormItemWrapper>
            )}
          />

          <FormField
            control={form.control}
            name='transferPouchBalance'
            render={({ field, fieldState }) => (
              <FormItemWrapper
                label={t('transferPouchBalanceField.label')}
                additionalInfo={t('transferPouchBalanceField.additionalInfo')}
              >
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger
                    id='transferPouchBalance'
                    className='w-full'
                    hasError={!!fieldState.error}
                  >
                    <SelectValue
                      placeholder={t('transferPouchBalanceField.placeholder')}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='yes'>
                      {t('transferPouchBalanceField.yes')}
                    </SelectItem>
                    <SelectItem value='no'>
                      {t('transferPouchBalanceField.no')}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormItemWrapper>
            )}
          />
          <Button
            className='mt-6'
            autoFocus
            loading={isPending}
            disabled={isPending}
          >
            {t('applyChangesButton')}
          </Button>
        </form>
      </Form>
    </Suspense>
  );
};
