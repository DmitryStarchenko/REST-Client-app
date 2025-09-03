import { atom } from 'jotai';

export const requestAtom = atom({
  url: '',
  method: 'GET',
  headers: {},
  body: null,
});
