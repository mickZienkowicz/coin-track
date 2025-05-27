'use client';

import { Suspense } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { RecurrenceType } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
import { getPouchCategories } from '@/lib/categories';
import { getUtcMiddayDateOfGivenDate } from '@/lib/dates/get-utc-midday-date-of-given-date';
import { pathGenerators } from '@/lib/paths';
import { createPouch } from '@/server/pouch/actions/create-pouch';
import { revalidatePathAction } from '@/server/revalidate/actions/revalidate-path';

import { getAddPouchFormSchema } from './utils/add-pouch-form-schema';

export const AddPouchForm = ({ closeDialog }: { closeDialog: () => void }) => {
  const currency = useCurrentFamilyCurrency();
  const queryClient = useQueryClient();
  const pouchCategoriesT = useTranslations('categories');
  const t = useTranslations('budget.pouch.pouchCard.addPouch.form');
  const addPouchFormSchema = getAddPouchFormSchema(t);
  const form = useForm<z.infer<typeof addPouchFormSchema>>({
    resolver: zodResolver(addPouchFormSchema),
    defaultValues: {
      value: undefined,
      name: '',
      date: new Date(),
      recurrence: RecurrenceType.ONE_TIME,
      repeatCount: undefined,
      repeatEvery: undefined,
      category: ''
    }
  });

  const isRecuring = form.watch('recurrence') !== RecurrenceType.ONE_TIME;
  const isInfiniteRecuring =
    form.watch('recurrence') === RecurrenceType.INFINITE;

  const { mutate, isPending } = useMutation({
    mutationFn: createPouch,
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
      queryClient.invalidateQueries({ queryKey: ['pouches'] });
    }
  });

  const onSubmit = async (values: z.infer<typeof addPouchFormSchema>) => {
    await mutate({
      data: {
        ...values,
        valueCents: values.value * 100,
        date: getUtcMiddayDateOfGivenDate(values.date)
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
              name='date'
              render={({ field, fieldState }) => (
                <FormItemWrapper
                  label={t('dateField.label')}
                  additionalInfo={t('dateField.additionalInfo')}
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
                      {getPouchCategories(pouchCategoriesT).map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          <category.icon className='size-4' />
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItemWrapper>
              )}
            />

            <FormField
              control={form.control}
              name='recurrence'
              render={({ field, fieldState }) => (
                <FormItemWrapper
                  label={t('recurrenceField.label')}
                  additionalInfo={t('recurrenceField.additionalInfo')}
                >
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger
                      className='w-full'
                      hasError={!!fieldState.error}
                    >
                      <SelectValue
                        placeholder={t('recurrenceField.placeholder')}
                      />
                    </SelectTrigger>
                    <RecurrenceSelectContent />
                  </Select>
                </FormItemWrapper>
              )}
            />

            {isRecuring && (
              <FormField
                control={form.control}
                name='repeatEvery'
                render={({ field, fieldState }) => (
                  <FormItemWrapper label={t('repeatEveryField.label')}>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger
                        className='w-full'
                        hasError={!!fieldState.error}
                      >
                        <SelectValue
                          placeholder={t('recurrenceField.placeholder')}
                        />
                      </SelectTrigger>
                      <IntervalSelectContent />
                    </Select>
                  </FormItemWrapper>
                )}
              />
            )}

            {isRecuring && !isInfiniteRecuring && (
              <FormField
                control={form.control}
                name='repeatCount'
                render={({ field, fieldState }) => (
                  <FormItemWrapper label={t('repeatCountField.label')}>
                    <Input
                      {...field}
                      value={field.value?.toString()}
                      onChange={(e) => {
                        const value = e.target.value;

                        if (value === '') {
                          field.onChange(undefined);
                        }

                        if (!isNaN(Number(value))) {
                          field.onChange(Number(value));
                        }
                      }}
                      type='number'
                      step='0'
                      placeholder={t('repeatCountField.placeholder')}
                      hasError={!!fieldState.error}
                    />
                  </FormItemWrapper>
                )}
              />
            )}

            <Button
              type='submit'
              className='mt-6'
              loading={isPending}
              disabled={isPending}
            >
              {t('createPouchButton')}
            </Button>
          </form>
        </Form>
      </section>
    </Suspense>
  );
};
