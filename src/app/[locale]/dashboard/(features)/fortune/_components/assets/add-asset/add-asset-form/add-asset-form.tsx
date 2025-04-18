'use client';

import { Suspense } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { AssetCategory } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { CurrencyInput } from '@/components/ui/currency-input';
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
import { pathGenerators } from '@/lib/paths';
import { getNumberSchema } from '@/lib/schemas/number-schema';
import { createFortuneAsset } from '@/server/fortune/actions/create-fortune-asset';
import { revalidatePathAction } from '@/server/revalidate/actions/revalidate-path';

const getAddAssetFormSchema = (t: ReturnType<typeof useTranslations>) =>
  z.object({
    name: z.string().min(1, t('nameField.error')),
    description: z.string(),
    category: z.nativeEnum(AssetCategory),
    value: getNumberSchema(t('valueField.error'))
  });

export const AddAssetForm = ({ closeDialog }: { closeDialog: () => void }) => {
  const currency = useCurrentFamilyCurrency();
  const t = useTranslations('fortune.assets.addAsset.form');
  const addAssetFormSchema = getAddAssetFormSchema(t);
  const form = useForm<z.infer<typeof addAssetFormSchema>>({
    resolver: zodResolver(addAssetFormSchema),
    defaultValues: {
      name: '',
      description: '',
      category: AssetCategory.FINANCIAL_CUSHION,
      value: undefined
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createFortuneAsset,
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
      revalidatePathAction(pathGenerators.fortune());
    }
  });

  const onSubmit = async (values: z.infer<typeof addAssetFormSchema>) => {
    await mutate({
      data: {
        name: values.name,
        description: values.description ?? '',
        valueCents: values.value * 100,
        category: values.category
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
                      <SelectItem value={AssetCategory.FINANCIAL_CUSHION}>
                        {t('category.financialCushion')}
                      </SelectItem>
                      <SelectItem value={AssetCategory.LIVING_ASSETS}>
                        {t('category.livingAssets')}
                      </SelectItem>
                      <SelectItem value={AssetCategory.INVESTMENTS}>
                        {t('category.investmentAssets')}
                      </SelectItem>
                      <SelectItem value={AssetCategory.OTHER}>
                        {t('category.otherAssets')}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormItemWrapper>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field, fieldState }) => (
                <FormItemWrapper label={t('descriptionField.label')}>
                  <Input
                    {...field}
                    name='description'
                    placeholder={t('descriptionField.placeholder')}
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

            <Button
              type='submit'
              className='mt-6'
              loading={isPending}
              disabled={isPending}
            >
              {t('addAssetButton')}
            </Button>
          </form>
        </Form>
      </section>
    </Suspense>
  );
};
