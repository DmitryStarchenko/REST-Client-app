import { languageMap } from '@/constants';

export interface BodyEditorProps {
  bodyText: string;
  onBodyTextChange: (text: string) => void;
  bodyType: keyof typeof languageMap;
}
