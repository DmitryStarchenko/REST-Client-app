export interface UseBodyBlockReturn {
  bodyType: string;
  jsonError: string | null;
  isJson: boolean;
  canPrettify: boolean | '';
  setBodyType: (text: string) => void;
  handleCopyBase64: () => void;
  handlePrettifyJson: () => void;
}

export interface UseBodyBlockProps {
  bodyText: string;
  setBodyText: (value: string) => void;
}
