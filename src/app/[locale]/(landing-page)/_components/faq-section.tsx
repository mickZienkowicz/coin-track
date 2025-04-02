import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';

export const FAQSection = () => {
  return (
    <section className='space-y-10'>
      <div className='space-y-4 text-center'>
        <h2 className='text-3xl font-bold'>Często zadawane pytania</h2>
        <p className='mx-auto max-w-3xl text-muted-foreground'>
          Masz pytania? Sprawdź nasze odpowiedzi na najczęściej zadawane
          pytania.
        </p>
      </div>

      <Accordion type='single' collapsible className='mx-auto max-w-3xl'>
        <AccordionItem value='item-1'>
          <AccordionTrigger>Czy aplikacja jest bezpłatna?</AccordionTrigger>
          <AccordionContent>
            Tak, podstawowa wersja aplikacji jest całkowicie bezpłatna.
            Oferujemy również wersję premium z dodatkowymi funkcjami dla
            bardziej wymagających użytkowników.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-2'>
          <AccordionTrigger>
            Czy moje dane finansowe są bezpieczne?
          </AccordionTrigger>
          <AccordionContent>
            Bezpieczeństwo Twoich danych jest naszym priorytetem. Stosujemy
            najnowsze technologie szyfrowania i nie udostępniamy Twoich danych
            osobom trzecim bez Twojej zgody.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-3'>
          <AccordionTrigger>
            Czy mogę korzystać z aplikacji na różnych urządzeniach?
          </AccordionTrigger>
          <AccordionContent>
            Tak, nasza aplikacja jest dostępna na komputerach, tabletach i
            smartfonach. Twoje dane są synchronizowane między urządzeniami,
            dzięki czemu zawsze masz dostęp do aktualnych informacji.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-4'>
          <AccordionTrigger>
            Czy mogę importować dane z innych aplikacji?
          </AccordionTrigger>
          <AccordionContent>
            Tak, nasza aplikacja umożliwia import danych z popularnych formatów
            plików (CSV, Excel) oraz z wybranych aplikacji finansowych.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-5'>
          <AccordionTrigger>
            Czy aplikacja obsługuje różne waluty?
          </AccordionTrigger>
          <AccordionContent>
            Tak, nasza aplikacja obsługuje wiele walut i umożliwia śledzenie
            finansów w różnych walutach jednocześnie.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
};
