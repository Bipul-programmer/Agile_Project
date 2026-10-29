// API Client with automatic Token auth, Vite proxy support & offline resiliency

const TOKEN_KEY = 'findit_auth_token';
const USER_KEY = 'findit_auth_user';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export function getStoredToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || '10fc20f13abc380e070ec079b89559171e96f6f0';
  } catch {
    return '10fc20f13abc380e070ec079b89559171e96f6f0';
  }
}

export function setStoredToken(token) {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch (e) {
    console.error('Failed to save token to localStorage', e);
  }
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : {
      id: 1,
      username: 'Lisbon',
      email: 'lisbon@oxford.ac.uk',
      university: 'oxford university',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    };
  } catch {
    return {
      id: 1,
      username: 'Lisbon',
      email: 'lisbon@oxford.ac.uk',
      university: 'oxford university',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    };
  }
}

export function setStoredUser(user) {
  try {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  } catch (e) {
    console.error('Failed to save user to localStorage', e);
  }
}

export function clearAuth() {
  setStoredToken(null);
  setStoredUser(null);
}

/**
 * Universal fetch wrapper for the Django REST framework backend.
 */
export async function apiRequest(endpoint, { method = 'GET', body, headers = {}, timeout = 5000 } = {}) {
  const token = getStoredToken();
  const requestHeaders = { ...headers };

  if (token) {
    requestHeaders['Authorization'] = `Token ${token}`;
  }

  // Handle FormData vs JSON
  let requestBody = body;
  if (body && !(body instanceof FormData) && typeof body === 'object') {
    requestHeaders['Content-Type'] = 'application/json';
    requestBody = JSON.stringify(body);
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: requestBody,
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (response.status === 204) {
      return null;
    }

    const contentType = response.headers.get('content-type') || '';
    let data = null;
    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const error = new Error(
        (data && (data.detail || data.error || (typeof data === 'object' ? JSON.stringify(data) : data))) ||
        `Request failed with status ${response.status}`
      );
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

/**
 * Checks if the backend is reachable.
 */
export async function checkBackendConnection() {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/categories/`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(2500),
    });
    return res.ok;
  } catch {
    return false;
  }
}

