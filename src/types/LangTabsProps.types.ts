export interface LangTabsProps {
  langs: string[];
  selectedLang: string;
  onSelect: (lang: string) => void;
}
