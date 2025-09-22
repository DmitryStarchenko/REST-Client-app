import { Header } from './header.types';

export interface HeadersBlockProps {
  headers: Header[];
  setHeaders: (headers: Header[]) => void;
}
