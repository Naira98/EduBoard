import { API_HOST } from "../config/config";

const publicApiReq = async (
  method: string,
  endpoint: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any,
): Promise<Response> => {
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
  return fetch(`${API_HOST}${endpoint}`, options);
};

export default publicApiReq;
