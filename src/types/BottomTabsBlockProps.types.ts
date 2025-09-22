import { ApiResponse } from './response.types';

export interface BottomTabsBlockProps {
  response: ApiResponse | null;
  errorMessage: string | null;
  unknownErrorText: string;
  internalErrorText: string;
}
