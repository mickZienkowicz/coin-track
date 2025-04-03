import { CircleHelp } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { getOutcomesCategories } from '@/lib/categories';

export const CategoryBadge = ({ category }: { category: string }) => {
  const outcomeCategoriesT = useTranslations('categories');
  const categoryItem = getOutcomesCategories(outcomeCategoriesT).find(
    (item) => item.value === category
  ) || {
    name: outcomeCategoriesT('other'),
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
