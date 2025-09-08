import { ApiResponse, SuccessResponse } from '@/types';

export function isSuccess(res: ApiResponse | null): res is SuccessResponse {
  return !!res && 'status' in res;
}
