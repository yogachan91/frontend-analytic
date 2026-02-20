const API_URL =
  import.meta.env.VITE_API_URL || "http://192.168.33.91:8080/api";
  // import.meta.env.VITE_API_URL || "http://127.0.0.1:8080/api";

export async function fetchWithAuth(
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> {

  const accessToken = localStorage.getItem("access_token");

  let response = await fetch(input, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      Authorization: accessToken ? `Bearer ${accessToken}` : "",
    },
  });

  if (response.status === 401) {
    console.warn("[AUTH] Access token expired, refreshing...");

    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      throw new Error("No refresh token");
    }

    const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
    });

    if (!refreshResponse.ok) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      throw new Error("Refresh token expired");
    }

    const refreshData = await refreshResponse.json();

    localStorage.setItem("access_token", refreshData.access_token);

    // ulangi request awal
    response = await fetch(input, {
      ...init,
      headers: {
        ...(init?.headers || {}),
        Authorization: `Bearer ${refreshData.access_token}`,
      },
    });

    console.log("[FETCH STATUS AFTER REFRESH]", response.status);
  }

  return response;
}
