import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import { ApiResponse, Header } from '@/types';

export const urlAtom = atomWithStorage<string>('url', '');
export const methodAtom = atomWithStorage<string>('method', 'GET');
export const bodyAtom = atomWithStorage<string>('body', '');
export const headersAtom = atom<Header[]>([]);
export const errorAtom = atom<string | null>(null);

export const responseAtom = atom<ApiResponse | null>(null);
