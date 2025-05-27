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
import { Form, FormField } from '@/components/ui/form';
import { FormItemWrapper } from '@/components/ui/form-item-wrapper';
import { useCurrentFamilyCurrency } from '@/hooks/use-current-family';
import { pathGenerators } from '@/lib/paths';
import { getNumberSchema } from '@/lib/schemas/number-schema';
import { updateGoalOutcome } from '@/server/goal/actions/update-goal-outcome';
import { revalidatePathAction } from '@/server/revalidate/actions/revalidate-path';

const getEditGoalOutcomeFormSchema = (t: ReturnType<typeof useTranslations>) =>
  z.object({
    value: getNumberSchema(t('valueField.error'))
  });

export const EditGoalOutcomeForm = ({
  closeDialog,
  outcomeId,
  valueCents
}: {
  closeDialog: () => void;
  outcomeId: string;
  valueCents: number;
}) => {
  const currency = useCurrentFamilyCurrency();
  const t = useTranslations('goals.editGoalOutcome.form');
  const editGoalOutcomeFormSchema = getEditGoalOutcomeFormSchema(t);
  const form = useForm<z.infer<typeof editGoalOutcomeFormSchema>>({
    resolver: zodResolver(editGoalOutcomeFormSchema),
    defaultValues: {
      value: Math.round(valueCents / 100).toString() as unknown as number
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updateGoalOutcome,
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

  const onSubmit = async (
    values: z.infer<typeof editGoalOutcomeFormSchema>
  ) => {
    await mutate({
      outcomeId,
      valueCents: values.value * 100
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

            <Button
              type='submit'
              className='mt-6'
              loading={isPending}
              disabled={isPending}
            >
              {t('editGoalOutcomeButton')}
            </Button>
          </form>
        </Form>
      </section>
    </Suspense>
  );
};
