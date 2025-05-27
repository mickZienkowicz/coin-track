import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton
} from '@clerk/nextjs';
import { useTranslations } from 'next-intl';

import { AppFooter } from '@/components/app-footer/app-footer';
import { Button, buttonVariants } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { pathGenerators } from '@/lib/paths';
import { cn } from '@/lib/utils';

import { BenefitsSection } from './_components/benefits-section';
import { CTASection } from './_components/cta-section';
import { FeaturesSection } from './_components/features-section';
import { HeroSection } from './_components/hero-section';
import { HowItWorksSection } from './_components/how-it-works-section';

export default function Home() {
  const t = useTranslations('landingPage');

  return (
    <div className='min-h-screen w-full max-w-screen-2xl font-[family-name:var(--font-geist-sans)]'>
      <header className='mx-auto mb-2 flex max-w-6xl items-center justify-end gap-4 p-4 md:mb-8'>
        <SignedIn>
          <Link
            className={cn(buttonVariants(), 'text-base font-bold')}
            href={pathGenerators.dashboard()}
          >
            {t('dashboard')}
          </Link>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton>
            <Button variant='outline'>{t('signIn')}</Button>
          </SignInButton>
          <SignUpButton>
            <Button>{t('signUp')}</Button>
          </SignUpButton>
        </SignedOut>
      </header>
      <main className='row-start-2 mx-auto flex max-w-6xl flex-col items-center gap-[32px] p-4 sm:items-start md:mt-8'>
        <div className='flex flex-col gap-28 pb-20 md:gap-44 md:pb-40'>
          <HeroSection />
          <FeaturesSection />
          <HowItWorksSection />
          <CTASection />
          <BenefitsSection />
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
