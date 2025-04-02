import { CheckCircle } from 'lucide-react';

const BenefitItem = ({
  title,
  description
}: {
  title: string;
  description: string;
}) => (
  <div className='flex gap-4'>
    <div className='h-fit rounded-full bg-primary/10 p-2'>
      <CheckCircle className='h-5 w-5 text-primary' />
    </div>
    <div>
      <h3 className='text-xl font-semibold'>{title}</h3>
      <p className='mt-2 text-muted-foreground'>{description}</p>
    </div>
  </div>
);

export const BenefitsSection = () => {
  return (
    <section className='space-y-10'>
      <div className='space-y-4 text-center'>
        <h2 className='text-3xl font-bold'>
          Korzyści z korzystania z aplikacji
        </h2>
        <p className='mx-auto max-w-3xl text-muted-foreground'>
          Nasza aplikacja pomaga tysiącom użytkowników lepiej zarządzać swoimi
          finansami i osiągać cele finansowe.
        </p>
      </div>

      <div className='grid grid-cols-1 gap-10 md:grid-cols-2'>
        <BenefitItem
          title='Redukcja stresu finansowego'
          description='Planowanie i kontrola finansów zmniejsza stres związany z niepewnością finansową.'
        />
        <BenefitItem
          title='Pełna kontrola nad finansami'
          description='Zawsze wiesz, na co wydajesz pieniądze i ile możesz jeszcze wydać w danym okresie.'
        />
        <BenefitItem
          title='Osiąganie celów finansowych'
          description='Systematyczne oszczędzanie i monitorowanie postępów pomaga w osiąganiu celów finansowych.'
        />
        <BenefitItem
          title='Lepsze decyzje finansowe'
          description='Analiza wydatków i przychodów pomaga podejmować lepsze decyzje finansowe.'
        />
      </div>
    </section>
  );
};
