import { DTOCategory } from '../../dtos/dtoCategory.dto';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { Breadcrumb } from 'antd';
import { Checkbox, Modal, Spin } from 'antd';
import { useEffect, useRef, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListAltIcon from '@mui/icons-material/FilterListAlt';
import {
  DeleteCategoryStaffService,
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
import { HomeOutlined } from '@mui/icons-material';
import { getStatus } from '../../../../shared/utilities/status.util';

function listCategory() {
  const calledRef = useRef(false);
  const [rows, setRows] = useState<DTOCategory[]>([]);
  const [mode, setMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedCategory, setSelectedCategory] = useState<DTOCategory | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statuses, setStatuses] = useState<number[]>([]);
  const [search, setSearch] = useState<string>('');
  const [selectedRows, setSelectedRows] = useState<DTOCategory[]>([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const columns: GridColDef<DTOCategory>[] = [
    { field: 'code', headerName: 'Mã danh mục', flex: 1, minWidth: 180 },
    { field: 'name', headerName: 'Tên danh mục', flex: 1, minWidth: 250 },
    { field: 'description', headerName: 'Mô tả', flex: 2, minWidth: 300 },
    {
      field: 'status',
      headerName: 'Trạng thái',
      flex: 1,
      renderCell: (params) => {
        const status = getStatus(params.value);

        return <span className={status.className}>{status.label}</span>;
      },
    },
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

  const formCategori: DTOCategory = {
    _id: '',
    code: '0',
    name: '',
    description: '',
    status: 0,
    statusName: 'Đang chỉnh sửa',
  };

  const { handleSubmit, register, reset, control } = useForm<DTOCategory>({
    defaultValues: formCategori,
  });

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;
    APIGetListCategory();
  }, []);

  // #region Breadcrumb
  function onBreadcrumb() {
    fetchData();
  }

  //#region Modal
  // Mở modal thêm mới
  const addModal = () => {
    setMode('add');
    setSelectedCategory(null);
    reset({ ...formCategori, code: '0' });
    setIsModalOpen(true);
  };

  // Đóng modal
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // Submit form
  const onSubmit = (data: DTOCategory) => {
    if (!utilitiesObjService.hasValueString(data?.name)) {
      notificationService.error('Lỗi: Vui lòng nhập tên danh mục!');
      return;
    }
    if (!utilitiesObjService.hasValueString(data?.description)) {
      notificationService.error('Lỗi: Vui lòng nhập mô tả!');
      return;
    }
    APIUpdateCategory(data);
  };

  // Xử lý option dropdown trạng thái
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
          { label: 'Ngưng hoạt động', value: 2 },
        ];
    }
  };

  // Mở modal xóa nhiều
  const onOpenDeleteModal = () => {
    setOpenDeleteModal(true);
  };

  // Xử lý xóa nhiều
  const handleDeleteArray = (data: DTOCategory[]) => {
    APIDeleteCategory(data);
    setOpenDeleteModal(false);
  };

  //#region Button grid
  // Xử lý cập nhật
  function handleEdit(category: DTOCategory) {
    setMode('edit');
    setSelectedCategory(category);
    reset(category);
    setIsModalOpen(true);
  }

  // Xử lý xóa
  const handleDelete = (item: DTOCategory) => {
    Modal.confirm({
      title: 'XÁC NHẬN',
      content: `Bạn có chắc chắn muốn xóa Danh mục ${item.name} này không?`,
      okText: 'Xóa',
      cancelText: 'Hủy',
      onOk: () => {
        APIDeleteCategory([{ code: item.code } as DTOCategory]);
      },
    });
  };

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

    APIGetListCategory({
      keyword: search,
      status: newStatuses,
    });
  };

  // Xử lý sự kiện khi search
  const onSearch = () => {
    fetchData();
  };

  // Hàm dùng chung để gọi API với filter
  const fetchData = (custom = {}) => {
    APIGetListCategory({
      keyword: search,
      status: statuses,
      ...custom,
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

  //#region API GET LIST CATEGORY
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

  //#region API Update Category
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
        setIsModalOpen(false);
        notificationService.error('Lỗi: Cập nhật danh mục thất bại!');
      });
  }

  //#region API Delete Category
  function APIDeleteCategory(data: DTOCategory[]) {
    setLoading(true);
    DeleteCategoryStaffService(data)
      .then(() => {
        setLoading(false);
        setIsModalOpen(false);
        notificationService.success('Xóa dữ liệu thành công!');
        APIGetListCategory();
      })
      .catch((error) => {
        setIsModalOpen(false);
        setLoading(false);
        notificationService.error('Lỗi: Xóa danh mục thất bại!');
      });
  }

  //#region UI
  return (
    <Spin spinning={loading}>
      <Breadcrumb
        className="breadcrumb"
        items={[
          {
            className: 'breadcrumb-item1',
            title: <HomeOutlined />,
          },
          {
            className: 'breadcrumb-item2',
            title: 'DANH SÁCH DANH MỤC',
            onClick: onBreadcrumb,
          },
        ]}
      />
      <Box className="listCategory-container">
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
                placeholder="Mã, Tên danh mục"
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
                  Đang chỉnh sửa
                </Checkbox>

                <Checkbox
                  checked={statuses.includes(1)}
                  onChange={() => onChangeCheckbox(1)}
                  className="checkbox-item"
                >
                  Hoạt động
                </Checkbox>

                <Checkbox
                  checked={statuses.includes(2)}
                  onChange={() => onChangeCheckbox(2)}
                  className="checkbox-item"
                >
                  Ngưng hoạt động
                </Checkbox>
              </div>
            </div>
          </div>
          <div className="btn-add-container">
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
          isRowSelectable={(params) => params.row.status === 0}
          onRowSelectionModelChange={(selectionModel) => {
            let selected = [];

            if (selectionModel.type === 'include') {
              const ids = Array.from(selectionModel.ids);

              selected = rows.filter((row) => ids.includes(row.code));
              console.log(selected);
            } else {
              const excludedIds = Array.from(selectionModel.ids);

              selected = rows.filter((row) => !excludedIds.includes(row.code));
            }

            setSelectedRows(selected);
          }}
        />
      </Box>
      <Modal
        className="modal-category"
        title="DANH MỤC"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        loading={loading}
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

          <input {...register('name')} placeholder="Tên danh mục đồ uống" className="form-input" 
          disabled={selectedCategory?.status === 1 || selectedCategory?.status === 2}/>

          <label htmlFor="description" className="form-label">
            <p>Mô tả</p>
            <p className="form-label_note">(*)</p>
          </label>
          <input {...register('description')} placeholder="Mô tả" className="form-input" disabled={selectedCategory?.status === 1 || selectedCategory?.status === 2}/>

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
                options={handelOptionDropdown()}
                className="form-dropdown"
              />
            )}
          />

          <div className="form-btn">
            <button type="submit" className="form-btn-submit">
              {selectedCategory?.code === '0' || mode === 'add' ? 'Tạo mới' : 'Cập nhật'}
            </button>
            <button
              type="button"
              className="form-btn-delete"
              onClick={() => {
                if (!selectedCategory) return;
                handleDelete(selectedCategory);
              }}
              hidden={
                selectedCategory?.code === '0' ||
                mode === 'add' ||
                selectedCategory?.status === 1 ||
                selectedCategory?.status === 2
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
        title="XÓA THÔNG TIN"
        onCancel={() => setOpenDeleteModal(false)}
        footer={null}
        centered
        className="modal-delete"
      >
        <Box className="modal">
          <p>
            Bạn đã chọn {selectedRows.length} mục để xóa. Bạn có chắc chắn muốn xóa những mục này
            không?
          </p>

          <Button className="model-btn-delete" onClick={() => handleDeleteArray(selectedRows)}>
            <p className="btn-content">Xác nhận</p>
          </Button>
        </Box>
      </Modal>
    </Spin>
  );
}

export default listCategory;
