import { STATUS } from '../constants/status';

// lấy full object
export const getStatus = (value: number) => {
  return STATUS[value as keyof typeof STATUS] || {
    label: 'Không xác định',
    className: '',
  };
};

// lấy label
export const getStatusLabel = (value: number) => {
  return getStatus(value).label;
};

// lấy class
export const getStatusClass = (value: number) => {
  return getStatus(value).className;
};

// dùng cho select
export const getStatusOptions = () => {
  return Object.entries(STATUS).map(([value, item]) => ({
    value: Number(value),
    label: item.label,
  }));
};