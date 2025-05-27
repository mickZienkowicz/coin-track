import { SignedIn, SignedOut, SignUpButton } from '@clerk/nextjs';
import { useTranslations } from 'next-intl';

import { Button, buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from '@/i18n/navigation';
import { pathGenerators } from '@/lib/paths';
import { cn } from '@/lib/utils';

export const CTASection = () => {
  const t = useTranslations('landingPage.ctaSection');

  return (
    <Card className='flex flex-col items-center justify-center gap-4'>
      <h2 className='mt-4 max-w-xl text-center text-3xl font-bold'>
        {t('title')}
      </h2>
      <p className='mx-auto max-w-3xl text-primary/70'>{t('description')}</p>
      <div className='mb-2 flex flex-col justify-center gap-4 sm:flex-row'>
        <SignedIn>
          <Link
            className={cn(buttonVariants(), 'text-base font-bold')}
            href={pathGenerators.dashboard()}
          >
            {t('dashboard')}
          </Link>
        </SignedIn>
        <SignedOut>
          <SignUpButton>
            <Button className='text-base font-bold'>{t('signUp')}</Button>
          </SignUpButton>
        </SignedOut>
      </div>
    </Card>
  );
};
