'use client';

import { useLocale } from 'next-intl';

import { Language } from '@/i18n/routing';
import PrivacyPolicyEN from '@/markdown/en/privacy-policy.mdx';
import PrivacyPolicyPL from '@/markdown/pl/privacy-policy.mdx';

export default function PrivacyPolicy() {
  const locale = useLocale();

  return locale === Language.pl ? <PrivacyPolicyPL /> : <PrivacyPolicyEN />;
}
