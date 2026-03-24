export class DTOMenu {
    code: string = '';
    name: string = '';
    path: string = '';
    icon: string = '';
    order: number = 0;
    parentId: DTOMenu[]=[];
    featureCode: string = '';
    isActive: boolean = false;
}