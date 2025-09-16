import { Header } from './header.types';

export interface RequestBuilderFormProps {
  method: string;
  url: string;
  headers: Header[];
  body?: string;
  loading?: boolean;
  onChange: (data: { method: string; url: string; headers: Header[]; body?: string }) => void;
  onSubmit: (data: {
    method: string;
    url: string;
    headers: Header[];
    body?: string;
  }) => Promise<void>;
}
