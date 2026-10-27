import { beforeEach, describe, expect, it, vi } from 'vitest';
import { API, setupInterceptors } from './axios.js';

let validToken;
let refreshCalls;
let refreshShouldFail;
const onAuthFailure = vi.fn();

const refresh = vi.fn(async () => {
  refreshCalls += 1;
  await new Promise(resolve => setTimeout(resolve, 10));

  if (refreshShouldFail) {
    throw new Error('refresh failed');
  }

  validToken = 'fresh';
  return validToken;
});

const response = (config, status, data = {}) => ({
  status,
  data,
  headers: {},
  config,
  statusText: '',
});

const httpError = res =>
  Object.assign(new Error(`status ${res.status}`), {
    config: res.config,
    response: res,
    isAxiosError: true,
  });

API.defaults.adapter = async config => {
  if (config.url === '/offline') {
    throw Object.assign(new Error('Network Error'), {
      config,
      isAxiosError: true,
    });
  }

  if (config.url === '/auth/login') {
    throw httpError(response(config, 401));
  }

  if (config.headers.Authorization === `Bearer ${validToken}`) {
    return response(config, 200, { ok: true });
  }

  throw httpError(response(config, 401));
};

setupInterceptors({ refresh, onAuthFailure });

describe('axios 401 interceptor', () => {
  beforeEach(() => {
    validToken = 'fresh';
    refreshCalls = 0;
    refreshShouldFail = false;
    onAuthFailure.mockClear();
    API.defaults.headers.common.Authorization = 'Bearer stale';
  });

  it('refreshes the session and retries the original request', async () => {
    const { data } = await API.get('/water/day/2026-10-27');

    expect(data.ok).toBe(true);
    expect(refreshCalls).toBe(1);
  });

  it('shares one refresh between parallel 401 responses', async () => {
    const results = await Promise.all([
      API.get('/a'),
      API.get('/b'),
      API.get('/c'),
    ]);

    expect(results.every(({ data }) => data.ok)).toBe(true);
    expect(refreshCalls).toBe(1);
  });

  it('does not refresh when the login request itself is rejected', async () => {
    await expect(API.post('/auth/login')).rejects.toMatchObject({
      response: { status: 401 },
    });
    expect(refreshCalls).toBe(0);
  });

  it('passes network errors through without a refresh', async () => {
    await expect(API.get('/offline')).rejects.toThrow('Network Error');
    expect(refreshCalls).toBe(0);
    expect(onAuthFailure).not.toHaveBeenCalled();
  });

  it('reports a failed refresh once and rejects with the original 401', async () => {
    refreshShouldFail = true;

    await expect(API.get('/water/month/2026-10')).rejects.toMatchObject({
      response: { status: 401 },
    });
    expect(onAuthFailure).toHaveBeenCalledTimes(1);
  });
});
