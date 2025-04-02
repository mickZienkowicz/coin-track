import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

export const CTASection = () => {
  return (
    <section className='space-y-6 rounded-2xl bg-primary/10 p-10 text-center'>
      <h2 className='text-3xl font-bold'>
        Gotowy, by przejąć kontrolę nad swoimi finansami?
      </h2>
      <p className='mx-auto max-w-3xl text-muted-foreground'>
        Dołącz do tysięcy użytkowników, którzy już korzystają z naszej aplikacji
        i osiągają swoje cele finansowe.
      </p>
      <div className='flex flex-col justify-center gap-4 sm:flex-row'>
        <Button className='gap-2'>
          Rozpocznij za darmo <ArrowRight className='h-4 w-4' />
        </Button>
        <Button variant='outline'>Dowiedz się więcej</Button>
      </div>
    </section>
  );
};
