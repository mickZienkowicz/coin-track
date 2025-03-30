import { defineRouting } from 'next-intl/routing';

export enum Language {
  en = 'en',
  pl = 'pl'
}

export const routing = defineRouting({
  locales: [Language.en, Language.pl],

  defaultLocale: Language.en
});
