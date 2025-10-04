import { languageMap } from '@/constants';

export interface BodyTypeSelectorProps {
  bodyType: keyof typeof languageMap;
  jsonError: string | null;
  onBodyTypeChange: (type: keyof typeof languageMap) => void;
}
