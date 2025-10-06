export interface LangSelectProps {
  langs: string[];
  selectedLang: string;
  onSelect: (lang: string) => void;
}
