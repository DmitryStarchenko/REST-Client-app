import { Session } from '@supabase/supabase-js';
import { atom } from 'jotai';

export const authAtom = atom<Session | null>(null);
