import { CATEGORY_API } from "../../../shared/api/product.api";
import apiHelper from "../../../shared/helpers/api.helper";
import type { DTOCategory } from "../dtos/dtoCategory.dto";

export function GetListCategoryService(payload: any) {
  return apiHelper.post(CATEGORY_API.getListCategory, payload);
}

export function UpdateCategoryStaffService(payload: DTOCategory) {
  return apiHelper.post(CATEGORY_API.updateCategory, payload);
}

export function DeleteCategoryStaffService(payload: DTOCategory[]) {
  return apiHelper.post(CATEGORY_API.deleteCategory, {items: payload});
}