const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const AI_BASE = process.env.NEXT_PUBLIC_AI_URL || 'http://localhost:8000';

// In-memory cache
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCached(key) {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data;
  }
  cache.delete(key);
  return null;
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

/**
 * Fetch wrapper with error handling, timeout, and caching
 */
async function apiFetch(url, options = {}, useCache = true) {
  const cacheKey = `${url}${JSON.stringify(options.body || '')}`;

  if (useCache && options.method !== 'POST') {
    const cached = getCached(cacheKey);
    if (cached) return cached;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
    const headers = { ...options.headers };
    if (!isFormData && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    if (useCache && options.method !== 'POST') {
      setCache(cacheKey, data);
    }
    return data;
  } catch (error) {
    clearTimeout(timeout);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw error;
  }
}

// ─── Sneaker API ──────────────────────────────────

export async function fetchSneakers(params = {}) {
  const query = new URLSearchParams();
  if (params.brand) query.set('brand', params.brand);
  if (params.style) query.set('style', params.style);
  if (params.category) query.set('category', params.category);
  if (params.minPrice) query.set('minPrice', params.minPrice);
  if (params.maxPrice) query.set('maxPrice', params.maxPrice);
  if (params.search) query.set('search', params.search);
  if (params.sort) query.set('sort', params.sort);
  if (params.limit) query.set('limit', params.limit);
  if (params.page) query.set('page', params.page);

  const qs = query.toString();
  return apiFetch(`${API_BASE}/api/sneakers${qs ? `?${qs}` : ''}`);
}

export async function fetchSneakerById(id) {
  return apiFetch(`${API_BASE}/api/sneakers/${id}`);
}

export async function searchSneakers(query) {
  return apiFetch(`${API_BASE}/api/sneakers/search?q=${encodeURIComponent(query)}`);
}

export async function filterSneakers(filters) {
  const query = new URLSearchParams(filters);
  return apiFetch(`${API_BASE}/api/sneakers/filter?${query.toString()}`);
}

// ─── AI Recommendations ───────────────────────────

export async function getAIRecommendations(preferences) {
  return apiFetch(`${AI_BASE}/api/recommend`, {
    method: 'POST',
    body: JSON.stringify(preferences),
  }, false);
}

export async function analyzeOutfit(file) {
  const formData = new FormData();
  formData.append('file', file);
  return apiFetch(`${AI_BASE}/api/analyze-outfit`, {
    method: 'POST',
    body: formData,
  }, false);
}

// ─── Auth API ─────────────────────────────────────

export async function login(email, password) {
  return apiFetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }, false);
}

export async function register(name, email, password) {
  return apiFetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  }, false);
}

// ─── Orders API ───────────────────────────────────

export async function createOrder(orderData, token) {
  return apiFetch(`${API_BASE}/api/orders`, {
    method: 'POST',
    body: JSON.stringify(orderData),
    headers: { Authorization: `Bearer ${token}` },
  }, false);
}

export async function fetchOrders(token) {
  return apiFetch(`${API_BASE}/api/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ─── Utility ──────────────────────────────────────

export function clearApiCache() {
  cache.clear();
}

export { API_BASE, AI_BASE };
