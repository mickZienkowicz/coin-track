'use client';

import { useLocale } from 'next-intl';

import { Language } from '@/i18n/routing';
import TermsOfServiceEN from '@/markdown/en/terms-of-service.mdx';
import TermsOfServicePL from '@/markdown/pl/terms-of-service.mdx';

export default function TermsOfService() {
  const locale = useLocale();

  return locale === Language.pl ? <TermsOfServicePL /> : <TermsOfServiceEN />;
}
