import { apiRequest, setStoredToken, setStoredUser, clearAuth } from './client';

export async function loginUser(username, password) {
  try {
    const res = await apiRequest('/api/auth/login/', {
      method: 'POST',
      body: { username, password },
    });
    // ObtainAuthToken returns { token: '...' }
    if (res && res.token) {
      setStoredToken(res.token);
      // Fetch profile or set default
      try {
        const me = await apiRequest('/api/auth/me/');
        setStoredUser(me);
        return { user: me, token: res.token, isBackend: true };
      } catch {
        const u = { username, email: `${username}@oxford.ac.uk`, university: 'oxford university' };
        setStoredUser(u);
        return { user: u, token: res.token, isBackend: true };
      }
    }
    return res;
  } catch (err) {
    // Offline simulation for demo accounts
    const mockUser = {
      username: username || 'Lisbon',
      email: `${username || 'lisbon'}@oxford.ac.uk`,
      university: 'oxford university',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    };
    setStoredUser(mockUser);
    setStoredToken('mock-session-token-' + Date.now());
    return { user: mockUser, token: 'mock-token', isBackend: false };
  }
}

export async function registerUser(username, email, password) {
  try {
    const res = await apiRequest('/api/auth/register/', {
      method: 'POST',
      body: { username, email, password },
    });
    if (res && res.token) {
      setStoredToken(res.token);
      setStoredUser(res.user);
      return { user: res.user, token: res.token, isBackend: true };
    }
    return res;
  } catch (err) {
    const mockUser = {
      username,
      email,
      university: 'oxford university',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    };
    setStoredUser(mockUser);
    setStoredToken('mock-session-token-' + Date.now());
    return { user: mockUser, token: 'mock-token', isBackend: false };
  }
}

export function logoutUser() {
  clearAuth();
}

