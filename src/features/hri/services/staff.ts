import { HR_API } from "../../../shared/constants/hr-api.constant";
import apiHelper from "../../../shared/helpers/api.helper";

export function HrService(payload: any) {
  return apiHelper.post(HR_API.ListStaff, payload);
}