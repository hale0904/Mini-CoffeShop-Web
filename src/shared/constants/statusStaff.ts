export const STATUS_STAFF = {
  0: { label: 'Tuyển dụng', className: 'status-draft' },
  1: { label: 'Đang làm việc', className: 'status-active' },
  2: { label: 'Nghỉ việc', className: 'status-inactive' },
} as const;

export type StatusKey = keyof typeof STATUS_STAFF;