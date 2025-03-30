import { Language } from '@/i18n/routing';

import { getLocaleFromLanguage } from '../locale/get-locale-from-language';

export const currencyCodes = Intl.supportedValuesOf('currency');

export const getCurrencyList = ({
  language = Language.pl
}: {
  language: Language;
}) => {
  const currencyDisplayNames = new Intl.DisplayNames(
    [getLocaleFromLanguage(language)],
    {
      type: 'currency'
    }
  );

  const currencies = currencyCodes
    .filter((code) => !!currencyDisplayNames.of(code))
    .map((code) => ({
      value: code,
      label: `${code} - ${currencyDisplayNames.of(code)}`
    }));

  return currencies as { value: string; label: string }[];
};
