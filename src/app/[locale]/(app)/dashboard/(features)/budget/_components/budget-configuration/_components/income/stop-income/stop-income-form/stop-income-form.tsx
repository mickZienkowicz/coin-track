'use client';

import { Suspense } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Income } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Form, FormField } from '@/components/ui/form';
import { FormItemWrapper } from '@/components/ui/form-item-wrapper';
import { dateSchemaWithMinDate } from '@/lib/dates/date-schema-with-min-date/date-schema-with-min-date';
import { getUtcMiddayDateOfGivenDate } from '@/lib/dates/get-utc-midday-date-of-given-date';
import { pathGenerators } from '@/lib/paths';
import { stopIncome } from '@/server/income/actions/stop-income';
import { revalidatePathAction } from '@/server/revalidate/actions/revalidate-path';

export const getStopIncomeFormSchema = (
  t: ReturnType<typeof useTranslations>
) =>
  z.object({
    date: dateSchemaWithMinDate({ message: t('dateField.error') })
  });

export const StopIncomeForm = ({
  closeDialog,
  income
}: {
  closeDialog: () => void;
  income: Income;
}) => {
  const t = useTranslations('budget.incomes.stopIncome.form');
  const stopIncomeFormSchema = getStopIncomeFormSchema(t);
  const form = useForm<z.infer<typeof stopIncomeFormSchema>>({
    resolver: zodResolver(stopIncomeFormSchema),
    defaultValues: {
      date: getUtcMiddayDateOfGivenDate(new Date())
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: stopIncome,
    onError: () => {
      toast.error(t('error'));
    },
    onSuccess: ({ success, message }) => {
      if (!success) {
        toast.error(message);
        return;
      }

      closeDialog();
      form.reset();
      toast.success(message);
      revalidatePathAction(pathGenerators.budget());
    }
  });

  const onSubmit = async (values: z.infer<typeof stopIncomeFormSchema>) => {
    await mutate({
      id: income.id,
      date: values.date
    });
  };

  return (
    <Suspense>
      <section className='w-full'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex w-full flex-col gap-5'
          >
            <FormField
              control={form.control}
              name='date'
              render={({ field, fieldState }) => (
                <FormItemWrapper label={t('dateField.label')}>
                  <DatePicker
                    date={field.value}
                    setDate={field.onChange}
                    hasError={!!fieldState.error}
                  />
                </FormItemWrapper>
              )}
            />

            <Button
              type='submit'
              className='mt-6'
              variant='destructive'
              loading={isPending}
              disabled={isPending}
            >
              {t('stopIncomeButton')}
            </Button>
          </form>
        </Form>
      </section>
    </Suspense>
  );
};
