// Priority: STRAPI_URL (server-side Docker) → NEXT_PUBLIC_STRAPI_URL (build-time / browser) → local dev fallback
export const STRAPI_URL = process.env.STRAPI_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337';

/**
 * Helper to make GET requests to Strapi
 */
export async function fetchApi<T>(
  path: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  urlParamsObject: Record<string, any> = {},
  options = {}
): Promise<T> {
  // Merge default and user options
  const mergedOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
    ...options,
  };

  // Build request URL
  const searchParams = new URLSearchParams();
  Object.entries(urlParamsObject).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (typeof value === 'object') {
        searchParams.append(key, JSON.stringify(value));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  const queryString = searchParams.toString();
  const requestUrl = `${STRAPI_URL}/api${path}${queryString ? `?${queryString}` : ''}`;

  // Trigger API call
  const response = await fetch(requestUrl, mergedOptions);

  // Handle response
  if (!response.ok) {
    console.error(response.statusText);
    throw new Error(`An error occurred please try again`);
  }
  const data = await response.json();
  return data;
}
