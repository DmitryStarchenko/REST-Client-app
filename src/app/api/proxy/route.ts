import axios, { AxiosRequestHeaders } from 'axios';
import { NextRequest, NextResponse } from 'next/server';

import { ApiResponse } from '@/types';

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

    const durationMs = Date.now() - start;

    let responseText: string;

    try {
      responseText = Buffer.from(axiosRes.data).toString('utf-8');
    } catch {
      responseText = String(axiosRes.data);
    }

    let parsed: unknown = responseText;
    try {
      parsed = JSON.parse(responseText);
    } catch (err) {
      console.error(err);
    }

    //TODO: for analytics
    console.log({
      userId: '',
      url,
      method,
      durationMs,
      status: axiosRes.status,
      requestSize: body ? Buffer.byteLength(JSON.stringify(body), 'utf8') : 0,
      responseSize: responseText ? Buffer.byteLength(responseText, 'utf8') : 0,
      timestamp: new Date().toISOString(),
    });

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
