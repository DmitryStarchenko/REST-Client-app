import { Header } from './header.types';

export interface RequestBuilderFormProps {
  method: string;
  setMethod: (m: string) => void;
  url: string;
  setUrl: (u: string) => void;
  headers: Header[];
  setHeaders: (h: Header[]) => void;
  body?: string;
  setBody: (b: string) => void;
  onSubmit: () => void;
  loading: boolean;
}
