const API_URL = import.meta.env.VITE_API_URL || 'http://192.168.33.91:8080/api';

export async function fetchWithAuth(
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> {

  const accessToken = localStorage.getItem('access_token');

  const response = await fetch(input, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      Authorization: accessToken ? `Bearer ${accessToken}` : '',
    },
  });

  // ✅ ACCESS TOKEN EXPIRED
  if (response.status === 401) {
    const refreshToken = localStorage.getItem('refresh_token');

    if (!refreshToken) {
      throw new Error('No refresh token');
    }

    const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
    });

    if (!refreshResponse.ok) {
      // ❌ refresh token invalid → logout
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      throw new Error('Refresh token expired');
    }

    const refreshData = await refreshResponse.json();

    // ✅ SIMPAN ACCESS TOKEN BARU
    localStorage.setItem('access_token', refreshData.access_token);

    // 🔁 ULANGI REQUEST ASLI
    return fetch(input, {
      ...init,
      headers: {
        ...(init?.headers || {}),
        Authorization: `Bearer ${refreshData.access_token}`,
      },
    });
  }

  return response;
}
