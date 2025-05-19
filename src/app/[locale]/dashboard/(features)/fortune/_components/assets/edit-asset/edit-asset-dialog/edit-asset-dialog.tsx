'use client';

import { useState } from 'react';
import { Pencil } from 'lucide-react';
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
import { AssetWithAdditionalInfo } from '@/server/fortune/queries/get-forune-summary';

import { EditAssetForm } from '../edit-asset-form/edit-asset-form';

export const EditAssetDialog = ({
  className,
  children,
  asset
}: {
  className?: string;
  children?: React.ReactNode;
  asset: AssetWithAdditionalInfo;
}) => {
  const t = useTranslations('fortune.assets.editAsset');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button
            className={className}
            variant='outline'
            size='sm'
            data-tour='edit-asset-dialog'
          >
            <Pencil className='size-4 ' />
            <span className='hidden min-[350px]:inline'>{t('button')}</span>
            <span className='inline min-[350px]:hidden'>
              {t('buttonMobile')}
            </span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent data-tour='edit-asset-dialog-content'>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <EditAssetForm closeDialog={() => setIsOpen(false)} asset={asset} />
        {/* <AddIncomeForm closeDialog={() => setIsOpen(false)} /> */}
      </DialogContent>
    </Dialog>
  );
};
