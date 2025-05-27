'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { pathGenerators } from '@/lib/paths';
import { deleteFortuneAsset } from '@/server/fortune/actions/delete-fortune-asset';
import { updateFortuneAsset } from '@/server/fortune/actions/update-fortune-asset';
import { AssetWithAdditionalInfo } from '@/server/fortune/queries/get-forune-summary';
import { revalidatePathAction } from '@/server/revalidate/actions/revalidate-path';

export const DeleteAssetDialog = ({
  className,
  children,
  asset
}: {
  className?: string;
  children?: React.ReactNode;
  asset: AssetWithAdditionalInfo;
}) => {
  const t = useTranslations('fortune.assets.deleteAsset');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isTotalDeleteModalOpen, setIsTotalDeleteModalOpen] = useState(false);

  const { mutate: deleteAsset, isPending: isDeleting } = useMutation({
    mutationFn: deleteFortuneAsset,
    onError: () => {
      toast.error(t('error'));
    },
    onSuccess: ({ success, message }) => {
      if (!success) {
        toast.error(message);
        return;
      }

      setIsTotalDeleteModalOpen(false);
      toast.success(message);
      revalidatePathAction(pathGenerators.fortune());
    }
  });

  const { mutate: updateAsset, isPending: isUpdating } = useMutation({
    mutationFn: updateFortuneAsset,
    onError: () => {
      toast.error(t('error'));
    },
    onSuccess: ({ success, message }) => {
      if (!success) {
        toast.error(message);
        return;
      }

      setIsDeleteModalOpen(false);
      toast.success(message);
      revalidatePathAction(pathGenerators.fortune());
    }
  });

  return (
    <>
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogTrigger asChild>
          {children || (
            <Button
              className={className}
              variant='outline'
              size='sm'
              data-tour='delete-asset-dialog'
            >
              <Trash2 className='size-4' />
              <span className='hidden min-[350px]:inline'>{t('button')}</span>
              <span className='inline min-[350px]:hidden'>
                {t('buttonMobile')}
              </span>
            </Button>
          )}
        </DialogTrigger>
        <DialogContent data-tour='delete-asset-dialog-content'>
          <DialogHeader>
            <DialogTitle>{t('title')}</DialogTitle>
            <DialogDescription>
              {t('description')}
              <button
                className='font-bold underline'
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setIsTotalDeleteModalOpen(true);
                }}
              >
                {t('descriptionDeleteButton')}
              </button>
            </DialogDescription>
          </DialogHeader>
          <div className='flex flex-col gap-4'>
            <Button
              variant='destructive'
              className='w-full'
              onClick={() =>
                updateAsset({
                  assetId: asset.id,
                  data: {
                    name: asset.name,
                    description: asset.description,
                    category: asset.category,
                    valueCents: 0
                  }
                })
              }
              loading={isUpdating}
              disabled={isUpdating}
            >
              {t('deleteAssetButton')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={isTotalDeleteModalOpen}
        onOpenChange={setIsTotalDeleteModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('totalDeleteTitle')}</DialogTitle>
            <DialogDescription>{t('totalDeleteDescription')}</DialogDescription>
          </DialogHeader>
          <div className='flex flex-col gap-4'>
            <Button
              variant='destructive'
              className='w-full'
              onClick={() => deleteAsset({ assetId: asset.id })}
              loading={isDeleting}
              disabled={isDeleting}
            >
              {t('totalDeleteButton')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
