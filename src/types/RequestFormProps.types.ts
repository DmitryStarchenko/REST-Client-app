import { HttpMethod } from './methods.types';
import { IVariable } from './variables.types';

export interface RequestFormProps {
  method: string;
  setMethod: (method: HttpMethod) => void;
  url: string;
  setUrl: (url: string) => void;
  sendRequest: () => void;
  variables: IVariable[];
  variablesObj: Record<string, string>;
  loading: boolean;
}
