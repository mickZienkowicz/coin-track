'use client';

import { Suspense } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { Form, FormField } from '@/components/ui/form';
import { FormItemWrapper } from '@/components/ui/form-item-wrapper';
import { Input } from '@/components/ui/input';
import { pathGenerators } from '@/lib/paths';
import { updateFamily } from '@/server/family/actions/update-family';
import { revalidatePathAction } from '@/server/revalidate/actions/revalidate-path';

const formSchema = z.object({
  familyName: z.string().min(1, {
    message: 'Family name is required.'
  }),
  currency: z.string().min(1, {
    message: 'Currency is required.'
  }),
  timezone: z.string().min(1, {
    message: 'Timezone is required.'
  })
});

export const EditFamilyForm = ({
  closeDialog,
  name,
  currency,
  timezone,
  familyId,
  currencies,
  timezones
}: {
  closeDialog: () => void;
  name: string;
  currency: string;
  timezone: string;
  familyId: string;
  currencies: {
    label: string;
    value: string;
  }[];
  timezones: {
    label: string;
    value: string;
  }[];
}) => {
  const t = useTranslations('settings.editFamily.form');
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      familyName: name,
      currency,
      timezone
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const { success, message } = await updateFamily({
        name: values.familyName,
        familyId,
        currency: values.currency,
        timezone: values.timezone
      });

      if (!success) {
        toast.error(message);
        return;
      }

      toast.success(message);
      closeDialog();
      revalidatePathAction(pathGenerators.settings());
    },
    onError: () => {
      toast.error(t('defaultError'));
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await mutate(values);
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
              name='familyName'
              render={({ field, fieldState }) => (
                <FormItemWrapper label={t('familyNameField.label')}>
                  <Input
                    {...field}
                    name='familyName'
                    placeholder={t('familyNameField.placeholder')}
                    hasError={!!fieldState.error}
                  />
                </FormItemWrapper>
              )}
            />

            <FormField
              control={form.control}
              name='currency'
              render={({ field, fieldState }) => (
                <FormItemWrapper label={t('currencyField.label')}>
                  <Combobox
                    items={currencies}
                    onValueChange={field.onChange}
                    value={field.value}
                    hasError={!!fieldState.error}
                    popoverClassName='w-[240px] p-0 sm:w-[400px] md:w-[462px]'
                    buttonDefaultLabel={t('currencyField.triggerDefaultLabel')}
                    commandInputPlaceholder={t('currencyField.placeholder')}
                    noResultsMessage={t('currencyField.noResultsMessage')}
                  />
                </FormItemWrapper>
              )}
            />

            <FormField
              control={form.control}
              name='timezone'
              render={({ field, fieldState }) => (
                <FormItemWrapper label={t('timezoneField.label')}>
                  <Combobox
                    items={timezones}
                    onValueChange={field.onChange}
                    value={field.value}
                    hasError={!!fieldState.error}
                    popoverClassName='w-[240px] p-0 sm:w-[400px] md:w-[462px]'
                    buttonDefaultLabel={t('timezoneField.triggerDefaultLabel')}
                    commandInputPlaceholder={t('timezoneField.placeholder')}
                    noResultsMessage={t('timezoneField.noResultsMessage')}
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
              {t('saveChangesButton')}
            </Button>
          </form>
        </Form>
      </section>
    </Suspense>
  );
};
