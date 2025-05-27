'use client';

import { Suspense } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import { FormItemWrapper } from '@/components/ui/form-item-wrapper';
import { Input } from '@/components/ui/input';
import { pathGenerators } from '@/lib/paths';
import { sendInvitation } from '@/server/invitation/actions/send-invitation';
import { revalidatePathAction } from '@/server/revalidate/actions/revalidate-path';

const getFormSchema = (t: ReturnType<typeof useTranslations>) =>
  z.object({
    email: z.string().email({
      message: t('emailField.error')
    })
  });

export const InviteUserToFamilyForm = ({
  familyId,
  closeDialog
}: {
  familyId: string;
  closeDialog: () => void;
}) => {
  const t = useTranslations('settings.inviteUserToFamily.form');
  const formSchema = getFormSchema(t);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ''
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: sendInvitation,
    onError: () => {
      toast.error(t('error'));
    },
    onSuccess: ({ success, message }) => {
      if (!success) {
        toast.error(message);
        return;
      }

      form.reset();
      closeDialog();
      toast.success(message);
      revalidatePathAction(pathGenerators.settings());
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await mutate({ familyId, email: values.email });
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
              name='email'
              render={({ field, fieldState }) => (
                <FormItemWrapper label={t('emailField.label')}>
                  <Input
                    {...field}
                    name='email'
                    placeholder={t('emailField.placeholder')}
                    hasError={!!fieldState.error}
                    autoComplete='email'
                  />
                </FormItemWrapper>
              )}
            />
            <Button
              type='submit'
              className='mt-6'
              disabled={isPending}
              loading={isPending}
            >
              {t('sendInvitationButton')}
            </Button>
          </form>
        </Form>
      </section>
    </Suspense>
  );
};
