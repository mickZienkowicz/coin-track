import { Language } from '@/i18n/routing';

import { assertUnreachable } from '../utils';

export const getLocaleFromLanguage = (language: Language) => {
  switch (language) {
    case Language.pl:
      return 'pl-PL';
    case Language.en:
      return 'en-US';
    default:
      assertUnreachable(language);
  }
};
