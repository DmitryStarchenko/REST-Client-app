import { User, UserResponse } from '@supabase/supabase-js';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { describe, it, expect, vi, beforeEach, afterEach, MockedFunction } from 'vitest';

import { supabaseAdmin } from '@/lib/supabase/admin';
import { ApiResponse, ErrorResponse, SuccessResponse } from '@/types';

vi.mock('axios', () => ({
  default: {
    request: vi.fn(),
  },
}));

vi.mock('@/lib/supabase/admin', () => ({
  supabaseAdmin: {
    auth: {
      getUser: vi.fn(),
    },
    from: vi.fn(),
  },
}));

vi.mock('next/server', () => ({
  NextRequest: vi.fn(),
  NextResponse: {
    json: vi.fn(),
  },
}));

const mockAxiosRequest = axios.request as MockedFunction<typeof axios.request>;
const mockSupabaseAuthGetUser = supabaseAdmin.auth.getUser as MockedFunction<
  typeof supabaseAdmin.auth.getUser
>;
const mockSupabaseFrom = supabaseAdmin.from as MockedFunction<typeof supabaseAdmin.from>;
const mockNextResponseJson = NextResponse.json as MockedFunction<typeof NextResponse.json>;

describe('POST handler', () => {
  const mockJson = vi.fn();
  const mockRequest = {
    json: mockJson,
  } as unknown as NextRequest;

  const mockUser: User = {
    id: 'user-123',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString(),
    email: 'test@example.com',
  } as User;

  const mockAuthResponse: UserResponse = {
    data: {
      user: mockUser,
    },
    error: null,
  };

  const mockAuthResponseWithNullUser: UserResponse = {
    data: {
      user: mockUser,
    },
    error: null,
  };

  const mockInsertFn = vi.fn();

  let lastResponseData: ApiResponse | null = null;

  beforeEach(() => {
    vi.clearAllMocks();
    lastResponseData = null;

    mockSupabaseAuthGetUser.mockResolvedValue(mockAuthResponse);
    mockSupabaseFrom.mockReturnValue({
      insert: mockInsertFn.mockResolvedValue({ error: null }),
    } as never);

    mockNextResponseJson.mockImplementation((data: unknown, options?: { status?: number }) => {
      lastResponseData = data as ApiResponse;
      return {
        json: () => Promise.resolve(data),
        status: options?.status || 200,
      } as unknown as NextResponse;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Edge cases and error coverage', () => {
    it('should handle case where user is null from supabase auth', async () => {
      const requestPayload = {
        url: 'https://api.example.com/data',
        method: 'GET',
        access_token: 'valid-token',
      };

      mockJson.mockResolvedValue(requestPayload);
      mockAxiosRequest.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: Buffer.from('{}'),
      });
      mockSupabaseAuthGetUser.mockResolvedValue(mockAuthResponseWithNullUser);
      const { POST } = await import('../src/app/api/proxy/route');
      await POST(mockRequest);

      expect(mockSupabaseAuthGetUser).toHaveBeenCalledWith('valid-token');
    });

    it('should handle supabase insert error silently', async () => {
      const requestPayload = {
        url: 'https://api.example.com/data',
        method: 'GET',
      };
      mockJson.mockResolvedValue(requestPayload);
      mockAxiosRequest.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: Buffer.from('{}'),
      });
      mockInsertFn.mockRejectedValue(new Error('Database error'));

      const { POST } = await import('../src/app/api/proxy/route');
      await expect(POST(mockRequest)).resolves.not.toThrow();
      expect(mockNextResponseJson).toHaveBeenCalled();
    });

    it('should handle non-Buffer axios response data', async () => {
      const requestPayload = {
        url: 'https://api.example.com/data',
        method: 'GET',
      };
      mockJson.mockResolvedValue(requestPayload);
      mockAxiosRequest.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: 'plain text response',
      });

      const { POST } = await import('../src/app/api/proxy/route');
      await POST(mockRequest);
      const responseData = lastResponseData as SuccessResponse;
      expect(responseData.data).toBe('plain text response');
    });

    it('should handle JSON parsing error for response text', async () => {
      const requestPayload = {
        url: 'https://api.example.com/data',
        method: 'GET',
      };

      const invalidJson = '{invalid: json}';
      mockJson.mockResolvedValue(requestPayload);
      mockAxiosRequest.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: Buffer.from(invalidJson),
      });
      const { POST } = await import('../src/app/api/proxy/route');
      await POST(mockRequest);
      const responseData = lastResponseData as SuccessResponse;
      expect(responseData.data).toBe(invalidJson);
    });

    it('should handle empty response data', async () => {
      const requestPayload = {
        url: 'https://api.example.com/data',
        method: 'GET',
      };

      mockJson.mockResolvedValue(requestPayload);
      mockAxiosRequest.mockResolvedValue({
        status: 204,
        statusText: 'No Content',
        headers: {},
        data: null,
      });
      const { POST } = await import('../src/app/api/proxy/route');
      await POST(mockRequest);
      const responseData = lastResponseData as SuccessResponse;
      expect(responseData.data).toBeNull();
    });

    it('should handle request JSON parsing error in body', async () => {
      const requestPayload = {
        url: 'https://api.example.com/data',
        method: 'POST',
        body: 'invalid-json{',
      };
      mockJson.mockResolvedValue(requestPayload);
      mockAxiosRequest.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: Buffer.from('{}'),
      });
      const { POST } = await import('../src/app/api/proxy/route');
      await POST(mockRequest);
      expect(mockAxiosRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          data: 'invalid-json{',
        }),
      );
    });

    it('should handle unknown error type in catch block', async () => {
      const requestPayload = {
        url: 'https://api.example.com/error',
        method: 'GET',
      };
      mockJson.mockResolvedValue(requestPayload);
      mockAxiosRequest.mockRejectedValue('string error');

      const { POST } = await import('../src/app/api/proxy/route');
      await POST(mockRequest);
      const responseData = lastResponseData as ErrorResponse;
      expect(responseData.error).toBe('Unknown error');
    });

    it('should include path in supabase insert when provided', async () => {
      const requestPayload = {
        url: 'https://api.example.com/data',
        method: 'GET',
        path: '/api/custom-path',
      };
      mockJson.mockResolvedValue(requestPayload);
      mockAxiosRequest.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: Buffer.from('{}'),
      });
      const { POST } = await import('../src/app/api/proxy/route');
      await POST(mockRequest);
      expect(mockInsertFn).toHaveBeenCalledWith(
        expect.objectContaining({
          path: '/api/custom-path',
        }),
      );
    });
  });

  it('should handle error in main try-catch block', async () => {
    mockJson.mockRejectedValue(new Error('JSON parsing failed'));
    const { POST } = await import('../src/app/api/proxy/route');
    await POST(mockRequest);
    const call = mockNextResponseJson.mock.calls[0];
    expect(call[0]).toEqual(
      expect.objectContaining({
        ok: false,
        error: expect.any(String),
      }),
    );
    expect(call[1]).toEqual({ status: 500 });
  });
});
