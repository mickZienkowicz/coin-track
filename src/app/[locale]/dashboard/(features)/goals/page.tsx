import { Suspense } from 'react';

import { LoadingCard } from '../_components/loading-card/loading-card';

export default function GoalsPage() {
  return (
    <div className='@container'>
      <div className='@md:flex-row mr-14 flex flex-col items-center justify-between gap-4 lg:mr-0 2xl:mt-8'>
        <h1 className='flex min-h-11 w-full items-center text-start text-3xl font-semibold'>
          Goals
        </h1>
      </div>
      <Suspense fallback={<LoadingCard className='mt-6' />}>
        <p>fsdfsdf</p>
      </Suspense>
    </div>
  );
}
