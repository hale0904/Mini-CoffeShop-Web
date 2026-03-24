import {ACCOUNTUSER_API} from '../../../shared/api/accountUser.api' ;
import apiHelper from "../../../shared/helpers/api.helper";
import type { DTOUserAccount } from '../dtos/dtoUser.dto';

export function GetListAccountService(payload: any) {
  return apiHelper.post(ACCOUNTUSER_API.GetListAccount, payload);
}

export function UpdateAccountService(payload: DTOUserAccount) {
  return apiHelper.post(ACCOUNTUSER_API.UpdateAccount, payload);
}