import { Header } from './header.types';

export interface TopTabsBlockProps {
  headers: Header[];
  setHeaders: (headers: Header[]) => void;
  bodyText: string;
  setBodyText: (bodyText: string) => void;
  method: string;
  url: string;
}
