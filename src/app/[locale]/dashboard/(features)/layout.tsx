import { FeaturesTabs } from './_components/features-tabs';

export default function FeaturesLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <FeaturesTabs className='mb-6 hidden 2xl:block' />
      <main className='w-full'>
        <div className='w-full'>{children}</div>
      </main>
    </>
  );
}
