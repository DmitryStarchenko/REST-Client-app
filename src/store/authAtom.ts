import { User } from '@supabase/supabase-js';
import { atom } from 'jotai';

export const authAtom = atom<User | null>(null);
