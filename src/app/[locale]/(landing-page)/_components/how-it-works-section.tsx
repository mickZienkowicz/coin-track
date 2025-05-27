import { Calendar, CheckCircle, TrendingUp } from 'lucide-react';
import { useTranslations } from 'next-intl';

export const HowItWorksSection = () => {
  const t = useTranslations('landingPage.howItWorksSection');
  return (
    <section className='space-y-10'>
      <div className='space-y-4 text-center'>
        <h2 className='text-3xl font-bold'>{t('title')}</h2>
        <p className='mx-auto max-w-xl text-primary/70'>{t('description')}</p>
      </div>

      <div className='grid grid-cols-1 gap-10 md:grid-cols-3'>
        <div className='flex flex-col items-center space-y-4 text-center'>
          <div className='rounded-full bg-brand-primary/30 p-4'>
            <Calendar className='h-8 w-8 text-brand-primary' />
          </div>
          <h3 className='text-xl font-semibold'>{t('step1')}</h3>
          <p className='text-primary/70'>{t('step1Description')}</p>
        </div>
        <div className='flex flex-col items-center space-y-4 text-center'>
          <div className='rounded-full bg-brand-primary/30 p-4'>
            <TrendingUp className='h-8 w-8 text-brand-primary' />
          </div>
          <h3 className='text-xl font-semibold'>{t('step2')}</h3>
          <p className='text-primary/70'>{t('step2Description')}</p>
        </div>
        <div className='flex flex-col items-center space-y-4 text-center'>
          <div className='rounded-full bg-brand-primary/30 p-4'>
            <CheckCircle className='h-8 w-8 text-brand-primary' />
          </div>
          <h3 className='text-xl font-semibold'>{t('step3')}</h3>
          <p className='text-primary/70'>{t('step3Description')}</p>
        </div>
      </div>
    </section>
  );
};
