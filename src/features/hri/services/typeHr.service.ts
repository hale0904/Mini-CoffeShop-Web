import { TYPEHR_API } from "../../../shared/api/hr.api";
import apiHelper from "../../../shared/helpers/api.helper";
import type { DTOTypeHr } from "../dtos/dtoTypeHr.dto";

export function GetListTypeHrService(payload: any) {
  return apiHelper.post(TYPEHR_API.getListTypeHr, payload,);
}

export function UpdateTypeHrService(payload: DTOTypeHr) {
  return apiHelper.post(TYPEHR_API.updateTypeHr, payload);
}

export function DeleteTypeHrService(payload: DTOTypeHr[]) {
  return apiHelper.post(TYPEHR_API.deleteTypeHr, {items: payload});
}