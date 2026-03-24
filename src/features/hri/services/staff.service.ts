import { HR_API } from "../../../shared/api/hr.api";
import apiHelper from "../../../shared/helpers/api.helper";
import type { DTOStaff } from "../dtos/dtoStaff.dto";

export function HrService(payload: any) {
  return apiHelper.post(HR_API.listStaff, payload);
}

export function UpdateStaffService(payload: DTOStaff) {
  return apiHelper.post(HR_API.updateStaff, payload);
}