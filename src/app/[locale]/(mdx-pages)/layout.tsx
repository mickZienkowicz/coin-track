import Image from 'next/image';

import { Link } from '@/i18n/navigation';
import { pathGenerators } from '@/lib/paths';
import { cn } from '@/lib/utils';

export default function MdxLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className='items-cente flex flex-col'>
      <header className='space-y-6 pt-10 text-center'>
        <div className='space-y-4'>
          <Link href={pathGenerators.home()}>
            <Image
              src='/logo-transparent-icon.svg'
              alt='Logo'
              width={100}
              height={100}
              className='mx-auto h-36 w-36'
            />
          </Link>
        </div>
      </header>
      <div
        className={cn(
          'prose',
          'prose-headings:mt-8 prose-headings:font-semibold prose-headings:text-white',
          'prose-h1:text-5xl',
          'prose-h2:text-4xl',
          'prose-h3:text-2xl',
          'prose-h4:text-xl',
          'prose-h5:text-lg',
          'prose-h6:text-base',
          'prose-p:my-3 prose-p:text-white prose-li:text-white'
        )}
      >
        {children}
      </div>
    </main>
  );
}
