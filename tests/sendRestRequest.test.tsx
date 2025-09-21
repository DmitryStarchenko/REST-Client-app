import type { Session, User } from '@supabase/supabase-js';
import type { AxiosResponse } from 'axios';
import axios, { AxiosHeaders } from 'axios';
import { describe, it, expect, beforeEach, vi, MockedFunction } from 'vitest';

import * as sessionModule from '@/lib/supabase/session';
import type { Header } from '@/types';
import type { BuildRestPathInput, ParseRestPathResult } from '@/types';
import * as utils from '@/utils';
import { sendRestRequest } from '@/utils/sendRestRequest';

vi.mock('@/utils', async () => {
  const actual = await vi.importActual<typeof import('@/utils')>('@/utils');
  return {
    ...actual,
    buildRestPath: vi.fn(),
    headersArrayToObject: vi.fn(),
  };
});

vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

vi.mock('@/lib/supabase/session');

describe('sendRestRequest', () => {
  let buildRestPathMock: MockedFunction<(input: BuildRestPathInput) => ParseRestPathResult>;
  let headersArrayToObjectMock: MockedFunction<(headers: Header[]) => Record<string, string>>;

  beforeEach(() => {
    vi.clearAllMocks();
    buildRestPathMock = vi.mocked(utils.buildRestPath);
    headersArrayToObjectMock = vi.mocked(utils.headersArrayToObject);

    window.history.replaceState = vi.fn();

    let time = 1000;
    vi.spyOn(performance, 'now').mockImplementation(() => (time += 50));
  });

  it('should return augmented response for ok=false', async () => {
    const fakeUser: User = {
      id: 'user_123',
      aud: 'authenticated',
      app_metadata: {},
      user_metadata: {},
      created_at: new Date().toISOString(),
      email: '',
      phone: '',
      confirmed_at: '',
      last_sign_in_at: '',
      role: 'authenticated',
      updated_at: new Date().toISOString(),
    };
    const fakeSession: Session = {
      access_token: '',
      refresh_token: '',
      expires_in: 3600,
      token_type: 'bearer',
      user: fakeUser,
    };
    vi.mocked(sessionModule.getValidatedClientSession).mockResolvedValue(fakeSession);

    buildRestPathMock.mockReturnValue({
      path: '/fail-path',
      method: 'GET',
      urlB64: '',
      bodyB64: '',
      query: '',
    });
    headersArrayToObjectMock.mockReturnValue({});

    const fakeResponse: AxiosResponse<{ ok: false; error: string }> = {
      data: { ok: false, error: 'Something went wrong' },
      status: 400,
      statusText: 'Bad Request',
      headers: {},
      config: { headers: new AxiosHeaders() },
    };
    mockedAxios.post.mockResolvedValue(fakeResponse);

    const result = await sendRestRequest({
      method: 'GET',
      url: '/api/fail',
      headers: [],
      body: '',
    });

    if (!result.ok) {
      expect(result.error).toBe('Something went wrong');
      expect(result.status).toBe(400);
      expect(result.statusText).toBe('Bad Request');
      expect(result.headers).toEqual({});
    } else {
      throw new Error('Expected error response');
    }
  });
});
