import { Header } from './header.types';

export interface BuildRestPathInput {
  method: string;
  url: string;
  body?: string;
  headers: Header[];
}

export interface ParseRestPathResult {
  path: string;
  method: string;
  urlB64: string;
  bodyB64: string | undefined;
  query: string;
}
