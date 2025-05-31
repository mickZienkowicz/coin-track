import { useLocale, useTranslations } from 'next-intl';

import { MAIL_EN, MAIL_PL } from '@/consts/contact';
import { Link } from '@/i18n/navigation';
import { Language } from '@/i18n/routing';
import { pathGenerators } from '@/lib/paths';

export const AppFooter = () => {
  const t = useTranslations('footer');
  const locale = useLocale();

  return (
    <footer className='row-start-3 flex flex-wrap items-center justify-center gap-[24px] px-8 pb-16'>
      <p className='text-sm text-primary/30'>
        CoinTrack &copy; {new Date().getFullYear()}
      </p>
      <Link
        href={pathGenerators.termsOfService()}
        className='text-sm text-primary/30 underline'
      >
        {t('termsOfService')}
      </Link>
      <Link
        href={pathGenerators.privacyPolicy()}
        className='text-sm text-primary/30 underline'
      >
        {t('privacyPolicy')}
      </Link>
      <p className='text-sm text-primary/30'>
        {t('mail')}{' '}
        <a
          href={`mailto:${locale === Language.pl ? MAIL_PL : MAIL_EN}`}
          className='text-sm text-primary/30 underline'
        >
          {locale === Language.pl ? MAIL_PL : MAIL_EN}
        </a>
      </p>
    </footer>
  );
};
