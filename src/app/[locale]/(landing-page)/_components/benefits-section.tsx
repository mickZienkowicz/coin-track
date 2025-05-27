import { CheckCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

const BenefitItem = ({
  title,
  description
}: {
  title: string;
  description: string;
}) => (
  <div className='flex gap-4'>
    <div className='h-fit rounded-full bg-brand-primary/30 p-2'>
      <CheckCircle className='h-5 w-5 text-brand-primary' />
    </div>
    <div>
      <h3 className='text-xl font-semibold'>{title}</h3>
      <p className='mt-2 text-primary/70'>{description}</p>
    </div>
  </div>
);

export const BenefitsSection = () => {
  const t = useTranslations('landingPage.benefitsSection');

  return (
    <section className='space-y-10'>
      <div className='space-y-4 text-center'>
        <h2 className='text-3xl font-bold'>{t('title')}</h2>
        <p className='mx-auto max-w-2xl text-primary/70'>{t('description')}</p>
      </div>

      <div className='grid grid-cols-1 gap-10 md:grid-cols-2'>
        <BenefitItem
          title={t('benefit1.title')}
          description={t('benefit1.description')}
        />
        <BenefitItem
          title={t('benefit2.title')}
          description={t('benefit2.description')}
        />
        <BenefitItem
          title={t('benefit3.title')}
          description={t('benefit3.description')}
        />
        <BenefitItem
          title={t('benefit4.title')}
          description={t('benefit4.description')}
        />
      </div>
    </section>
  );
};
