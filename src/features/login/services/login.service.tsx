import apiHelper from '../../../shared/helpers/api.helper';
import { AUTH_API } from '../../../shared/constants/auth-api.constant';
import type { Account } from '../types/account.types';

/**
 * @param {Account} accountDto
 */
export default function LoginService(accountDto: Account) {
  return apiHelper.post(AUTH_API.LOGIN, accountDto);
}
