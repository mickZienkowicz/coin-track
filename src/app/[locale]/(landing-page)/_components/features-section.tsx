import {
  BarChart3,
  Package,
  PieChart,
  Shield,
  Target,
  Wallet
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

const FeatureCard = ({
  icon,
  title,
  description
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <Card className='border-none shadow-md transition-shadow hover:shadow-lg'>
      <CardHeader>
        <div className='mb-4 flex justify-center'>{icon}</div>
        <CardTitle className='text-center'>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className='text-center'>{description}</CardDescription>
      </CardContent>
    </Card>
  );
};

export const FeaturesSection = () => {
  return (
    <section className='space-y-10'>
      <div className='space-y-4 text-center'>
        <h2 className='text-3xl font-bold'>
          Wszystko, czego potrzebujesz do zarządzania finansami
        </h2>
        <p className='mx-auto max-w-3xl text-muted-foreground'>
          Nasza aplikacja oferuje kompleksowy zestaw narzędzi, które pomogą Ci
          kontrolować finanse, planować wydatki i osiągać cele finansowe.
        </p>
      </div>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        <FeatureCard
          icon={<BarChart3 className='h-10 w-10 text-primary' />}
          title='Budżetowanie'
          description='Twórz i zarządzaj budżetami, śledź wydatki i przychody, aby zawsze mieć kontrolę nad swoimi finansami.'
        />
        <FeatureCard
          icon={<Wallet className='h-10 w-10 text-primary' />}
          title='Zarządzanie majątkiem'
          description='Monitoruj wartość swojego majątku i śledź zmiany towojej wartości netto w czasie.'
        />
        <FeatureCard
          icon={<Target className='h-10 w-10 text-primary' />}
          title='Cele finansowe'
          description='Ustal cele finansowe, monitoruj postępy i otrzymuj powiadomienia o zbliżających się terminach.'
        />
        <FeatureCard
          icon={<PieChart className='h-10 w-10 text-primary' />}
          title='Analiza finansowa'
          description='Analizuj swoje wydatki, przychody i zobowiązania, aby podejmować lepsze decyzje finansowe.'
        />
        <FeatureCard
          icon={<Package className='h-10 w-10 text-primary' />}
          title='System sakiewek'
          description='Korzystaj z systemu sakiewek (kopert) do efektywnego zarządzania pieniędzmi przeznaczonymi na konkretne cele.'
        />
        <FeatureCard
          icon={<Shield className='h-10 w-10 text-primary' />}
          title='Żelazna rezerwa'
          description='Buduj i monitoruj swoją żelazną rezerwę finansową, aby być przygotowanym na nieprzewidziane wydatki.'
        />
      </div>
    </section>
  );
};
