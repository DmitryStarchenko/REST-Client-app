import { Header } from '@/types';

export function headersArrayToObject(headers: Header[]): Record<string, string> {
  return headers
    .filter((h) => h.key.trim() !== '' && h.value.trim() !== '')
    .reduce<Record<string, string>>((acc, h) => {
      acc[h.key] = h.value;
      return acc;
    }, {});
}
