'use client';

import { Suspense } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Interval } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { IntervalSelectContent } from '@/app/[locale]/dashboard/_components/interval-select-content';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
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
import { createFamily } from '@/server/family/actions/create-family';
import { revalidatePathAction } from '@/server/revalidate/actions/revalidate-path';

enum YesNoEnum {
  YES = 'yes',
  NO = 'no'
}

const getFormSchema = (t: ReturnType<typeof useTranslations>) =>
  z.object({
    familyName: z.string().min(1, {
      message: t('familyNameField.error')
    }),
    currency: z.string().min(1, {
      message: t('currencyField.error')
    }),
    timezone: z.string().min(1, {
      message: t('timezoneField.error')
    }),
    budgetStartDate: dateSchemaWithMinDate(),
    budgetInterval: z.nativeEnum(Interval),
    budgetTransferPouchBalance: z.nativeEnum(YesNoEnum)
  });

export const AddFamilyForm = ({
  closeDialog,
  currencies,
  timezones
}: {
  closeDialog: () => void;
  currencies: {
    label: string;
    value: string;
  }[];
  timezones: {
    label: string;
    value: string;
  }[];
}) => {
  const t = useTranslations('settings.addFamily.form');
  const formSchema = getFormSchema(t);
  const deviceTimezone =
    Intl?.DateTimeFormat()?.resolvedOptions()?.timeZone || 'Europe/Warsaw';

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      familyName: '',
      currency: deviceTimezone === 'Europe/Warsaw' ? 'PLN' : 'USD',
      timezone: deviceTimezone,
      budgetStartDate: new Date(),
      budgetInterval: Interval.MONTH,
      budgetTransferPouchBalance: YesNoEnum.NO
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createFamily,
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await mutate({
      name: values.familyName,
      currency: values.currency,
      timezone: values.timezone,
      budgetStartDate: getUtcMiddayDateOfGivenDate(values.budgetStartDate),
      budgetInterval: values.budgetInterval,
      budgetTransferPouchBalance:
        values.budgetTransferPouchBalance === YesNoEnum.YES
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
            <FormField
              control={form.control}
              name='budgetInterval'
              render={({ field, fieldState }) => (
                <FormItemWrapper label={t('budgetIntervalField.label')}>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger
                      className='w-full'
                      hasError={!!fieldState.error}
                    >
                      <SelectValue
                        placeholder={t(
                          'budgetIntervalField.triggerDefaultLabel'
                        )}
                      />
                    </SelectTrigger>
                    <IntervalSelectContent />
                  </Select>
                </FormItemWrapper>
              )}
            />

            <FormField
              control={form.control}
              name='budgetStartDate'
              render={({ field, fieldState }) => (
                <FormItemWrapper label={t('budgetStartDateField.label')}>
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
              name='budgetTransferPouchBalance'
              render={({ field, fieldState }) => (
                <FormItemWrapper
                  label={t('budgetTransferPouchBalanceField.label')}
                >
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger
                      id='budgetTransferPouchBalance'
                      className='w-full'
                      hasError={!!fieldState.error}
                    >
                      <SelectValue
                        placeholder={t(
                          'budgetTransferPouchBalanceField.triggerDefaultLabel'
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={YesNoEnum.YES}>
                        {t('budgetTransferPouchBalanceField.yes')}
                      </SelectItem>
                      <SelectItem value={YesNoEnum.NO}>
                        {t('budgetTransferPouchBalanceField.no')}
                      </SelectItem>
                    </SelectContent>
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
              {t('saveChangesButton')}
            </Button>
          </form>
        </Form>
      </section>
    </Suspense>
  );
};
