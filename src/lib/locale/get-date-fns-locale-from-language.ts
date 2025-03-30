import { enUS, pl } from 'date-fns/locale';

import { Language } from '@/i18n/routing';

import { assertUnreachable } from '../utils';

export const getDateFnsLocaleFromLanguage = (language: Language) => {
  switch (language) {
    case Language.pl:
      return pl;
    case Language.en:
      return enUS;
    default:
      assertUnreachable(language);
  }
};
