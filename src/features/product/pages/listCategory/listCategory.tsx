import { DTOCategory } from '../../dtos/dtoCategory.dto';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { Checkbox, Modal, Spin } from 'antd';
import { useEffect, useRef, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListAltIcon from '@mui/icons-material/FilterListAlt';
import {
  GetListCategoryService,
  UpdateCategoryStaffService,
} from '../../services/category.service';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import { Controller, useForm } from 'react-hook-form';
import './listCategory.scss';
import { Select } from 'antd';
import { notificationService } from '../../../../shared/notification';
import { utilitiesObjService } from '../../../../shared/utilities/utilitiesObjService';

function listCategory() {
  const calledRef = useRef(false);
  const [rows, setRows] = useState<DTOCategory[]>([]);
  const [mode, setMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedCategory, setSelectedCategory] = useState<DTOCategory | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkboxEdit, setCheckboxEdit] = useState<boolean>(false);
  const [checkboxActive, setCheckboxActive] = useState<boolean>(false);
  const [checkboxNotActive, setCheckboxNotActive] = useState<boolean>(false);
  const [name, setName] = useState('');

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;
    APIGetListCategory();
  }, []);

  const columns: GridColDef<DTOCategory>[] = [
    { field: 'code', headerName: 'Mã danh mục', flex: 1, minWidth: 180 },
    { field: 'name', headerName: 'Tên danh mục', flex: 1, minWidth: 250 },
    { field: 'description', headerName: 'Mô tả', flex: 2, minWidth: 300 },
    { field: 'statusName', headerName: 'Trạng thái', flex: 1, minWidth: 150 },
    {
      field: 'actions',
      headerName: 'Thao tác',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      minWidth: 180,
      renderCell: (params) => {
        const row = params.row as DTOCategory;

        return (
          <>
            <IconButton color="warning" onClick={() => handleEdit(row)}>
              <EditIcon />
            </IconButton>

            <IconButton color="error" onClick={() => console.log()}>
              <DeleteIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  const formCategori: DTOCategory = {
    code: '0',
    name: '',
    description: '',
    status: 0,
    statusName: 'Đang chỉnh sửa',
  };

  const { handleSubmit, register, reset, control } = useForm<DTOCategory>({
    defaultValues: formCategori,
  });

  const addModal = () => {
    setMode('add');
    reset({ ...formCategori, code: '0' });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  function handleEdit(category: DTOCategory) {
    setMode('edit');
    setSelectedCategory(category);
    reset(category);
    setIsModalOpen(true);
  }

  const onSubmit = (data: DTOCategory) => {
    if (!utilitiesObjService.hasValueString(formCategori.name)) {
      notificationService.error('Lỗi: Vui lòng nhập tên danh mục!');
      return;
    }
    if (!utilitiesObjService.hasValueString(formCategori.description)) {
      notificationService.error('Lỗi: Vui lòng nhập mô tả!');
      return;
    }
    if (data.code === '0') {
      // API create
      APIUpdateCategory(data);
    } else {
      // API update
      APIUpdateCategory(data);
    }
  };

  const handelOptionDropdown = () => {
    if (mode === 'add') {
      return [{ label: 'Đang chỉnh sửa', value: 0 }];
    }

    switch (selectedCategory?.status) {
      case 0: // Dang chinh sua
        return [
          { label: 'Đang chỉnh sửa', value: 0 },
          { label: 'Đang Hoạt động', value: 1 },
        ];

      case 1: // đang hoạt động
        return [
          { label: 'Đang Hoạt động', value: 1 },
          { label: 'Ngưng hoạt động', value: 2 },
        ];

      case 2: // ngưng hoạt động
        return [
          { label: 'Đang chỉnh sửa', value: 0 },
          { label: 'Đang Hoạt động', value: 1 },
        ];
    }
  };

  const onChangeCheckbox = (e: any, status: number) => {
    const checked = e.target.checked;
    const dataCategory = new DTOCategory();

    if (status === 0) {
      setCheckboxEdit(checked);

      if (checked) {
        dataCategory.status = 0;
        APIGetListCategory(dataCategory);
      }
    }

    if (status === 1) {
      setCheckboxActive(checked);
      if (checked) {
        dataCategory.status = 1;
        APIGetListCategory(dataCategory);
      }
    }

    if (status === 2) {
      setCheckboxNotActive(checked);

      if (checked) {
        dataCategory.status = 2;
        APIGetListCategory(dataCategory);
      }
    }
  };

  const onSearch = (name: string) => {
    const dataCategory = new DTOCategory();
    dataCategory.name = name;
    APIGetListCategory(dataCategory);
  };

  // #region API

  // API GETLIST
  const APIGetListCategory = async (filter = {}) => {
    try {
      setLoading(true);
      const payload = {
        page: 1,
        pageSize: 10,
        ...filter,
      };
      const res = await GetListCategoryService(payload);
      const data: DTOCategory[] = res.data;

      // DataGrid bắt buộc phải có id
      const mapped = data.map((item, index) => ({
        ...item,
        id: item.code || index + 1,
      }));

      setRows(mapped);
      setLoading(false);
    } catch (error) {
      notificationService.error('Lỗi: Lấy danh sách danh mục bị lỗi');
    }
  };

  // API UpdateCategory
  function APIUpdateCategory(data: DTOCategory) {
    setLoading(true);
    UpdateCategoryStaffService(data)
      .then(() => {
        setIsModalOpen(false);
        setLoading(false);
        APIGetListCategory();
      })
      .catch((error) => {
        setLoading(false);
        notificationService.error('Lỗi: Cập nhật danh mục thất bại!', error);
      });
  }

  return (
    <Spin spinning={loading}>
      <Box className="listCategory-container">
        <div className="header">
          <div className="filter-container">
            <div className="filter-content">
              <FilterListAltIcon className="filter-icon" />
              Lọc dữ liệu
            </div>
            <div className="search-field-container">
              Tìm kiếm
              <TextField
                className="search-field"
                variant="outlined"
                placeholder="Tên"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Button className="btn-search" onClick={() => onSearch(name)}>
                <SearchIcon className="icon-search" />
              </Button>
            </div>
            <div className="checkbox">
              <span className="checkbox-title">Trạng thái:</span>
              <div className="checkbox-container">
                <Checkbox
                  checked={checkboxEdit}
                  onChange={(e) => onChangeCheckbox(e, 0)}
                  className="checkbox-item"
                >
                  Đang chỉnh sửa
                </Checkbox>

                <Checkbox
                  checked={checkboxActive}
                  onChange={(e) => onChangeCheckbox(e, 1)}
                  className="checkbox-item"
                >
                  Hoạt động
                </Checkbox>

                <Checkbox
                  checked={checkboxNotActive}
                  onChange={(e) => onChangeCheckbox(e, 2)}
                  className="checkbox-item"
                >
                  Ngưng hoạt động
                </Checkbox>
              </div>
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
          disableColumnSorting
          disableColumnMenu
          disableColumnResize
        />
      </Box>
      <Modal
        className="modal-category"
        title="DANH MỤC"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
          <label htmlFor="code" className="form-label">
            Mã danh mục
          </label>
          <input {...register('code')} placeholder="Mã danh mục" disabled className="form-input" />

          <label htmlFor="name" className="form-label">
            <p>Tên danh mục đồ uống</p>
            <p className="form-label_note">(*)</p>
          </label>

          <input {...register('name')} placeholder="Tên danh mục đồ uống" className="form-input" />

          <label htmlFor="description" className="form-label">
            <p>Mô tả</p>
            <p className="form-label_note">(*)</p>
          </label>
          <input {...register('description')} placeholder="Mô tả" className="form-input" />

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
                disabled={mode === 'add'}
                options={handelOptionDropdown()}
              />
            )}
          />

          <div className="form-btn">
            <button type="submit" className="form-btn-submit">
              {selectedCategory?.code === '0' || mode === 'add' ? 'Tạo mới' : 'Cập nhật'}
            </button>
            <button type="button" onClick={handleCancel} className="btn-cancel">
              Đóng
            </button>
          </div>
        </form>
      </Modal>
    </Spin>
  );
}

export default listCategory;
