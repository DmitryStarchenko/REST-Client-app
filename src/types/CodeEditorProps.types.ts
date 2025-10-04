export interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  height?: string;
  language?: string;
  readOnly?: boolean;
}
