import { ApiResponse } from './response.types';

export interface StatisticProps {
  response: ApiResponse | null;
  errorMessage: string | null;
}
