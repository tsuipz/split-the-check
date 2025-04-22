import { Category } from '../interfaces/category.interface';
import { CategoryType } from '../types';

export const CATEGORIES: Category[] = [
  {
    name: 'General',
    icon: 'receipt',
  },
  {
    name: 'Dining Out',
    icon: 'restaurant',
  },
  {
    name: 'Groceries',
    icon: 'shopping_cart',
  },
];

export const CATEGORY_MAP = CATEGORIES.reduce(
  (acc, category) => {
    acc[category.name] = category;
    return acc;
  },
  {
    Repayment: {
      name: 'Repayment',
      icon: 'payments',
    },
  } as Record<CategoryType, Category>,
);
