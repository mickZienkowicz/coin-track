import Image from 'next/image';
import { SignedIn, SignedOut, SignUpButton } from '@clerk/nextjs';
import { useLocale, useTranslations } from 'next-intl';

import { Button, buttonVariants } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { pathGenerators } from '@/lib/paths';
import { cn } from '@/lib/utils';

export const HeroSection = () => {
  const locale = useLocale();
  const t = useTranslations('landingPage.heroSection');

  return (
    <section className='space-y-6 text-center md:pt-8'>
      <div className='space-y-4'>
        <Image
          src='/logo-transparent-icon.svg'
          alt='Logo'
          width={100}
          height={100}
          className='mx-auto h-36 w-36'
        />
        <h1 className='text-4xl font-bold tracking-tight md:text-5xl'>
          {t('title')}
        </h1>
        <p className='mx-auto max-w-3xl text-base text-primary/70 md:text-lg'>
          {t('description')}
        </p>
      </div>
      <div className='flex flex-col justify-center gap-4 sm:flex-row'>
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
      <div className='relative mx-auto mt-10 aspect-[1/1.8] w-[300px] overflow-hidden rounded shadow-xl lg:aspect-[16/7.3] lg:w-full'>
        <Image
          src={`/app-mobile-${locale}.png`}
          alt={t('dashboard')}
          fill
          className='object-cover lg:hidden'
          priority
        />
        <Image
          src={`/app-desktop-${locale}.png`}
          alt={t('dashboard')}
          fill
          className='hidden object-cover lg:block'
          priority
        />
        <div className='absolute inset-0 bg-gradient-to-t from-background/80 to-transparent'></div>
      </div>
    </section>
  );
};
