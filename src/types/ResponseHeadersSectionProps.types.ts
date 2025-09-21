import { ApiResponse } from './response.types';

export interface ResponseHeadersSectionProps {
  response: ApiResponse | null;
  errorMessage: string | null;
  unknownErrorText: string;
  internalErrorText: string;
}
