import { METHODS } from '@/constants';

export function isValidMethod(value: string): value is (typeof METHODS)[number] {
  return METHODS.includes(value as (typeof METHODS)[number]);
}
