import apiHelper from '../helpers/api.helper';

export function refreshTokenService(refreshToken: string) {
  return apiHelper.post('/auth/refresh-token', {
    refreshToken,
  });
}
