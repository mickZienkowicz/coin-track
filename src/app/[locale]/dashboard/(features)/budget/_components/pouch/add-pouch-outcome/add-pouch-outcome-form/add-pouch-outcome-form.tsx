'use client';

import { Suspense } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { PouchWithCurrentBudgetOccurance } from '@/server/budget/types';
import { createPouchOutcome } from '@/server/pouch/actions/create-pouch-outcome';
import { revalidatePathAction } from '@/server/revalidate/actions/revalidate-path';

import { PouchOutcomeProgressBar } from '../../pouch-outcome-progress-bar/pouch-outcome-progress-bar';

const getAddPouchOutcomeFormSchema = (t: ReturnType<typeof useTranslations>) =>
  z.object({
    value: z.coerce.number().positive(t('valueField.error')),
    name: z.string().min(1, t('nameField.error')),
    date: dateSchemaWithMinDate({ message: t('dateField.error') }),
    pouch: z.string().min(1, t('pouchField.error'))
  });

export const AddPouchOutcomeForm = ({
  closeDialog,
  currency,
  pouchId,
  pouches
}: {
  pouches: PouchWithCurrentBudgetOccurance[];
  closeDialog: () => void;
  currency: string;
  pouchId?: string;
}) => {
  const t = useTranslations('budget.pouch.pouchCard.addPouchOutcome.form');
  const addPouchOutcomeFormSchema = getAddPouchOutcomeFormSchema(t);
  const form = useForm<z.infer<typeof addPouchOutcomeFormSchema>>({
    resolver: zodResolver(addPouchOutcomeFormSchema),
    defaultValues: {
      value: 0,
      name: '',
      date: new Date(),
      pouch: pouchId ?? pouches?.at(0)?.id
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createPouchOutcome,
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

  const onSubmit = async (
    values: z.infer<typeof addPouchOutcomeFormSchema>
  ) => {
    await mutate({
      data: {
        pouchId: pouchId || values.pouch,
        name: values.name,
        valueCents: values.value * 100,
        date: getUtcMiddayDateOfGivenDate(values.date)
      }
    });
  };

  const value = form.watch('value');
  const selectedPouchId = form.watch('pouch');
  const selectedPouch = pouches.find((pouch) => pouch.id === selectedPouchId);

  return (
    <>
      {selectedPouch && (
        <PouchOutcomeProgressBar pouch={selectedPouch} outcome={value} />
      )}
      <Suspense>
        <section className='w-full'>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='flex w-full flex-col gap-5'
            >
              <FormField
                control={form.control}
                name='pouch'
                render={({ field, fieldState }) => (
                  <FormItemWrapper label={t('pouchField.label')}>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!!pouchId}
                    >
                      <SelectTrigger
                        className='w-full'
                        hasError={!!fieldState.error}
                      >
                        <SelectValue
                          placeholder={t('pouchField.placeholder')}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {pouches.map((pouch) => (
                          <SelectItem key={pouch.id} value={pouch.id}>
                            {pouch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItemWrapper>
                )}
              />

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
                {t('createPouchOutcomeButton')}
              </Button>
            </form>
          </Form>
        </section>
      </Suspense>
    </>
  );
};
