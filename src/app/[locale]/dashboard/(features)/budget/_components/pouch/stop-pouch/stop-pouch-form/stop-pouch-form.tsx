'use client';

import { Suspense } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Pouch } from '@prisma/client';
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
import { stopPouch } from '@/server/pouch/actions/stop-pouch';
import { revalidatePathAction } from '@/server/revalidate/actions/revalidate-path';

export const getStopPouchFormSchema = (t: ReturnType<typeof useTranslations>) =>
  z.object({
    date: dateSchemaWithMinDate({ message: t('dateField.error') })
  });

export const StopPouchForm = ({
  closeDialog,
  pouch
}: {
  closeDialog: () => void;
  pouch: Pouch;
}) => {
  const t = useTranslations('budget.pouch.pouchCard.stopPouch.form');
  const stopPouchFormSchema = getStopPouchFormSchema(t);
  const form = useForm<z.infer<typeof stopPouchFormSchema>>({
    resolver: zodResolver(stopPouchFormSchema),
    defaultValues: {
      date: getUtcMiddayDateOfGivenDate(new Date())
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: stopPouch,
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
      revalidatePathAction(pathGenerators.settings());
    }
  });

  const onSubmit = async (values: z.infer<typeof stopPouchFormSchema>) => {
    await mutate({
      id: pouch.id,
      date: getUtcMiddayDateOfGivenDate(values.date)
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
              {t('stopPouchButton')}
            </Button>
          </form>
        </Form>
      </section>
    </Suspense>
  );
};
