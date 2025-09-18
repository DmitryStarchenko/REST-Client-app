export type CodeGenOutputs = Record<string, string>;

export interface CodegenSectionProps {
  method: string;
  url: string;
  headers: { key: string; value: string }[];
  body?: string;
}

export interface UseCodeGenReturn {
  generateForLang: (lang: string) => Promise<string>;
}
