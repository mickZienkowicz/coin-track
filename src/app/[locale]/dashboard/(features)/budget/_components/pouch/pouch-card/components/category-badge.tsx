import { CircleHelp } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { getPouchCategories } from '@/lib/categories';

export const CategoryBadge = ({ category }: { category: string }) => {
  const pouchCategoriesT = useTranslations('categories.pouch');
  const categoryItem = getPouchCategories(pouchCategoriesT).find(
    (item) => item.value === category
  ) || {
    name: pouchCategoriesT('other'),
    icon: CircleHelp,
    color: '#FFFFFF'
  };

  return (
    <Badge
      className='rounded-md px-2'
      style={{ backgroundColor: categoryItem?.color || '' }}
    >
      <categoryItem.icon className='size-4!' />
      {categoryItem.name}
    </Badge>
  );
};
