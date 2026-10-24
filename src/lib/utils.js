import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** 合併 className：clsx 處理條件式，tailwind-merge 讓後面的 class 覆蓋前面的衝突 class。 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
