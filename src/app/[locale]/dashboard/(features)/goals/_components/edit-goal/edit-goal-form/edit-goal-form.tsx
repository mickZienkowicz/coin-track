'use client';

import { Suspense } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Goal, Interval } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { IntervalSelectContent } from '@/app/[locale]/dashboard/_components/interval-select-content/interval-select-content';
import { Button } from '@/components/ui/button';
import { CurrencyInput } from '@/components/ui/currency-input';
import { DatePicker } from '@/components/ui/date-picker';
import { Form, FormField } from '@/components/ui/form';
import { FormItemWrapper } from '@/components/ui/form-item-wrapper';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCurrentFamilyCurrency } from '@/hooks/use-current-family';
import { getUtcMiddayDateOfGivenDate } from '@/lib/dates/get-utc-midday-date-of-given-date';
import { pathGenerators } from '@/lib/paths';
import { getNumberSchema } from '@/lib/schemas/number-schema';
import { updateGoal } from '@/server/goal/actions/update-goal';
import { revalidatePathAction } from '@/server/revalidate/actions/revalidate-path';

const getEditGoalFormSchema = (t: ReturnType<typeof useTranslations>) =>
  z.object({
    name: z.string().min(1, t('nameField.error')),
    value: getNumberSchema(t('valueField.error')),
    initialDeposit: getNumberSchema(t('initialDepositField.error')).optional(),
    endDate: z.date({ required_error: t('dateField.error') }),
    savingInterval: z.nativeEnum(Interval)
  });

export const EditGoalForm = ({
  closeDialog,
  goal
}: {
  closeDialog: () => void;
  goal: Goal;
}) => {
  const currency = useCurrentFamilyCurrency();
  const t = useTranslations('goals.editGoal.form');
  const editGoalFormSchema = getEditGoalFormSchema(t);
  const form = useForm<z.infer<typeof editGoalFormSchema>>({
    resolver: zodResolver(editGoalFormSchema),
    defaultValues: {
      name: goal.name,
      value: Math.round(goal.valueCents / 100).toString() as unknown as number,
      initialDeposit: Math.round(
        goal.initialDepositCents / 100
      ).toString() as unknown as number,
      endDate: goal.endDate,
      savingInterval: goal.savingInterval
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updateGoal,
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
      revalidatePathAction(pathGenerators.goals());
    }
  });

  const onSubmit = async (values: z.infer<typeof editGoalFormSchema>) => {
    await mutate({
      data: {
        ...values,
        id: goal.id,
        valueCents: values.value * 100,
        initialDepositCents: (values.initialDeposit ?? 0) * 100,
        endDate: getUtcMiddayDateOfGivenDate(values.endDate)
      }
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
              name='name'
              render={({ field, fieldState }) => (
                <FormItemWrapper label={t('nameField.label')}>
                  <Input
                    {...field}
                    name='name'
                    placeholder={t('nameField.placeholder')}
                    hasError={!!fieldState.error}
                  />
                </FormItemWrapper>
              )}
            />

            <FormField
              control={form.control}
              name='initialDeposit'
              render={({ field, fieldState }) => (
                <FormItemWrapper label={t('initialDepositField.label')}>
                  <CurrencyInput
                    hasError={!!fieldState.error}
                    currency={currency}
                    {...field}
                  />
                </FormItemWrapper>
              )}
            />

            <FormField
              control={form.control}
              name='value'
              render={({ field, fieldState }) => (
                <FormItemWrapper label={t('valueField.label')}>
                  <CurrencyInput
                    hasError={!!fieldState.error}
                    currency={currency}
                    {...field}
                  />
                </FormItemWrapper>
              )}
            />

            <FormField
              control={form.control}
              name='endDate'
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

            <FormField
              control={form.control}
              name='savingInterval'
              render={({ field, fieldState }) => (
                <FormItemWrapper label={t('savingIntervalField.label')}>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger
                      className='w-full'
                      hasError={!!fieldState.error}
                    >
                      <SelectValue
                        placeholder={t('categoryField.placeholder')}
                      />
                    </SelectTrigger>
                    <IntervalSelectContent />
                  </Select>
                </FormItemWrapper>
              )}
            />

            <Button
              type='submit'
              className='mt-6'
              loading={isPending}
              disabled={isPending}
            >
              {t('editGoalButton')}
            </Button>
          </form>
        </Form>
      </section>
    </Suspense>
  );
};
