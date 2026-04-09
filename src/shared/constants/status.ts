export const STATUS = {
  0: { label: 'Đang chỉnh sửa', className: 'status-draft' },
  1: { label: 'Hoạt động', className: 'status-active' },
  2: { label: 'Ngưng hoạt động', className: 'status-inactive' },
} as const;

export type StatusKey = keyof typeof STATUS;