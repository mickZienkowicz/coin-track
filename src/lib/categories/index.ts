import {
  Banknote,
  Bolt,
  Bus,
  Car,
  CircleHelp,
  CreditCard,
  FileText,
  Gift,
  GraduationCap,
  Handshake,
  Heart,
  Home,
  Monitor,
  PiggyBank,
  Plane,
  Shirt,
  ShoppingCart,
  Target,
  TrendingUp,
  Truck,
  Utensils
} from 'lucide-react';
import { useTranslations } from 'next-intl';

export const getPouchCategories = (t: ReturnType<typeof useTranslations>) => [
  { value: 'food', name: t('food'), icon: Utensils, color: '#FFB5A7' },
  { value: 'clothing', name: t('clothing'), icon: Shirt, color: '#FFDAC1' },
  { value: 'health', name: t('health'), icon: Heart, color: '#D4A5A5' },
  { value: 'travel', name: t('travel'), icon: Plane, color: '#A8E6CE' },
  {
    value: 'education',
    name: t('education'),
    icon: GraduationCap,
    color: '#D5AAFF'
  },
  { value: 'transport', name: t('transport'), icon: Bus, color: '#F4D35E' },
  { value: 'bills', name: t('bills'), icon: Bolt, color: '#FFDD67' },
  { value: 'home', name: t('home'), icon: Home, color: '#E4C1F9' },
  { value: 'car', name: t('car'), icon: Car, color: '#C8E6C9' },
  { value: 'loans', name: t('loans'), icon: CreditCard, color: '#FFC8DD' },
  { value: 'leasing', name: t('leasing'), icon: Truck, color: '#FFB5A7' },
  { value: 'credit', name: t('credit'), icon: Handshake, color: '#FFDAC1' },
  { value: 'gifts', name: t('gifts'), icon: Gift, color: '#FFC8DD' },
  { value: 'work', name: t('work'), icon: ShoppingCart, color: '#C8E6C9' },
  { value: 'other', name: t('other'), icon: CircleHelp, color: '#FFFFFF' }
];

export const getIncomesCategories = (t: ReturnType<typeof useTranslations>) => [
  { value: 'wages', name: t('wages'), icon: Banknote, color: '#C8E6C9' },
  { value: 'sales', name: t('sales'), icon: ShoppingCart, color: '#E4C1F9' },
  { value: 'rent', name: t('rent'), icon: Home, color: '#B5EAD7' },
  { value: 'bonus', name: t('bonus'), icon: Gift, color: '#F4D35E' },
  {
    value: 'taxReturn',
    name: t('taxReturn'),
    icon: FileText,
    color: '#D4A5A5'
  },
  {
    value: 'investments',
    name: t('investments'),
    icon: TrendingUp,
    color: '#A8DADC'
  },
  { value: 'other', name: t('other'), icon: CircleHelp, color: '#FFFFFF' }
];

export const getOutcomesCategories = (
  t: ReturnType<typeof useTranslations>
) => [
  { value: 'bills', name: t('bills'), icon: Bolt, color: '#FFDD67' },
  { value: 'home', name: t('home'), icon: Home, color: '#E4C1F9' },
  { value: 'car', name: t('car'), icon: Car, color: '#C8E6C9' },
  { value: 'loans', name: t('loans'), icon: CreditCard, color: '#FFC8DD' },
  { value: 'leasing', name: t('leasing'), icon: Truck, color: '#FFB5A7' },
  { value: 'credit', name: t('credit'), icon: Handshake, color: '#FFDAC1' },
  { value: 'food', name: t('food'), icon: Utensils, color: '#FFB5A7' },
  { value: 'clothing', name: t('clothing'), icon: Shirt, color: '#FFDAC1' },
  { value: 'health', name: t('health'), icon: Heart, color: '#D4A5A5' },
  { value: 'travel', name: t('travel'), icon: Plane, color: '#A8E6CE' },
  {
    value: 'education',
    name: t('education'),
    icon: GraduationCap,
    color: '#D5AAFF'
  },
  {
    value: 'technology',
    name: t('technology'),
    icon: Monitor,
    color: '#B5EAD7'
  },
  { value: 'goals', name: t('goals'), icon: Target, color: '#FFDD67' },
  { value: 'transport', name: t('transport'), icon: Bus, color: '#F4D35E' },
  { value: 'savings', name: t('savings'), icon: PiggyBank, color: '#FFDD67' },
  { value: 'other', name: t('other'), icon: CircleHelp, color: '#FFFFFF' }
];
