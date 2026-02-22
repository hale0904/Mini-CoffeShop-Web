import axiosClient from './axiosClient.service';
import { refreshTokenService } from '../auth/auth.service';
import AuthHelper from '../auth/auth.helper';
import type { AxiosError, AxiosRequestConfig } from 'axios';

interface RetryRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

axiosClient.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryRequestConfig;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = AuthHelper.getRefreshToken();

        if (!refreshToken) {
          AuthHelper.logout();
          return Promise.reject(error);
        }

        const res = await refreshTokenService(refreshToken);
        // res = { accessToken, refreshToken }

        AuthHelper.setTokens(res.data);

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${res.data.accessToken}`,
        };

        return axiosClient(originalRequest);
      } catch (err) {
        AuthHelper.logout();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
