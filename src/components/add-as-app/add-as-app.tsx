import { Suspense } from 'react';
import { Video } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { Skeleton } from '../ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

const VideoComponent = ({ src }: { src: string }) => {
  const t = useTranslations('landingPage.addAsApp');

  return (
    <Suspense
      fallback={
        <Skeleton className='relative h-[640px] w-[288px] rounded-xl md:h-[700px] md:w-[320px]'>
          <Video className='absolute left-1/2 top-1/2 z-10 size-10 -translate-x-1/2 -translate-y-1/2 text-gray-400' />
        </Skeleton>
      }
    >
      <video
        width='320'
        height='690'
        controls
        preload='none'
        className='h-[640px] w-[288px] rounded-xl object-cover md:h-[700px] md:w-[320px]'
        autoPlay
        muted
        loop
      >
        <source src={src} type='video/mp4' />
        {t('videoNotSupported')}
      </video>
    </Suspense>
  );
};

export const AddAsApp = () => {
  const t = useTranslations('landingPage.addAsApp');
  const locale = useLocale();

  return (
    <section className='space-y-10' id='add-as-app'>
      <div className='space-y-4 text-center'>
        <h2 className='text-3xl font-bold'>{t('title')}</h2>
        <p className='mx-auto max-w-2xl text-primary/70'>{t('description')}</p>
      </div>

      <div className='grid grid-cols-1 gap-10 lg:hidden'>
        <Tabs defaultValue='add-as-app' className='w-full'>
          <TabsList className='mx-auto w-full max-w-[500px] justify-center'>
            <TabsTrigger value='add-as-app'>{t('iphone')}</TabsTrigger>
            <TabsTrigger value='add-as-extension'>{t('android')}</TabsTrigger>
          </TabsList>
          <TabsContent
            value='add-as-app'
            className='mt-8 flex min-h-[640px] w-full items-center justify-center rounded-xl md:min-h-[700px]'
          >
            <VideoComponent src='/add-as-app-iphone.mp4' />
          </TabsContent>
          <TabsContent
            value='add-as-extension'
            className='mt-8 flex min-h-[640px] w-full items-center justify-center rounded-xl md:min-h-[700px]'
          >
            <VideoComponent src='/add-as-app-android.mp4' />
          </TabsContent>
        </Tabs>
      </div>
      <div className='hidden justify-center gap-24 lg:flex'>
        <div className='flex flex-col gap-4'>
          <h3 className='text-center text-xl font-semibold'>{t('iphone')}</h3>
          <VideoComponent src={`/add-as-app-iphone-${locale}.mp4`} />
        </div>
        <div className='flex flex-col gap-4'>
          <h3 className='text-center text-xl font-semibold'>{t('android')}</h3>
          <VideoComponent src={`/add-as-app-android-${locale}.mp4`} />
        </div>
      </div>
    </section>
  );
};
