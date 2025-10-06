export interface UseHeadersReturn {
  handleHeaderChange: (id: string, key: string, value: string) => void;
  handleHeaderRemove: (id: string) => void;
}
