import { Header } from '../../../types/header.types';

export interface HeadersBlockProps {
  headers: Header[];
  setHeaders: (headers: Header[]) => void;
}
