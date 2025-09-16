export interface RequestFormProps {
  method: string;
  setMethod: (method: string) => void;
  url: string;
  setUrl: (url: string) => void;
  sendRequest: () => void;
  loading: boolean;
}
