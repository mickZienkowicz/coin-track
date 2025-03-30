import cc from 'currency-codes';

import { Language } from '@/i18n/routing';

import { getLocaleFromLanguage } from '../locale/get-locale-from-language';

export const currecnies = cc.codes().filter((code) => {
  try {
    new Intl.NumberFormat('en', { style: 'currency', currency: code });
    return true;
  } catch {
    return false;
  }
});

export const formatCurrency = ({
  cents,
  currency = 'PLN',
  language = Language.pl
}: {
  cents: number;
  currency: string;
  language: Language;
}) => {
  if (!currecnies.includes(currency)) {
    throw new Error(`Currency ${currency} is not supported`);
  }

  return new Intl.NumberFormat(getLocaleFromLanguage(language), {
    style: 'currency',
    currency,
    minimumFractionDigits: 2
  }).format(cents / 100);
};
