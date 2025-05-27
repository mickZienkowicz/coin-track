'use client';

import { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';

import { AddAssetForm } from '../add-asset-form/add-asset-form';

export const AddAssetDialog = ({
  className,
  children
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  const t = useTranslations('fortune.assets.addAsset');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button
            className={className}
            variant='outline'
            data-tour='add-asset-dialog'
          >
            <TrendingUp className='size-4 text-green-600' />
            <span className='hidden min-[350px]:inline'>{t('button')}</span>
            <span className='inline min-[350px]:hidden'>
              {t('buttonMobile')}
            </span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent data-tour='add-asset-form'>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <AddAssetForm closeDialog={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};
