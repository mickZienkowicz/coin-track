'use client';

import { Suspense } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { PouchExpense } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { CurrencyInput } from '@/components/ui/currency-input';
import { DatePicker } from '@/components/ui/date-picker';
import { Form, FormField } from '@/components/ui/form';
import { FormItemWrapper } from '@/components/ui/form-item-wrapper';
import { Input } from '@/components/ui/input';
import { dateSchemaWithMinDate } from '@/lib/dates/date-schema-with-min-date';
import { pathGenerators } from '@/lib/paths';
import { updatePouchOutcome } from '@/server/pouch/actions/update-pouch-outcome';
import { revalidatePathAction } from '@/server/revalidate/actions/revalidate-path';

export const getEditPouchOutcomeFormSchema = (
  t: ReturnType<typeof useTranslations>
) =>
  z.object({
    value: z.coerce.number().positive(t('valueField.error')),
    date: dateSchemaWithMinDate({ message: t('dateField.error') }),
    name: z.string().min(1, t('nameField.error'))
  });

export const EditPouchOutcomeForm = ({
  closeDialog,
  pouchOutcome,
  currency
}: {
  closeDialog: () => void;
  pouchOutcome: PouchExpense;
  currency: string;
}) => {
  const t = useTranslations('budget.pouch.pouchCard.editPouchOutcome.form');
  const editPouchOutcomeFormSchema = getEditPouchOutcomeFormSchema(t);
  const form = useForm<z.infer<typeof editPouchOutcomeFormSchema>>({
    resolver: zodResolver(editPouchOutcomeFormSchema),
    defaultValues: {
      name: pouchOutcome.name,
      value: pouchOutcome.valueCents / 100,
      date: pouchOutcome.date
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updatePouchOutcome,
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

  const onSubmit = async (
    values: z.infer<typeof editPouchOutcomeFormSchema>
  ) => {
    await mutate({
      id: pouchOutcome.id,
      data: {
        name: values.name,
        valueCents: values.value * 100,
        date: values.date
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
              loading={isPending}
              disabled={isPending}
            >
              {t('editPouchOutcomeButton')}
            </Button>
          </form>
        </Form>
      </section>
    </Suspense>
  );
};
