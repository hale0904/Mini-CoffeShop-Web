import { AUTH_API } from "../../../shared/api/auth.api";
import { LAYOUT_API } from "../../../shared/api/layout.api";
import apiHelper from "../../../shared/helpers/api.helper";

export function FeatureService() {
  return apiHelper.post(LAYOUT_API.Feature)
}

export function MenuService() {
  return apiHelper.post(LAYOUT_API.Menu)
}

export function LogoutService() {
  return apiHelper.post(AUTH_API.Logout)
}