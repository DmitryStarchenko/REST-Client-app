import { Header } from './header.types';

export interface HeaderRowProps {
  header: Header;
  index: number;
  totalHeaders: number;
  onUpdate: (id: string, key: string, value: string) => void;
  onRemove: (id: string) => void;
}
