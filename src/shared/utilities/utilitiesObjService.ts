export class utilitiesObjService {
  // hàm kiểm tra giá trị
  public static hasValue(value: any): boolean {
    return !(value === undefined || value === null);
  }
  // hàm kiểm tra giá trị mảng
  public static hasListValue(value: any): boolean {
    return !(value === undefined || value === null || value.length === 0) && Array.isArray(value);
  }
  // hàm kiểm tra giá trị chuỗi
  public static hasValueString(value: any): boolean {
    return !(value === undefined || value === null || value === "" || value.length === 0 ||
      (typeof value === 'string' && (value.trim() === "" || value.trim().length === 0)));
  }
  // hàm kiểm tra ngày hợp lệ
  public static isValidDate(value: any): boolean {
    return (
      this.hasValueString(value) && isNaN(value)
      && (value instanceof Date || new Date(value) instanceof Date)
    )
      && (
        !isNaN(value.valueOf()) || !isNaN(new Date(value).valueOf())
      )
  }
}
