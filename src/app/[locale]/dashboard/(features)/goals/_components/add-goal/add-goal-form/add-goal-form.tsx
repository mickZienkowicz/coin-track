'use client';

import { Suspense } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Interval } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import { addHours, isAfter } from 'date-fns';
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
import { Progress } from '@/components/ui/progress';
import { Select, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCurrentFamilyCurrency } from '@/hooks/use-current-family';
import { getUtcMiddayDateOfGivenDate } from '@/lib/dates/get-utc-midday-date-of-given-date';
import { pathGenerators } from '@/lib/paths';
import { getNumberSchema } from '@/lib/schemas/number-schema';
import { createGoal } from '@/server/goal/actions/create-goal';
import { revalidatePathAction } from '@/server/revalidate/actions/revalidate-path';

const getAddGoalFormSchema = (t: ReturnType<typeof useTranslations>) =>
  z.object({
    name: z.string().min(1, t('nameField.error')),
    value: getNumberSchema(t('valueField.error')),
    initialDeposit: getNumberSchema(t('initialDepositField.error')),
    endDate: z
      .date({ required_error: t('dateField.error') })
      .refine(
        (date) =>
          isAfter(date, addHours(getUtcMiddayDateOfGivenDate(new Date()), 4)),
        {
          message: t('dateField.errorMustBeInTheFuture')
        }
      ),
    savingInterval: z.nativeEnum(Interval)
  });

export const AddGoalForm = ({ closeDialog }: { closeDialog: () => void }) => {
  const currency = useCurrentFamilyCurrency();
  const t = useTranslations('goals.addGoal.form');
  const addGoalFormSchema = getAddGoalFormSchema(t);
  const form = useForm<z.infer<typeof addGoalFormSchema>>({
    resolver: zodResolver(addGoalFormSchema),
    defaultValues: {
      name: '',
      value: undefined,
      initialDeposit: undefined,
      endDate: undefined,
      savingInterval: Interval.MONTH
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createGoal,
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

  const onSubmit = async (values: z.infer<typeof addGoalFormSchema>) => {
    await mutate({
      data: {
        ...values,
        valueCents: values.value * 100,
        initialDepositCents: values.initialDeposit * 100,
        endDate: getUtcMiddayDateOfGivenDate(values.endDate)
      }
    });
  };

  return (
    <>
      <Progress
        progressBarClassName='bg-blue-600'
        className='mb-4'
        value={
          form.watch('value')
            ? ((form.watch('initialDeposit') ?? 0) / form.watch('value')) * 100
            : 0
        }
      />
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
                {t('addGoalButton')}
              </Button>
            </form>
          </Form>
        </section>
      </Suspense>
    </>
  );
};
