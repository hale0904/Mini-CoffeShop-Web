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

  public static formatDateToInput(value: any): string {
    if (!this.hasValue(value)) return '';

    const d = new Date(value);
    if (isNaN(d.getTime())) return '';

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  /**
   * Convert "YYYY-MM-DD" -> Date
   * Fix lỗi lệch timezone
   */
  public static parseInputToDate(value: any): Date | null {
    if (!this.hasValueString(value)) return null;

    const d = new Date(value + 'T00:00:00');
    return isNaN(d.getTime()) ? null : d;
  }

  /**
   * Convert Date -> ISO string (gửi backend)
   */
  public static toISOStringSafe(value: any): string | null {
    if (!this.hasValue(value)) return null;

    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d.toISOString();
  }
}
