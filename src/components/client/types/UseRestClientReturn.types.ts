import { ApiResponse, Header, IVariable } from '@/types';

import { ActiveSection } from './ActiveSection.type';

export interface UseRestClientReturn {
  method: string;
  url: string;
  body: string;
  headers: Header[];
  response: ApiResponse | null;
  errorMessage: string | null;
  loading: boolean;
  activeSection: ActiveSection;
  direction: number;
  variables: IVariable[];
  variablesObj: Record<string, string>;

  setMethod: React.Dispatch<React.SetStateAction<string>>;
  setUrl: React.Dispatch<React.SetStateAction<string>>;
  setBody: React.Dispatch<React.SetStateAction<string>>;
  setHeaders: React.Dispatch<React.SetStateAction<Header[]>>;
  handleSubmit: () => Promise<void>;
  toggleSection: () => void;
  setActiveSection: React.Dispatch<React.SetStateAction<ActiveSection>>;
  setDirection: React.Dispatch<React.SetStateAction<number>>;
}
