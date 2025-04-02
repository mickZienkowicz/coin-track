import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

export const HeroSection = () => {
  return (
    <section className='space-y-6 pt-10 text-center'>
      <div className='space-y-4'>
        <Image
          src='/logo-transparent-icon.svg'
          alt='Logo'
          width={100}
          height={100}
          className='mx-auto h-36 w-36'
        />
        <h1 className='text-4xl font-bold tracking-tight md:text-6xl'>
          Zarządzaj swoimi finansami{' '}
          <span className='text-primary'>mądrze</span>
        </h1>
        <p className='mx-auto max-w-3xl text-xl text-muted-foreground'>
          Kompleksowe narzędzie do kontrolowania budżetu, śledzenia majątku i
          osiągania celów finansowych
        </p>
      </div>
      <div className='flex flex-col justify-center gap-4 sm:flex-row'>
        <Button className='gap-2'>
          Rozpocznij za darmo <ArrowRight className='h-4 w-4' />
        </Button>
        <Button variant='outline'>Zobacz demo</Button>
      </div>
      <div className='relative mx-auto mt-10 h-[400px] w-full max-w-5xl overflow-hidden rounded-xl shadow-xl'>
        <Image
          src='/placeholder.svg?height=800&width=1600'
          alt='Dashboard aplikacji'
          fill
          className='object-cover'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-background/80 to-transparent'></div>
      </div>
    </section>
  );
};
