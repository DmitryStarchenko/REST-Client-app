import axios, {
  AxiosHeaderValue,
  AxiosRequestHeaders,
  AxiosResponseHeaders,
  RawAxiosResponseHeaders,
} from 'axios';
import { NextRequest, NextResponse } from 'next/server';

interface SuccessResponse {
  ok: boolean;
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

interface ErrorResponse {
  ok: false;
  error: string;
}

type ApiResponse = Readonly<SuccessResponse | ErrorResponse>;

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const payload = await req.json();
    const { url, method = 'GET', headers = {}, body, timeoutMs = 30_000 } = payload;

    const requestHeaders: AxiosRequestHeaders = { ...headers };

    const start = Date.now();
    const axiosRes = await axios.request({
      url,
      method: method,
      headers: requestHeaders,
      data: body === '' ? undefined : body,
      responseType: 'arraybuffer',
      timeout: timeoutMs,
      validateStatus: () => true,
    });

    const _durationMs = Date.now() - start; //TODO: for analytics

    let responseText: string;

    try {
      responseText = Buffer.from(axiosRes.data).toString('utf-8');
    } catch {
      responseText = String(axiosRes.data);
    }

    let parsed: unknown = responseText;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      //TODO: add log error
    }

    return NextResponse.json(
      {
        ok: axiosRes.status >= 200 && axiosRes.status < 300,
        status: axiosRes.status,
        statusText: axiosRes.statusText,
        headers: axiosRes.headers,
        data: parsed,
      },
      { status: 200 },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';

    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
