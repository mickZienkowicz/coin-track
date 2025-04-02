import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const FortuneCard = async ({
  title,
  icon,
  value,
  description
}: {
  title: string;
  icon: React.ReactNode;
  value: string;
  description: string;
}) => (
  <Card className='gap-0'>
    <CardHeader className='pb-2'>
      <CardTitle className='flex items-center gap-3 text-lg'>
        {icon}
        <div className='flex flex-col'>
          <h4 className='text-2xl font-bold'>{title}</h4>
          <p className='text-sm font-normal text-primary/50'>{description}</p>
        </div>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className='text-2xl font-black text-primary/85 md:text-[25px]'>
        {value}
      </div>
    </CardContent>
  </Card>
);
