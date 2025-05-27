'use client';

import { Suspense } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pouch, RecurrenceType } from '@prisma/client';
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
import { dateSchemaWithMinDate } from '@/lib/dates/date-schema-with-min-date';
import { pathGenerators } from '@/lib/paths';
import { getNumberSchema } from '@/lib/schemas/number-schema';
import { updatePouch } from '@/server/pouch/actions/update-pouch';
import { revalidatePathAction } from '@/server/revalidate/actions/revalidate-path';

export const getEditPouchFormSchema = (t: ReturnType<typeof useTranslations>) =>
  z.object({
    name: z.string().min(1, t('nameField.error')),
    category: z.string().min(1, t('categoryField.error')),
    value: getNumberSchema(t('valueField.error')),
    date: dateSchemaWithMinDate({ message: t('dateField.error') })
  });

export const EditPouchForm = ({
  closeDialog,
  pouch
}: {
  closeDialog: () => void;
  pouch: Pouch;
}) => {
  const currency = useCurrentFamilyCurrency();
  const queryClient = useQueryClient();
  const t = useTranslations('budget.pouch.pouchCard.editPouch.form');
  const editPouchFormSchema = getEditPouchFormSchema(t);
  const pouchCategoriesT = useTranslations('categories');
  const form = useForm<z.infer<typeof editPouchFormSchema>>({
    resolver: zodResolver(editPouchFormSchema),
    defaultValues: {
      name: pouch.name,
      category: pouch.category,
      value: (pouch.valueCents / 100).toString() as unknown as number,
      date: pouch.date
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updatePouch,
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
      queryClient.invalidateQueries({ queryKey: ['pouches'] });
      revalidatePathAction(pathGenerators.budget());
    }
  });

  const onSubmit = async (values: z.infer<typeof editPouchFormSchema>) => {
    const data: {
      name: string;
      category: string;
      valueCents?: number;
      date?: Date;
    } = {
      name: values.name,
      category: values.category
    };

    if (pouch.recurrence === RecurrenceType.ONE_TIME) {
      data.valueCents = values.value * 100;
      data.date = values.date;
    }

    await mutate({
      id: pouch.id,
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
              name='value'
              render={({ field, fieldState }) => (
                <FormItemWrapper label={t('valueField.label')}>
                  <CurrencyInput
                    {...field}
                    currency={currency}
                    disabled={pouch.recurrence !== RecurrenceType.ONE_TIME}
                    hasError={!!fieldState.error}
                  />
                </FormItemWrapper>
              )}
            />

            <FormField
              control={form.control}
              name='date'
              render={({ field, fieldState }) => (
                <FormItemWrapper label={t('dateField.label')}>
                  <DatePicker
                    date={field.value}
                    setDate={(e) => {
                      if (pouch.recurrence === RecurrenceType.ONE_TIME) {
                        field.onChange(e);
                      }
                    }}
                    disabled={pouch.recurrence !== RecurrenceType.ONE_TIME}
                    hasError={!!fieldState.error}
                  />
                </FormItemWrapper>
              )}
            />

            <FormItemWrapper label={t('recurrenceField.label')} disabled>
              <Select defaultValue={pouch.recurrence} disabled>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder={t('recurrenceField.placeholder')} />
                </SelectTrigger>
                <RecurrenceSelectContent />
              </Select>
            </FormItemWrapper>

            {pouch.repeatEvery && (
              <FormItemWrapper label={t('repeatEveryField.label')} disabled>
                <Select defaultValue={pouch.repeatEvery} disabled>
                  <SelectTrigger className='w-full'>
                    <SelectValue
                      placeholder={t('repeatEveryField.placeholder')}
                    />
                  </SelectTrigger>
                  <IntervalSelectContent />
                </Select>
              </FormItemWrapper>
            )}

            {pouch.repeatCount && (
              <FormItemWrapper label={t('repeatCountField.label')} disabled>
                <Input disabled value={pouch.repeatCount} type='number' />
              </FormItemWrapper>
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
