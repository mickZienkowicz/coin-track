import { useTranslations } from 'next-intl';

import { NoFamilyCardFallback } from '../../_components/no-family-card-fallback';
import { FortunePageWrapper } from './_components/fortune-structure/_components/fortune-page-wrapper';

export default function FortunePage() {
  const t = useTranslations('fortune');

  return (
    <div className='@container'>
      <div className='@xl:flex-row flex flex-col items-center justify-between gap-4 2xl:mt-2'>
        <div className='@xl:flex-row @xl:items-center @xl:justify-start flex w-full flex-col gap-6'>
          <h1 className='@xl:w-auto mr-14 flex min-h-11 items-center text-start text-3xl font-semibold lg:mr-0'>
            {t('title')}
          </h1>
        </div>
      </div>

      <NoFamilyCardFallback>
        <FortunePageWrapper />
      </NoFamilyCardFallback>
    </div>
  );
}
