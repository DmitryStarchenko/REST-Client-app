import axios, { AxiosRequestHeaders } from 'axios';
import { NextRequest, NextResponse } from 'next/server';

import { supabaseAdmin } from '@/lib';
import { ApiResponse } from '@/types';

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const payload = await req.json();
    const { url, method = 'GET', headers = {}, body, timeoutMs = 30_000, access_token } = payload;

    // Create Supabase client with user token if possible
    let userId: string | null = null;
    if (access_token) {
      const {
        data: { user },
      } = await supabaseAdmin.auth.getUser(access_token);
      userId = user?.id ?? null;
    }

    const requestHeaders: AxiosRequestHeaders = { ...headers };

    const start = Date.now();
    const axiosRes = await axios.request({
      url,
      method,
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
    } catch {}

    // --- Save in Supabase ---
    try {
      await supabaseAdmin.from('request_history').insert({
        user_id: userId,
        method,
        url,
        headers: JSON.stringify(headers),
        body: body ?? null,
        response_status: axiosRes.status,
        response_data: responseText,
        duration_ms: durationMs,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Failed to save request history:', err);
    }

    // --- Return response ---
    if (axiosRes.status >= 200 && axiosRes.status < 300) {
      const successResponse: ApiResponse = {
        ok: true,
        status: axiosRes.status,
        statusText: axiosRes.statusText,
        headers: axiosRes.headers,
        data: parsed,
      };
      return NextResponse.json(successResponse, { status: 200 });
    } else {
      const errorResponse: ApiResponse = {
        ok: false,
        error: responseText,
      };
      return NextResponse.json(errorResponse, { status: 200 });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    const errorResponse: ApiResponse = { ok: false, error: message };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
