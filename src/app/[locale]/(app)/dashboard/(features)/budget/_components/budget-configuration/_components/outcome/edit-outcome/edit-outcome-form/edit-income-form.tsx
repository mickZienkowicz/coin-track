'use client';

import { Suspense } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Outcome, RecurrenceType } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { IntervalSelectContent } from '@/app/[locale]/(app)/dashboard/_components/interval-select-content';
import { RecurrenceSelectContent } from '@/app/[locale]/(app)/dashboard/_components/recurrence-select-content/recurrence-select-content';
import { Button } from '@/components/ui/button';
import { CurrencyInput } from '@/components/ui/currency-input';
import { DatePicker } from '@/components/ui/date-picker';
import { Form, FormField } from '@/components/ui/form';
import { FormItemWrapper } from '@/components/ui/form-item-wrapper';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useCurrentFamilyCurrency } from '@/hooks/use-current-family';
import { getOutcomesCategories } from '@/lib/categories';
import { dateSchemaWithMinDate } from '@/lib/dates/date-schema-with-min-date';
import { pathGenerators } from '@/lib/paths';
import { getNumberSchema } from '@/lib/schemas/number-schema';
import { updateOutcome } from '@/server/outcome/actions/update-outcome';
import { revalidatePathAction } from '@/server/revalidate/actions/revalidate-path';

export const getEditOutcomeFormSchema = (
  t: ReturnType<typeof useTranslations>
) =>
  z.object({
    name: z.string().min(1, t('nameField.error')),
    category: z.string().min(1, t('categoryField.error')),
    value: getNumberSchema(t('valueField.error')),
    date: dateSchemaWithMinDate({ message: t('dateField.error') })
  });

export const EditOutcomeForm = ({
  closeDialog,
  outcome
}: {
  closeDialog: () => void;
  outcome: Outcome;
}) => {
  const currency = useCurrentFamilyCurrency();
  const outcomeCategoriesT = useTranslations('categories');
  const t = useTranslations('budget.outcomes.editOutcome.form');
  const editOutcomeFormSchema = getEditOutcomeFormSchema(t);
  const form = useForm<z.infer<typeof editOutcomeFormSchema>>({
    resolver: zodResolver(editOutcomeFormSchema),
    defaultValues: {
      name: outcome.name,
      category: outcome.category,
      value: (outcome.valueCents / 100).toString() as unknown as number,
      date: outcome.date
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updateOutcome,
    onError: () => {
      toast.error(t('error'));
    },
    onSuccess: ({ success, message }) => {
      if (!success) {
        toast.error(message);
        return;
      }

      closeDialog();
      toast.success(message);
      revalidatePathAction(pathGenerators.budget());
    }
  });

  const onSubmit = async (values: z.infer<typeof editOutcomeFormSchema>) => {
    const data: {
      name: string;
      category: string;
      valueCents?: number;
      date?: Date;
    } = {
      name: values.name,
      category: values.category
    };

    if (outcome.recurrence === RecurrenceType.ONE_TIME) {
      data.valueCents = values.value * 100;
      data.date = values.date;
    }

    await mutate({
      id: outcome.id,
      data
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
              name='category'
              render={({ field, fieldState }) => (
                <FormItemWrapper label={t('categoryField.label')}>
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
                    <SelectContent>
                      {getOutcomesCategories(outcomeCategoriesT).map(
                        (category) => (
                          <SelectItem
                            key={category.value}
                            value={category.value}
                          >
                            <category.icon className='size-4' />
                            {category.name}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </FormItemWrapper>
              )}
            />

            <FormField
              control={form.control}
              name='value'
              render={({ field, fieldState }) => (
                <FormItemWrapper label={t('valueField.label')}>
                  <CurrencyInput
                    {...field}
                    currency={currency}
                    disabled={outcome.recurrence !== RecurrenceType.ONE_TIME}
                    hasError={!!fieldState.error}
                  />
                </FormItemWrapper>
              )}
            />

            <FormField
              control={form.control}
              name='date'
              render={({ field, fieldState }) => (
                <FormItemWrapper
                  label={t('dateField.label')}
                  additionalInfo={t('dateField.additionalInfo')}
                >
                  <DatePicker
                    date={field.value}
                    setDate={(e) => {
                      if (outcome.recurrence === RecurrenceType.ONE_TIME) {
                        field.onChange(e);
                      }
                    }}
                    disabled={outcome.recurrence !== RecurrenceType.ONE_TIME}
                    hasError={!!fieldState.error}
                  />
                </FormItemWrapper>
              )}
            />

            <FormItemWrapper label={t('recurrenceField.label')} disabled>
              <Select defaultValue={outcome.recurrence} disabled>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder={t('recurrenceField.placeholder')} />
                </SelectTrigger>
                <RecurrenceSelectContent />
              </Select>
            </FormItemWrapper>

            {outcome.repeatEvery && (
              <FormItemWrapper label={t('repeatEveryField.label')} disabled>
                <Select defaultValue={outcome.repeatEvery} disabled>
                  <SelectTrigger className='w-full'>
                    <SelectValue
                      placeholder={t('repeatEveryField.placeholder')}
                    />
                  </SelectTrigger>
                  <IntervalSelectContent />
                </Select>
              </FormItemWrapper>
            )}

            {outcome.repeatCount && (
              <FormItemWrapper label={t('repeatCountField.label')} disabled>
                <Input disabled value={outcome.repeatCount} type='number' />
              </FormItemWrapper>
            )}

            <Button
              type='submit'
              className='mt-6'
              loading={isPending}
              disabled={isPending}
            >
              {t('editButton')}
            </Button>
          </form>
        </Form>
      </section>
    </Suspense>
  );
};
