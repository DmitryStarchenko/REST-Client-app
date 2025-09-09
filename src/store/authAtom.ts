import { User } from '@supabase/supabase-js';
import { atom } from 'jotai';

// Holds the Supabase auth session (null if logged out)
export const authAtom = atom<User | null>(null);
