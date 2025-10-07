import axios from 'axios';

const client = axios.create({
  baseURL: 'https://www.themealdb.com/api/json/v1/1',
  timeout: 10000,
});

// simple  cache
const TTL_MS = 5 * 60 * 1000;
function cacheKey(url: string) {
  return `cache:${url}`;
}

client.interceptors.request.use((config) => {
  const key = cacheKey(config.url ? config.url : '');
  const cached = localStorage.getItem(key);
  if (cached) {
    try {
      const { t, data } = JSON.parse(cached);
      if (Date.now() - t < TTL_MS) {
        config.adapter = async () => ({
          data,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        });
      } else {
        localStorage.removeItem(key);
      }
    } catch {}
  }
  return config;
});

client.interceptors.response.use((resp) => {
  try {
    localStorage.setItem(
      cacheKey(resp.config.url || ''),
      JSON.stringify({ t: Date.now(), data: resp.data })
    );
  } catch {}
  return resp;
});

export default client;
