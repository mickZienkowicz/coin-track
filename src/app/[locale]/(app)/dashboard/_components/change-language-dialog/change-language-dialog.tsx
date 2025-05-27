'use client';

import { Suspense, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale, useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Form, FormField } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { usePathname, useRouter } from '@/i18n/navigation';
import { Language } from '@/i18n/routing';

const languageFormSchema = z.object({
  language: z.nativeEnum(Language)
});

export const ChangeLanguageDialog = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const t = useTranslations('menu.languageSwitcher');
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof languageFormSchema>>({
    resolver: zodResolver(languageFormSchema),
    defaultValues: {
      language: locale as Language
    }
  });

  const onSubmit = async (values: z.infer<typeof languageFormSchema>) => {
    setIsLoading(true);
    await router.push(pathname, { locale: values.language });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <Suspense>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='flex w-full flex-col gap-5'
            >
              <FormField
                control={form.control}
                name='language'
                render={({ field, fieldState }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger
                      hasError={!!fieldState.error}
                      className='w-full'
                    >
                      <SelectValue placeholder={t('placeholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={Language.pl}>{t('polish')}</SelectItem>
                      <SelectItem value={Language.en}>
                        {t('english')}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <Button
                type='submit'
                className='mt-2'
                loading={isLoading}
                disabled={isLoading}
              >
                {t('changeLanguageButton')}
              </Button>
            </form>
          </Form>
        </Suspense>
      </DialogContent>
    </Dialog>
  );
};
