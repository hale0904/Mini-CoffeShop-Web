import Box from '@mui/material/Box';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { useEffect, useRef, useState } from 'react';
import {
  DeleteStaffService,
  GetListStaffService,
  UpdateStaffService,
} from '../../services/staff.service';
import type { DTOStaff } from '../../dtos/dtoStaff.dto';
import './listStaff.scss';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FilterListAltIcon from '@mui/icons-material/FilterListAlt';
import { Breadcrumb, Checkbox, Modal, Select, Spin } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { HomeOutlined } from '@mui/icons-material';
import { getStatusStaff } from '../../../../shared/utilities/statuStaffs.util';
import { notificationService } from '../../../../shared/notification';
import { GetListTypeHrService } from '../../services/typeHr.service';
import type { DTOTypeHr } from '../../dtos/dtoTypeHr.dto';
import { utilitiesObjService } from '../../../../shared/utilities/utilitiesObjService';

function ListStaff() {
  const calledRef = useRef(false);
  const [rows, setRows] = useState<DTOStaff[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState<DTOStaff[]>([]);
  const [mode, setMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedStaff, setSelectedStaff] = useState<DTOStaff | null>(null);

  // Loading state
  const [loading, setLoading] = useState<boolean>(false);

  // Filter states
  const [statuses, setStatuses] = useState<number[]>([]);
  const [search, setSearch] = useState<string>('');

  // List type hr
  const [listPersonnel, setListPersonnel] = useState<DTOTypeHr[]>([]);
  const [listPosition, setListPosition] = useState<DTOTypeHr[]>([]);
  const [listContract, setListContract] = useState<DTOTypeHr[]>([]);

  const [typeDataPersonnel, setTypeDataPersonnel] = useState<number>(1);
  const [typeDataPosition, setTypeDataPosition] = useState<number>(2);
  const [typeDataContract, setTypeDataContract] = useState<number>(3);

  // Form default values
  const defaultFormValues: DTOStaff = {
    code: '0',
    userName: '',
    email: '',
    dateOfBirth: '',
    loactionName: '',
    typeOfPosition: '',
    phone: 0,
    typeOfPersonnel: '',
    typeOfContract: '',
    cccd: 0,
    status: 0,
    statusName: '',
  };

  // React Hook Form
  const { handleSubmit, register, reset, control } = useForm<DTOStaff>({
    defaultValues: defaultFormValues,
  });

  // Định nghĩa cột cho DataGrid
  const columns: GridColDef<DTOStaff>[] = [
    { field: 'code', headerName: 'Mã', width: 120 },
    { field: 'userName', headerName: 'Tên nhân viên', flex: 1, width: 150 },
    {
      field: 'typeOfPosition',
      headerName: 'Chức danh',
      flex: 1,
      width: 130,
      valueGetter: (_, row) => {
        return listPosition.find((item) => item._id === row.typeOfPosition)?.name || '';
      },
    },
    {
      field: 'typeOfPersonnel',
      headerName: 'Loại nhân sự',
      flex: 1,
      width: 130,
      valueGetter: (_, row) => {
        return listPersonnel.find((item) => item._id === row.typeOfPersonnel)?.name || '';
      },
    },
    {
      field: 'typeOfContract',
      headerName: 'Loại hợp đồng',
      flex: 1,
      width: 130,
      valueGetter: (_, row) => {
        return listContract.find((item) => item._id === row.typeOfContract)?.name || '';
      },
    },
    {
      field: 'status',
      headerName: 'Trạng thái',
      flex: 1,
      renderCell: (params) => {
        const status = getStatusStaff(params.value);

        return <span className={status.className}>{status.label}</span>;
      },
    },
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

            <IconButton
              color="error"
              onClick={() => handleDelete(row)}
              disabled={row.status === 1 || row.status === 2}
            >
              <DeleteIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  // useEffect để gọi API khi component mount
  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;
    APIGetListStaff();
    APIGetListTypeHr({ typeData: typeDataPersonnel, status: 1 });
    APIGetListTypeHr({ typeData: typeDataPosition, status: 1 });
    APIGetListTypeHr({ typeData: typeDataContract, status: 1 });
  }, []);

  // #region Breadcrumb
  function onBreadcrumb() {
    fetchData();
  }

  // #region Search, filter
  // Xử lý sự kiện khi checkbox thay đổi
  const onChangeCheckbox = (status: number) => {
    let newStatuses = [...statuses];

    if (newStatuses.includes(status)) {
      newStatuses = newStatuses.filter((s) => s !== status);
    } else {
      newStatuses.push(status);
    }

    setStatuses(newStatuses);

    APIGetListStaff({
      keyword: search,
      status: newStatuses,
    });
  };

  // Xử lý reset filter
  const handleReset = () => {
    setSearch('');
    setStatuses([]);
    fetchData({
      keyword: '',
      status: [],
    });
  };

  // Xử lý sự kiện khi search
  const onSearch = () => {
    fetchData();
  };

  // Hàm dùng chung để gọi API với filter
  const fetchData = (custom = {}) => {
    APIGetListStaff({
      keyword: search,
      status: statuses,
      ...custom,
    });
  };

  // #region Modal form
  // Xử lý mở modal thêm mới
  const addModal = () => {
    setMode('add');
    setSelectedStaff(null);
    reset({ ...defaultFormValues, code: '0' });
    setIsModalOpen(true);
  };

  // Xử lý đóng modal
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // Xử lý khi submit form (cả tạo mới và cập nhật)
  const onSubmit = (data: DTOStaff) => {
    if (data.code === '0') {
      // API create
      APIupdateStaff(data);
    } else {
      // API update
      APIupdateStaff(data);
    }
  };

  // Hiện thị option dropdown cho loại hình nhân sự
  const handelOptionDropdownPersonnel = () => {
    return listPersonnel
      .filter((item) => item.typeData === typeDataPersonnel)
      .map((item) => ({
        label: item.name,
        value: item.code,
      }));
  };

  // Hiện thị option dropdown cho loại chức danh
  const handelOptionDropdownPosition = () => {
    return listPosition
      .filter((item) => item.typeData === typeDataPosition)
      .map((item) => ({
        label: item.name,
        value: item.code,
      }));
  };

  // Hiện thị option dropdown cho loại hợp đồng
  const handelOptionDropdownContract = () => {
    return listContract
      .filter((item) => item.typeData === typeDataContract)
      .map((item) => ({
        label: item.name,
        value: item.code,
      }));
  };

  // Hiện thị option dropdown cho trạng thái
  const handelOptionDropdown = () => {
    if (mode === 'add') {
      return [{ label: 'Đang chỉnh sửa', value: 0 }];
    }

    switch (selectedStaff?.status) {
      case 0: // Dang chinh sua
        return [
          { label: 'Tuyển dụng', value: 0 },
          { label: 'Đang làm việc', value: 1 },
        ];

      case 1: // đang hoạt động
        return [
          { label: 'Đang làm việc', value: 1 },
          { label: 'Nghỉ việc', value: 2 },
        ];

      case 2: // ngưng hoạt động
        return [
          { label: 'Tuyển dụng', value: 0 },
          { label: 'Đang làm việc', value: 1 },
          { label: 'Nghỉ việc', value: 2 },
        ];
    }
  };

  // Xử lý xóa nhiều
  const handleDeleteArray = (data: DTOStaff[]) => {
    APIDeleteStaff(data);
    setOpenDeleteModal(false);
  };

  //#region Button Grid
  // Xử lý khi click edit
  const handleEdit = (staff: DTOStaff) => {
    setMode('edit');
    setSelectedStaff(staff);
    const personnel = listPersonnel.find((item) => item._id === staff.typeOfPersonnel);

    const position = listPosition.find((item) => item._id === staff.typeOfPosition);

    const contract = listContract.find((item) => item._id === staff.typeOfContract);

    reset({
      ...staff,
      typeOfPersonnel: personnel?.code || '',
      typeOfPosition: position?.code || '',
      typeOfContract: contract?.code || '',
      dateOfBirth: utilitiesObjService.formatDateToInput(staff.dateOfBirth),
    });

    setIsModalOpen(true);
  };

  // Xử lý khi click delete
  const handleDelete = (staff: DTOStaff) => {
    Modal.confirm({
      title: 'XÁC NHẬN',
      content: `Bạn có chắc chắn muốn xóa Danh mục ${staff.userName} này không?`,
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk: () => {
        APIDeleteStaff([{ code: staff.code } as DTOStaff]);
      },
    });
  };

  const onOpenDeleteModal = () => {
    setOpenDeleteModal(true);
  };

  //#region API GET LIST STAFF
  const APIGetListStaff = async (filter = {}) => {
    try {
      setLoading(true);

      const payload = {
        page: 1,
        pageSize: 10,
        ...filter,
      };
      const res = await GetListStaffService(payload);
      const data: DTOStaff[] = res.data;

      // DataGrid bắt buộc phải có id
      const mapped = data.map((item, index) => ({
        ...item,
        id: item.code || index + 1,
      }));

      setRows(mapped);
      setLoading(false);
    } catch (error) {
      notificationService.error('Lỗi: Lấy danh sách nhân viên thất bại');
      setLoading(false);
    }
  };

  // #region API GET LIST TYPE HR
  const APIGetListTypeHr = async (typeData: any) => {
    try {
      setLoading(true);
      const payload = {
        page: 1,
        pageSize: 10,
        ...typeData,
      };
      const res = await GetListTypeHrService(payload);
      const data: DTOTypeHr[] = res.data;
      if (payload.typeData === typeDataPersonnel) {
        setListPersonnel(data);
      }

      if (payload.typeData === typeDataPosition) {
        setListPosition(data);
      }

      if (payload.typeData === typeDataContract) {
        setListContract(data);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      notificationService.error('Lỗi: Lấy danh sách danh mục bị lỗi');
    }
  };

  // #region API UPDATE STAFF
  const APIupdateStaff = (data: DTOStaff) => {
    setLoading(true);
    UpdateStaffService(data)
      .then(() => {
        setLoading(false);
        setIsModalOpen(false);
        fetchData();
        notificationService.success(
          data.code === '0' ? 'Tạo mới nhân viên thành công!' : 'Cập nhật nhân viên thành công!',
        );
      })
      .catch((error) => {
        setIsModalOpen(false);
        setLoading(false);
      });
  };

  // #region API DELETE STAFF
  const APIDeleteStaff = (data: DTOStaff[]) => {
    setLoading(true);
    DeleteStaffService(data)
      .then(() => {
        setLoading(false);
        setIsModalOpen(false);
        notificationService.success('Xóa dữ liệu thành công!');
        fetchData();
      })
      .catch((error) => {
        setLoading(false);
        setIsModalOpen(false);

        notificationService.error('Lỗi: Xóa nhân viên thất bại!');
      });
  };

  //#region UI
  return (
    <Spin spinning={loading}>
      {/* Breadcrumb */}
      <Breadcrumb
        className="breadcrumb"
        items={[
          {
            className: 'breadcrumb-item1',
            title: <HomeOutlined />,
          },
          {
            className: 'breadcrumb-item2',
            title: 'DANH SÁCH NHÂN VIÊN',
            onClick: onBreadcrumb,
          },
        ]}
      />

      <Box className="listStaff">
        {/* Filter */}
        <div className="header">
          <div className="filter-container">
            <div className="filter-content">
              <FilterListAltIcon className="filter-icon" />
              <p className="filter-title">Lọc dữ liệu</p>
            </div>
            <div className="search-field-container">
              Tìm kiếm
              <TextField
                className="search-field"
                variant="outlined"
                placeholder="Mã, Tên nhân viên"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onSearch();
                }}
              />
              <Button className="btn-search" onClick={() => onSearch()}>
                <SearchIcon className="icon-search" />
              </Button>
              <div className="line"> | </div>
              <Button className="btn-reset" onClick={handleReset}>
                Xóa bộ lọc
              </Button>
            </div>
            <div className="checkbox">
              <span className="checkbox-title">Trạng thái:</span>
              <div className="checkbox-container">
                <Checkbox
                  checked={statuses.includes(0)}
                  onChange={() => onChangeCheckbox(0)}
                  className="checkbox-item"
                >
                  Tuyển dụng
                </Checkbox>

                <Checkbox
                  checked={statuses.includes(1)}
                  onChange={() => onChangeCheckbox(1)}
                  className="checkbox-item"
                >
                  Đang làm việc
                </Checkbox>

                <Checkbox
                  checked={statuses.includes(2)}
                  onChange={() => onChangeCheckbox(2)}
                  className="checkbox-item"
                >
                  Nghỉ việc
                </Checkbox>
              </div>
            </div>
          </div>
          <div className="btn-container">
            <button
              className="btn-delete"
              onClick={onOpenDeleteModal}
              hidden={selectedRows.length === 0}
            >
              <DeleteIcon className="icon" />
            </button>
            <button className="btn-add" onClick={addModal}>
              Thêm mới
            </button>
          </div>
        </div>

        {/* Grid */}
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
          isRowSelectable={(params) => params.row.status === 0}
          pageSizeOptions={[10, 20]}
          checkboxSelection
          disableRowSelectionOnClick
          disableColumnSorting
          disableColumnMenu
          disableColumnResize
          onRowSelectionModelChange={(selectionModel) => {
            let selected = [];

            if (selectionModel.type === 'include') {
              const ids = Array.from(selectionModel.ids);

              selected = rows.filter((row) => ids.includes(row.code));
            } else {
              const excludedIds = Array.from(selectionModel.ids);

              selected = rows.filter((row) => !excludedIds.includes(row.code));
            }

            setSelectedRows(selected);
          }}
        />

        {/* Form */}
        <Modal
          className="modal-staff"
          title="NHÂN VIÊN"
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
          loading={loading}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
            <div className="form-group">
              <div className="form-gr-left">
                <label htmlFor="code" className="form-label">
                  Mã nhân viên
                  <p className="form-label_note">(*)</p>
                </label>
                <input
                  {...register('code')}
                  placeholder="Mã nhân viên"
                  className="form-input"
                  disabled
                />
                <label htmlFor="userName" className="form-label">
                  Tên nhân viên
                  <p className="form-label_note">(*)</p>
                </label>
                <input
                  {...register('userName')}
                  placeholder="Tên nhân viên"
                  className="form-input"
                  disabled={selectedStaff?.status === 1 || selectedStaff?.status === 2}
                />
                <label htmlFor="email" className="form-label">
                  Email
                  <p className="form-label_note">(*)</p>
                </label>
                <input
                  {...register('email')}
                  placeholder="Email"
                  className="form-input"
                  disabled={selectedStaff?.status === 1 || selectedStaff?.status === 2}
                />
                <label htmlFor="dateOfBirth" className="form-label">
                  Ngày sinh
                  <p className="form-label_note">(*)</p>
                </label>
                <input
                  type="date"
                  {...register('dateOfBirth', {
                    setValueAs: (value) => (value ? new Date(value) : null),
                  })}
                  className="form-input"
                  disabled={selectedStaff?.status === 1 || selectedStaff?.status === 2}
                />
                <label htmlFor="loactionName" className="form-label">
                  Địa chỉ cư trú
                  <p className="form-label_note">(*)</p>
                </label>
                <input
                  {...register('loactionName')}
                  placeholder="Địa chỉ cư trú"
                  className="form-input"
                  disabled={selectedStaff?.status === 1 || selectedStaff?.status === 2}
                />
                <label htmlFor="phone" className="form-label">
                  Số điện thoại
                  <p className="form-label_note">(*)</p>
                </label>
                <input
                  {...register('phone')}
                  placeholder="SĐT"
                  className="form-input"
                  type="number"
                  min={0}
                  disabled={selectedStaff?.status === 1 || selectedStaff?.status === 2}
                />
              </div>

              <div className="form-gr-right">
                <label htmlFor="cccd" className="form-label">
                  CCCD
                  <p className="form-label_note">(*)</p>
                </label>
                <input
                  {...register('cccd')}
                  placeholder="CCCD"
                  className="form-input"
                  type="number"
                  min={0}
                  disabled={selectedStaff?.status === 1 || selectedStaff?.status === 2}
                />

                <label htmlFor="typeOfPersonnel" className="form-label">
                  <p>Loại hình nhân sự</p>
                  <p className="form-label_note">(*)</p>
                </label>
                <Controller
                  name="typeOfPersonnel"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      style={{ width: '100%' }}
                      placeholder="Loại hình nhân sự"
                      onChange={(value) => field.onChange(value)}
                      value={field.value || undefined}
                      // disabled={mode === 'add'}
                      options={handelOptionDropdownPersonnel()}
                      className="form-dropdown"
                    />
                  )}
                  disabled={selectedStaff?.status === 1 || selectedStaff?.status === 2}
                />

                <label htmlFor="typeOfPosition" className="form-label">
                  <p>Loại chức danh</p>
                  <p className="form-label_note">(*)</p>
                </label>
                <Controller
                  name="typeOfPosition"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      style={{ width: '100%' }}
                      placeholder="Loại chức danh"
                      onChange={(value) => field.onChange(value)}
                      value={field.value || undefined}
                      // disabled={mode === 'add'}
                      options={handelOptionDropdownPosition()}
                      className="form-dropdown"
                    />
                  )}
                  disabled={selectedStaff?.status === 1 || selectedStaff?.status === 2}
                />

                <label htmlFor="typeOfContract" className="form-label">
                  <p>Loại hợp đồng</p>
                  <p className="form-label_note">(*)</p>
                </label>
                <Controller
                  name="typeOfContract"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      style={{ width: '100%' }}
                      placeholder="Loại hợp đồng"
                      onChange={(value) => field.onChange(value)}
                      value={field.value || undefined}
                      // disabled={mode === 'add'}
                      options={handelOptionDropdownContract()}
                      className="form-dropdown"
                    />
                  )}
                  disabled={selectedStaff?.status === 1 || selectedStaff?.status === 2}
                />

                <label htmlFor="statusName" className="form-label">
                  <p>Trạng thái</p>
                  <p className="form-label_note">(*)</p>
                </label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      style={{ width: '100%' }}
                      placeholder="Trạng thái"
                      onChange={(value) => field.onChange(value)}
                      value={field.value}
                      // disabled={mode === 'add'}
                      options={handelOptionDropdown()}
                      className="form-dropdown"
                    />
                  )}
                />
              </div>
            </div>

            <div className="form-btn">
              <button type="submit" className="form-btn-submit">
                {selectedStaff?.code === '0' || mode === 'add' ? 'Tạo mới' : 'Cập nhật'}
              </button>
              <button
                type="button"
                className="form-btn-delete"
                onClick={() => {
                  if (!selectedStaff) return;
                  handleDelete(selectedStaff);
                }}
                hidden={
                  selectedStaff?.code === '0' ||
                  mode === 'add' ||
                  selectedStaff?.status === 1 ||
                  selectedStaff?.status === 2
                }
              >
                Xóa
              </button>
              <button type="button" onClick={handleCancel} className="btn-cancel">
                Đóng
              </button>
            </div>
          </form>
        </Modal>
        <Modal
          open={openDeleteModal}
          title="XÓA NHÂN VIÊN"
          onCancel={() => setOpenDeleteModal(false)}
          footer={null}
          centered
          className="modal-delete"
        >
          <Box className="modal">
            <p>
              Bạn đã chọn {selectedRows.length} nhân viên. Bạn có chắc chắn muốn xóa nhân viên này
              không?
            </p>

            <Button className="model-btn-delete" onClick={() => handleDeleteArray(selectedRows)}>
              <p className="btn-content">Xác nhận</p>
            </Button>
          </Box>
        </Modal>
      </Box>
    </Spin>
  );
}

export default ListStaff;
