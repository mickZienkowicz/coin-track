import { CircleHelp } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { getIncomesCategories } from '@/lib/categories';

export const CategoryBadge = ({ category }: { category: string }) => {
  const incomeCategoriesT = useTranslations('categories.incomes');
  const categoryItem = getIncomesCategories(incomeCategoriesT).find(
    (item) => item.name === category
  ) || {
    name: incomeCategoriesT('other'),
    icon: CircleHelp,
    color: '#FFFFFF'
  };

  return (
    <Badge
      className='rounded-md px-2'
      style={{ backgroundColor: categoryItem?.color || '' }}
    >
      <categoryItem.icon className='size-4!' />
      {category}
    </Badge>
  );
};
