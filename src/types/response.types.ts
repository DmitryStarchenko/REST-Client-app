import { AxiosHeaderValue, AxiosResponseHeaders, RawAxiosResponseHeaders } from 'axios';

export interface SuccessResponse {
  ok: true;
  status: number;
  statusText: string;
  headers:
    | AxiosResponseHeaders
    | Partial<
        RawAxiosResponseHeaders & {
          'Content-Length': AxiosHeaderValue;
          'Content-Encoding': AxiosHeaderValue;
          'Content-Type': AxiosHeaderValue;
          Server: AxiosHeaderValue;
          'Cache-Control': AxiosHeaderValue;
        } & {
          'set-cookie': string[];
        }
      >;
  data: unknown;
}

export interface ErrorResponse {
  ok: false;
  error: string;
}

export type ApiResponse = Readonly<SuccessResponse | ErrorResponse>;

export interface ResponseBlockProps {
  response: ApiResponse | null;
  errorMessage: string | null;
}
