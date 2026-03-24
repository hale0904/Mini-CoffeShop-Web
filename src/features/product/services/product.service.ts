import { PRODUCT_API } from "../../../shared/api/product.api";
import apiHelper from "../../../shared/helpers/api.helper";
import type { DTOProduct } from "../dtos/dtoProduct.dto";

export function GetListProductService(payload: any) {
  return apiHelper.post(PRODUCT_API.getListProduct, payload);
}

export function UpdateProductStaffService(payload: DTOProduct) {
  return apiHelper.post(PRODUCT_API.updateProduct, payload);
}