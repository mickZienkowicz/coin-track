'use client';

import { useLocale } from 'next-intl';

import { useCurrentFamilyCurrency } from '@/hooks/use-current-family';
import { Language } from '@/i18n/routing';
import { formatCurrency } from '@/lib/currencies/format-currency';

export const FormattedCurrency = ({ valueCents }: { valueCents: number }) => {
  const locale = useLocale();
  const familyCurrency = useCurrentFamilyCurrency();

  return formatCurrency({
    cents: valueCents,
    currency: familyCurrency,
    language: locale as Language
  });
};
