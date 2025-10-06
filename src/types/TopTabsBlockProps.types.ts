import { Header } from './header.types';
import { IVariable } from './variables.types';

export interface TopTabsBlockProps {
  headers: Header[];
  setHeaders: (headers: Header[]) => void;
  bodyText: string;
  setBodyText: (bodyText: string) => void;
  method: string;
  url: string;
  variables: IVariable[];
  variablesObj: Record<string, string>;
}
