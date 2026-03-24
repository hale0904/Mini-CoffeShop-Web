import { FEATURE_API } from "../../../shared/api/feature.api";
import apiHelper from "../../../shared/helpers/api.helper";

export function GetListFeatureMenuService() {
  return apiHelper.post(FEATURE_API.getListFeature);
}