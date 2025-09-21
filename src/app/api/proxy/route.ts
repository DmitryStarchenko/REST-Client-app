import axios, { AxiosRequestHeaders } from 'axios';
import { NextRequest, NextResponse } from 'next/server';

import { supabaseAdmin } from '@/lib/supabase/admin';
import { ApiResponse } from '@/types';

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const payload = await req.json();
    const {
      url,
      method = 'GET',
      headers = {},
      body,
      timeoutMs = 30_000,
      access_token,
      path,
    } = payload;

    let userId: string | null = null;
    if (access_token) {
      const {
        data: { user },
      } = await supabaseAdmin.auth.getUser(access_token);
      userId = user?.id ?? null;
    }

    const requestHeaders: AxiosRequestHeaders = { ...headers };

    const start = performance.now();

    let axiosRes;
    let responseText = '';
    let errorDetails: string | null = null;

    let parsedBody = body;
    try {
      parsedBody = body ? JSON.parse(body) : undefined;
    } catch {
      parsedBody = body;
    }

    try {
      axiosRes = await axios.request({
        url,
        method,
        headers: requestHeaders,
        data: parsedBody,
        responseType: 'arraybuffer',
        timeout: timeoutMs,
        validateStatus: () => true,
      });

      try {
        responseText = Buffer.from(axiosRes.data).toString('utf-8');
      } catch {
        responseText = String(axiosRes.data);
      }
    } catch (err) {
      errorDetails = err instanceof Error ? err.message : 'Unknown error';
    }

    const durationMs = performance.now() - start;
    const timestamp = new Date().toISOString();

    const requestSize = body ? new Blob([body]).size : 0;
    const responseSize = responseText ? Buffer.byteLength(responseText, 'utf8') : 0;

    const statusCode = axiosRes?.status ?? 500;
    const statusText = axiosRes?.statusText ?? (errorDetails ? 'Request Failed' : 'Internal Error');
    const responseHeaders = axiosRes?.headers ?? {};

    let parsed: unknown = responseText;

    try {
      parsed = JSON.parse(responseText);
    } catch {
      parsed = responseText;
    }

    try {
      const supabaseResult = await supabaseAdmin.from('request_history').insert({
        user_id: userId,
        method,
        url,
        headers: JSON.stringify(headers),
        body: body ?? null,
        response_status: statusCode,
        response_data: responseText || null,
        duration_ms: Math.round(durationMs),
        timestamp,
        request_size: requestSize,
        response_size: responseSize,
        error_details: errorDetails,
        path: path,
      });
      console.log(supabaseResult);
    } catch (err) {
      console.log(err);
    }

    if (statusCode >= 200 && statusCode < 300) {
      const successResponse: ApiResponse = {
        ok: true,
        status: statusCode,
        statusText,
        headers: responseHeaders,
        data: parsed,
        durationMs: Math.round(durationMs),
        timestamp,
        requestSize,
        responseSize,
      };
      return NextResponse.json(successResponse, { status: statusCode });
    } else {
      const errorResponse: ApiResponse = {
        ok: false,
        status: statusCode,
        statusText,
        headers: responseHeaders,
        error: errorDetails || responseText,
        durationMs: Math.round(durationMs),
        timestamp,
        requestSize,
        responseSize,
      };
      return NextResponse.json(errorResponse, { status: statusCode });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    const errorResponse: ApiResponse = {
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      headers: {},
      error: message,
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
