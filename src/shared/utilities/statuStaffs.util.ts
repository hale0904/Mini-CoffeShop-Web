import { STATUS_STAFF } from '../constants/statusStaff';

// lấy full object
export const getStatusStaff = (value: number) => {
  return STATUS_STAFF[value as keyof typeof STATUS_STAFF] || {
    label: 'Không xác định',
    className: '',
  };
};

// lấy label
export const getStatusLabel = (value: number) => {
  return getStatusStaff(value).label;
};

// lấy class
export const getStatusClass = (value: number) => {
  return getStatusStaff(value).className;
};

// dùng cho select
export const getStatusOptions = () => {
  return Object.entries(STATUS_STAFF).map(([value, item]) => ({
    value: Number(value),
    label: item.label,
  }));
};