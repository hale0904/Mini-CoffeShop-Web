import Box from '@mui/material/Box';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { useEffect, useRef, useState } from 'react';
import { HrService, UpdateStaffService } from '../../services/staff.service';
import type { DTOStaff } from '../../dtos/dtoStaff.dto';
import './listStaff.scss';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import FilterListAltIcon from '@mui/icons-material/FilterListAlt';
import { Modal, Spin } from 'antd';
import { useForm } from 'react-hook-form';

function ListStaff() {
  const calledRef = useRef(false);
  const [rows, setRows] = useState<DTOStaff[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedStaff, setSelectedStaff] = useState<DTOStaff | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const defaultFormValues: DTOStaff = {
    code: '0',
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
  };

  const { handleSubmit, register, reset } = useForm<DTOStaff>({
    defaultValues: defaultFormValues,
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
    reset({ ...defaultFormValues, code: '0' });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onSubmit = (data: DTOStaff) => {
    if (data.code === '0') {
      // API create
      APIupdateStaff(data);
    } else {
      // API update
      APIupdateStaff(data);
    }
  };

  function APIupdateStaff(data: DTOStaff) {
    setLoading(true);
    UpdateStaffService(data)
      .then(() => {
        setLoading(false);
        setIsModalOpen(false);
        loadStaff();
      })
      .catch((error) => {
        setLoading(false);
        console.error('Update staff error:', error);
      });
  }

  function handleEdit(staff: DTOStaff) {
    setMode('edit');
    setSelectedStaff(staff);
    reset(staff);
    setIsModalOpen(true);
  }

  const loadStaff = async () => {
    try {
      const payload = {
        page: 1,
        pageSize: 10,
      };
      const res = await HrService(payload);
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
    <Spin spinning={loading}>
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
          <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
            <label htmlFor="code">Mã nhân viên</label>
            <input {...register('code')} placeholder="Mã nhân viên" />

            <label htmlFor="userName">Tên nhân viên</label>
            <input {...register('userName')} placeholder="Tên nhân viên" />

            <label htmlFor="email">Email</label>
            <input {...register('email')} placeholder="Email" />

            <label htmlFor="password">Mật khẩu</label>
            <input type="password" {...register('password')} placeholder="Password" />

            <label htmlFor="dateOfBirth">Ngày sinh</label>
            <input type="date" {...register('dateOfBirth')} />

            <label htmlFor="loactionName">Địa chỉ cư trú</label>
            <input {...register('loactionName')} placeholder="Địa chỉ cư trú" />

            <label htmlFor="roleStaffName">Chức danh</label>
            <input {...register('roleStaffName')} placeholder="Chức danh" />

            <label htmlFor="phone">Số điện thoại</label>
            <input {...register('phone')} placeholder="SĐT" />

            <label htmlFor="typeOfPersonnel">Loại nhân sự</label>
            <input {...register('typeOfPersonnel')} placeholder="Loại nhân sự" />

            <label htmlFor="typeOfContract">Loại hợp đồng</label>
            <input {...register('typeOfContract')} placeholder="Loại hợp đồng" />

            <label htmlFor="cccd">CCCD</label>
            <input {...register('cccd')} placeholder="CCCD" />

            <label htmlFor="statusName">Trạng thái</label>
            <input {...register('statusName')} placeholder="Trạng thái" />

            <div className="form-btn">
              <button type="submit" className="btn-submit">
                {selectedStaff?.code === '0' || mode === 'add' ? 'Tạo mới' : 'Cập nhật'}
              </button>
              <button type="button" onClick={handleCancel} className="btn-cancel">
                Đóng
              </button>
            </div>
          </form>
        </Modal>
      </Box>
    </Spin>
  );
}

export default ListStaff;
