export interface HeaderFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  incomplete?: boolean;
  tooltipText?: string;
  className?: string;
}
