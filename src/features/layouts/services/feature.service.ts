import { LAYOUT_API } from "../../../shared/constants/layout.constant";
import apiHelper from "../../../shared/helpers/api.helper";

export function FeatureService() {
  return apiHelper.post(LAYOUT_API.Feature)
}

export function MenuService() {
  return apiHelper.post(LAYOUT_API.Menu)
}