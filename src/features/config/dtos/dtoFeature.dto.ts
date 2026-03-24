import type { DTOMenu } from './dtoMenu.dto';

export class DTOFeature {
  code: string = '';
  name: string = '';
  isActive: boolean = true;
  listMenu: DTOMenu[] = [];
}
