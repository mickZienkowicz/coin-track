import { Calendar, CheckCircle, TrendingUp } from 'lucide-react';

export const HowItWorksSection = () => {
  return (
    <section className='space-y-10'>
      <div className='space-y-4 text-center'>
        <h2 className='text-3xl font-bold'>Jak to działa?</h2>
        <p className='mx-auto max-w-3xl text-muted-foreground'>
          Zarządzanie finansami nigdy nie było prostsze. Nasza aplikacja
          prowadzi Cię przez cały proces.
        </p>
      </div>

      <div className='grid grid-cols-1 gap-10 md:grid-cols-3'>
        <div className='flex flex-col items-center space-y-4 text-center'>
          <div className='rounded-full bg-primary/10 p-4'>
            <Calendar className='h-8 w-8 text-primary' />
          </div>
          <h3 className='text-xl font-semibold'>Krok 1: Utwórz budżet</h3>
          <p className='text-muted-foreground'>
            Zacznij od utworzenia budżetu, określając okres i dodając swoje
            przychody oraz planowane wydatki.
          </p>
        </div>
        <div className='flex flex-col items-center space-y-4 text-center'>
          <div className='rounded-full bg-primary/10 p-4'>
            <TrendingUp className='h-8 w-8 text-primary' />
          </div>
          <h3 className='text-xl font-semibold'>Krok 2: Śledź swoje finanse</h3>
          <p className='text-muted-foreground'>
            Regularnie dodawaj swoje wydatki i przychody, aby mieć aktualny
            obraz swoich finansów.
          </p>
        </div>
        <div className='flex flex-col items-center space-y-4 text-center'>
          <div className='rounded-full bg-primary/10 p-4'>
            <CheckCircle className='h-8 w-8 text-primary' />
          </div>
          <h3 className='text-xl font-semibold'>Krok 3: Osiągaj cele</h3>
          <p className='text-muted-foreground'>
            Ustal cele finansowe i systematycznie odkładaj pieniądze, aby je
            osiągnąć w zaplanowanym terminie.
          </p>
        </div>
      </div>
    </section>
  );
};
