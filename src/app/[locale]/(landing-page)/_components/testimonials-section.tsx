import Image from 'next/image';

import { Card, CardContent } from '@/components/ui/card';

const TestimonialCard = ({
  name,
  occupation,
  testimonial
}: {
  name: string;
  occupation: string;
  testimonial: string;
}) => {
  return (
    <Card className='bg-muted/50'>
      <CardContent className='pt-6'>
        <div className='mb-4 flex items-center gap-4'>
          <div className='relative h-12 w-12 overflow-hidden rounded-full'>
            <Image
              src='/placeholder.svg?height=100&width=100'
              alt='Avatar użytkownika'
              fill
              className='object-cover'
            />
          </div>
          <div>
            <h3 className='font-semibold'>{name}</h3>
            <p className='text-sm text-muted-foreground'>{occupation}</p>
          </div>
        </div>
        <p className='italic'>{testimonial}</p>
      </CardContent>
    </Card>
  );
};

export const TestimonialsSection = () => {
  return (
    <section className='space-y-10'>
      <div className='space-y-4 text-center'>
        <h2 className='text-3xl font-bold'>Co mówią nasi użytkownicy</h2>
        <p className='mx-auto max-w-3xl text-muted-foreground'>
          Tysiące osób korzysta z naszej aplikacji do zarządzania swoimi
          finansami. Oto, co o niej mówią.
        </p>
      </div>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
        <TestimonialCard
          name='Anna Kowalska'
          occupation='Freelancer'
          testimonial='Dzięki tej aplikacji w końcu mam pełną kontrolę nad swoimi finansami. System sakiewek pomógł mi efektywnie zarządzać pieniędzmi i osiągnąć cel, jakim był zakup nowego samochodu.'
        />
        <TestimonialCard
          name='Jan Nowak'
          occupation='Programista'
          testimonial='Aplikacja pomogła mi zbudować żelazną rezerwę finansową, dzięki czemu czuję się bezpieczniej. Analiza wydatków pokazała mi, gdzie mogę zaoszczędzić, co pozwoliło mi zwiększyć miesięczne oszczędności.'
        />
        <TestimonialCard
          name='Marta Wiśniewska'
          occupation='Nauczycielka'
          testimonial='Korzystam z aplikacji razem z mężem, dzięki czemu możemy wspólnie zarządzać domowym budżetem. Funkcja celów finansowych pomogła nam zaoszczędzić na wakacje marzeń.'
        />
      </div>
    </section>
  );
};
