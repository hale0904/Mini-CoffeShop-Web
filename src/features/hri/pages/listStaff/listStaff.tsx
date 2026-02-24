import Box from '@mui/material/Box';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { useEffect, useRef, useState } from 'react';
import { HrService } from '../../services/staff';
import type { DTOStaff } from '../../dtos/dtoStaff.dto';
import './listStaff.scss';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FilterListAltIcon from '@mui/icons-material/FilterListAlt';
import { Modal } from 'antd';
import { useForm } from 'react-hook-form';

function ListStaff() {
  const calledRef = useRef(false);
  const [rows, setRows] = useState<DTOStaff[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedStaff, setSelectedStaff] = useState<DTOStaff | null>(null);

  const { handleSubmit, register, reset } = useForm<DTOStaff>({
    defaultValues: {
      code: '',
      userName: '',
      email: '',
      password: '',
      dateOfBirth: '',
      loactionName: '',
      roleStaff: '',
      roleStaffName: '',
      phone: 0,
      typeOfPersonnel: '',
      typeOfContract: '',
      cccd: '',
      status: 0,
      statusName: '',
      permissions: {},
    },
  });

  const columns: GridColDef<DTOStaff>[] = [
  { field: 'code', headerName: 'Mã', width: 70 },
  { field: 'userName', headerName: 'Tên nhân viên', width: 130 },
  { field: 'phone', headerName: 'Số điện thoại', width: 150 },
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
          <IconButton color="primary" onClick={() => handleEdit(row)}>
            <EditIcon />
          </IconButton>

          <IconButton color="error" onClick={() => handleDelete(row)}>
            <DeleteIcon />
          </IconButton>
        </>
      );
    },
  },
];

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;
    loadStaff();
  }, []);

  const addModal = () => {
    setMode('add');
    reset();
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onSubmit = (data: DTOStaff) => {
    console.log('FORM DATA:', data);
    setIsModalOpen(false);
  };

  function handleEdit(staff: DTOStaff) {
    setMode('edit');
    setSelectedStaff(staff);
    reset(staff);
    setIsModalOpen(true);
  }

  function handleDelete(staff: DTOStaff) {}

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
      <div className="header">
        <div className="filter-container">
          <div className="filter-content">
            <FilterListAltIcon className="filter-icon" />
            Lọc dữ liệu
          </div>
          <div className="search-field-container">
            Tìm kiếm
            <TextField className="search-field" variant="outlined" placeholder="Tên" />
            <Button className="btn-search" onClick={() => console.log('Search clicked')}>
              <SearchIcon className="icon-search" />
            </Button>
          </div>
        </div>
        <div className="btn-add-container">
          <button className="btn-add" onClick={addModal}>
            Thêm mới
          </button>
        </div>
      </div>

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
      <Modal
        className="modal-staff"
        title="NHÂN VIÊN"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <form onSubmit={handleSubmit(onSubmit)} className='modal-form'>
          <input {...register('userName')} placeholder="Tên nhân viên" />

          <input {...register('email')} placeholder="Email" />

          <input type="password" {...register('password')} placeholder="Password" />

          <input type="date" {...register('dateOfBirth')} />

          <input {...register('phone')} placeholder="SĐT" />

          <input {...register('typeOfPersonnel')} placeholder="Loại nhân sự" />

          <input {...register('typeOfContract')} placeholder="Loại hợp đồng" />

          <input {...register('cccd')} placeholder="CCCD" />

          <div className="form-btn">
            <button type="submit">Lưu</button>
            <button type="button" onClick={handleCancel}>
              Đóng
            </button>
          </div>
        </form>
      </Modal>
    </Box>
  );
}

export default ListStaff;
