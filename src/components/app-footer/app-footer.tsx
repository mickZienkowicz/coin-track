import { useTranslations } from 'next-intl';

import { MAIL } from '@/consts/contact';
import { Link } from '@/i18n/navigation';
import { pathGenerators } from '@/lib/paths';

export const AppFooter = () => {
  const t = useTranslations('footer');

  return (
    <footer className='row-start-3 flex flex-wrap items-center justify-center gap-[24px] px-8 pb-20'>
      <p className='text-primary/30'>
        CoinTrack &copy; {new Date().getFullYear()}
      </p>
      <Link
        href={pathGenerators.termsOfService()}
        className='text-primary/30 underline'
      >
        {t('termsOfService')}
      </Link>
      <Link
        href={pathGenerators.privacyPolicy()}
        className='text-primary/30 underline'
      >
        {t('privacyPolicy')}
      </Link>
      <p className='text-primary/30'>
        {t('mail')}
        <a href={`mailto:${MAIL}`} className='text-primary/30 underline'>
          {MAIL}
        </a>
      </p>
    </footer>
  );
};
