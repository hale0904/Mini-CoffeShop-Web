import type { DTOProduct } from "./dtoProduct.dto.";

export class DTOCategory {
  _id: string = '';
  code: string = '';
  name: string = '';
  description: string = '';
  status: number = 0;
  statusName: string = '';
  products: DTOProduct[]=[]
}
