import { Modal, Spin } from 'antd';
import Box from '@mui/material/Box';
import { useEffect, useRef, useState } from 'react';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import FilterListAltIcon from '@mui/icons-material/FilterListAlt';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import type { DTOUserAccount } from '../../dtos/dtoUser.dto';
import { GetListAccountService, UpdateAccountService } from '../../services/accountUser.service';
import { useForm } from 'react-hook-form';
import { Dropdown } from 'antd';

function ListAccount() {
  const calledRef = useRef(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<DTOUserAccount[]>([]);
  const [selectedRow, setSelectedRow] = useState<DTOUserAccount | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<'add' | 'edit' | 'view'>('add');

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;
    loadAccount();
  }, []);

  const columns: GridColDef<DTOUserAccount>[] = [
    { field: 'code', headerName: 'Mã tài khoản', width: 140 },
    { field: 'email', headerName: 'Email', width: 220 },
    { field: 'statusName', headerName: 'Trạng thái', width: 170 },
    {
      field: 'actions',
      headerName: 'Thao tác',
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const row = params.row as DTOUserAccount;

        return (
          <IconButton color="primary" onClick={() => handleEdit(row)}>
            <EditIcon />
          </IconButton>
        );
      },
    },
  ];

  const defaultFormValues: DTOUserAccount = {
    code: '0',
    email: '',
    password: '',
    roleCode: '',
    staffCode: '',
    status: 0,
    statusName: '',
  };

  const { handleSubmit, register, reset } = useForm<DTOUserAccount>({
    defaultValues: defaultFormValues,
  });

  function handleEdit(staff: DTOUserAccount) {
    setMode('edit');
    setSelectedRow(staff);
    reset(staff);
    setIsModalOpen(true);
  }

  const loadAccount = async () => {
    try {
      const payload = {
        page: 1,
        pageSize: 10,
      };

      const res = await GetListAccountService(payload);
      const data: DTOUserAccount[] = res.data;

      // DataGrid bắt buộc phải có id
      const mapped = data.map((item, index) => ({
        ...item,
        id: item.code || index + 1,
      }));

      setRows(mapped);
    } catch (error) {
      console.error('Load account error:', error);
    }
  };

  // API Update Account user
  async function APIUpdateAccount(data: DTOUserAccount) {
    try {
      setLoading(true);
      await UpdateAccountService(data);
      setIsModalOpen(false);
      loadAccount();
    } catch (error) {
      console.error('Update account error:', error);
    } finally {
      setLoading(false);
    }
  }

  const addModal = () => {
    setSelectedRow(null);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onSubmit = (data: DTOUserAccount) => {
    if (data.code === '0') {
      // API create
      APIUpdateAccount(data);
    } else {
      // API update
      APIUpdateAccount(data);
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
              <Button className="btn-search">
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
          title="TÀI KHOẢN NHÂN VIÊN"
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
            <label htmlFor="code">Mã nhân viên</label>
            <input {...register('code')} placeholder="Mã nhân viên" />

            <label htmlFor="email">Email</label>
            <input {...register('email')} placeholder="Email" />

            <label htmlFor="password">Mật khẩu</label>
            <input {...register('password')} placeholder="Mật khẩu" />

            <label htmlFor="staffCode">Tên nhân viên</label>
            <Dropdown></Dropdown>

            <div className="form-btn">
              <button type="submit" className="btn-submit">
                {selectedRow?.code === '0' || mode === 'add' ? 'Tạo mới' : 'Cập nhật'}
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

export default ListAccount;
