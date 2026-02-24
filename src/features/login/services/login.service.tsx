import apiHelper from '../../../shared/helpers/api.helper';
import { AUTH_API } from '../../../shared/constants/auth-api.constant';
import type { Account } from '../dtos/user.dto';

/**
 * @param {Account} accountDto
 */
export default function LoginService(accountDto: Account) {
  return apiHelper.post(AUTH_API.Login, accountDto);
}
