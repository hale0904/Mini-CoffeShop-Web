import Box from '@mui/material/Box';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { useEffect, useRef, useState } from 'react';
import { HrService } from '../../services/staff';
import type { DTOStaff } from '../../dtos/dtoStaff.dto';
import './listStaff.scss';
import IconButton from '@mui/material/IconButton';

const columns: GridColDef<DTOStaff>[] = [
  { field: 'code', headerName: 'Mã', width: 70 },
  { field: 'userName', headerName: 'Tên nhân viên', width: 130 },
  { field: 'email', headerName: 'Email', width: 200 },
  { field: 'phone', headerName: 'Số điện thoại', width: 150 },
  { field: 'loactionName', headerName: 'Vị trí', width: 150 },
  { field: 'typeOfPersonnel', headerName: 'Loại nhân sự', width: 150 },
  { field: 'typeOfContract', headerName: 'Loại hợp đồng', width: 150 },
  { field: 'statusName', headerName: 'Trạng thái', width: 150 },
  {
    field: 'actions',
    headerName: 'Thao tác',
    width: 150,
    sortable: false,
    filterable: false,
    renderCell: (params) => {
      const row = params.row as DTOStaff;

      return (
        <>
          <IconButton
            color="primary"
            onClick={() => handleEdit(row)}
          >
            Cập nhật
            {/* <EditIcon /> */}
          </IconButton>

          <IconButton
            color="error"
            onClick={() => handleDelete(row)}
          >
            Xóa
            {/* <DeleteIcon /> */}
          </IconButton>
        </>
      );
    },
  },
];

function handleEdit(staff: DTOStaff) {}
function handleDelete(staff: DTOStaff) {}

function ListStaff() {
  const calledRef = useRef(false);
  const [rows, setRows] = useState<DTOStaff[]>([]);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      const payload = {
        page: 1,
        pageSize: 10,
      };
      const res = await HrService(payload);
      console.log(res, 'res');
      const data: DTOStaff[] = res.data;

      // DataGrid bắt buộc phải có id
      const mapped = data.map((item, index) => ({
        ...item,
        id: item.code || index + 1,
      }));

      setRows(mapped);
    } catch (error) {
      console.error('Load staff error:', error);
    }
  };
  return (
    <Box className="listStaff">
      <DataGrid
        className="grid"
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[10, 20]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}

export default ListStaff;
