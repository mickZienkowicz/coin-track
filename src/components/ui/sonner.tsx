'use client';

import { Toaster as Sonner, ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme='dark'
      className='toaster group'
      style={
        {
          '--normal-bg': 'hsl(240 5.9% 10%)',
          '--normal-text': 'white',
          '--normal-border': 'hsl(0 0% 14.9%)'
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
