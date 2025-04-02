import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton
} from '@clerk/nextjs';

import { Button, buttonVariants } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { pathGenerators } from '@/lib/paths';

import { BenefitsSection } from './_components/benefits-section';
import { CTASection } from './_components/cta-section';
import { FAQSection } from './_components/faq-section';
import { FeaturesSection } from './_components/features-section';
import { HeroSection } from './_components/hero-section';
import { HowItWorksSection } from './_components/how-it-works-section';
import { TestimonialsSection } from './_components/testimonials-section';

export default function Home() {
  return (
    <div className='min-h-screen w-full max-w-screen-2xl font-[family-name:var(--font-geist-sans)]'>
      <header className='mb-8 flex items-center justify-end gap-4 p-4'>
        <SignedIn>
          <Link className={buttonVariants()} href={pathGenerators.dashboard()}>
            Dashboard
          </Link>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton>
            <Button variant='outline'>Zaloguj się</Button>
          </SignInButton>
          <SignUpButton>
            <Button>Zarejestruj się</Button>
          </SignUpButton>
        </SignedOut>
      </header>
      <main className='row-start-2 mt-8 flex flex-col items-center gap-[32px] sm:items-start'>
        <div className='flex flex-col gap-44 pb-20'>
          <HeroSection />
          <FeaturesSection />
          <HowItWorksSection />
          <BenefitsSection />
          <TestimonialsSection />
          <FAQSection />
          <CTASection />
        </div>
      </main>
      <footer className='row-start-3 flex flex-wrap items-center justify-center gap-[24px]'></footer>
    </div>
  );
}
