import { jwtDecode } from 'jwt-decode';

type TokenPayload = {
  accessToken?: string;
  refreshToken?: string;
};

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

type JwtPayload = {
  exp: number;
};

const AuthHelper = {
  isTokenExpired(token: string) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (!decoded.exp) return true;

      const now = Date.now() / 1000;
      return decoded.exp < now;
    } catch {
      return true;
    }
  },

  isAuthenticated() {
    const token = this.getAccessToken();
    if (!token) return false;
    return !this.isTokenExpired(token);
  },

  getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setTokens({ accessToken, refreshToken }: TokenPayload) {
    if (accessToken) {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    }
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  },

  clearTokens() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  logout() {
    this.clearTokens();
    window.location.href = '/login';
  },
};

export default AuthHelper;
