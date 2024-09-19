import { useAuth } from '../context/AuthContext';

export const useApi = () => {
  const { token } = useAuth();

  const callApi = async (
    url: string,
    method: string = 'GET',
    body: any = null
  ) => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      method,
      headers,
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error('API call failed');
    }

    return response.json();
  };

  return { callApi };
};
