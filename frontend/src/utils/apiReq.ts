import { jwtDecode } from "jwt-decode";
import { getTokens, setAccessToken } from "./tokens";
import { API_HOST } from "../config/config";

interface TokenPayload {
  userId: string;
  role: string;
  iat: number;
  exp: number;
}

const apiReq = async (
  method: string,
  endpoint: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any,
): Promise<Response> => {
  try {
    // eslint-disable-next-line prefer-const
    let { accessToken, refreshToken } = getTokens();

    if (!accessToken || !refreshToken) {
      throw new Error("Authentication required");
    }

    // Check if access token is expired
    const decodedToken = jwtDecode<TokenPayload>(accessToken);

    if (Date.now() >= decodedToken.exp * 1000) {
      const res = await fetch(`${API_HOST}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (res.ok) {
        const data = await res.json();
        setAccessToken(data.accessToken);
        accessToken = data.accessToken;
      } else {
        // Refresh failed, clear tokens and throw error
        const errorData = await res.json();
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        throw new Error(
          errorData.message || "Session expired. Please login again.",
        );
      }
    }

    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_HOST}${endpoint}`, options);

    if (response.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      throw new Error("Session expired. Please login again.");
    }

    return response;
  } catch (err) {
    console.error("API request failed:", err);
    throw err;
  }
};

export default apiReq;
