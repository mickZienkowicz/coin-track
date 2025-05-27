import {
  BarChart3,
  Package,
  PieChart,
  Shield,
  Target,
  Wallet
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

const FeatureCard = ({
  icon,
  title,
  description
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <Card className='gap-3'>
      <CardHeader>
        <div className='mb-4 flex justify-center'>{icon}</div>
        <CardTitle className='text-center text-lg font-bold'>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className='text-center text-base text-primary/70'>
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export const FeaturesSection = () => {
  const t = useTranslations('landingPage.featuresSection');

  return (
    <section className='space-y-10'>
      <div className='space-y-4 text-center'>
        <h2 className='text-3xl font-bold'>{t('title')}</h2>
        <p className='mx-auto max-w-3xl text-primary/70'>{t('description')}</p>
      </div>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        <FeatureCard
          icon={<BarChart3 className='h-10 w-10 text-brand-primary' />}
          title={t('feature1.title')}
          description={t('feature1.description')}
        />
        <FeatureCard
          icon={<Wallet className='h-10 w-10 text-brand-primary' />}
          title={t('feature2.title')}
          description={t('feature2.description')}
        />
        <FeatureCard
          icon={<Target className='h-10 w-10 text-brand-primary' />}
          title={t('feature3.title')}
          description={t('feature3.description')}
        />
        <FeatureCard
          icon={<PieChart className='h-10 w-10 text-brand-primary' />}
          title={t('feature4.title')}
          description={t('feature4.description')}
        />
        <FeatureCard
          icon={<Package className='h-10 w-10 text-brand-primary' />}
          title={t('feature5.title')}
          description={t('feature5.description')}
        />
        <FeatureCard
          icon={<Shield className='h-10 w-10 text-brand-primary' />}
          title={t('feature6.title')}
          description={t('feature6.description')}
        />
      </div>
    </section>
  );
};
