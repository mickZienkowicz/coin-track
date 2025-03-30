'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import { useRouter } from '@/i18n/navigation';

export const ErrorMessageWidget = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  useEffect(() => {
    if (error) {
      const params = new URLSearchParams(searchParams);

      toast.error(decodeURIComponent(error));
      params.delete('error');
      router.replace(`${window.location.pathname}?${params.toString()}`);
    }
  }, [error, searchParams, router]);

  return <></>;
};
