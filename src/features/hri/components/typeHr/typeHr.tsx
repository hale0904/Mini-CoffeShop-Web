import { HomeOutlined } from '@mui/icons-material';
import { Breadcrumb, Checkbox, Modal, Select, Spin } from 'antd';
import './typeHr.scss';
import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import FilterListAltIcon from '@mui/icons-material/FilterListAlt';
import { Controller, useForm } from 'react-hook-form';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  DeleteTypeHrService,
  GetListTypeHrService,
  UpdateTypeHrService,
} from '../../services/typeHr.service';
import type { DTOTypeHr } from '../../dtos/dtoTypeHr.dto';
import { notificationService } from '../../../../shared/notification';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import { getStatus } from '../../../../shared/utilities/status.util';
import { utilitiesObjService } from '../../../../shared/utilities/utilitiesObjService';

type TypeHrProps = {
  breadcumb: string;
  valueSearch: string;
  typeData: number;
  form?: {
    titleForm: string;
    field: {
      fieldName: keyof DTOTypeHr;
      disabledForm: boolean;
      titleField: string;
    }[];
  };
};

const TypeHr = ({ breadcumb, valueSearch, typeData, form }: TypeHrProps) => {
  const calledRef = useRef(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [statuses, setStatuses] = useState<number[]>([]);
  const [rows, setRows] = useState<DTOTypeHr[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedTypeHr, setSelectedTypeHR] = useState<DTOTypeHr | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState<DTOTypeHr[]>([]);

  // Định nghĩa cột cho DataGrid
  const columns: GridColDef<DTOTypeHr>[] = [
    {
      field: 'code',
      headerName: form?.field?.find((f) => f.fieldName === 'code')?.titleField || 'Mã',
      minWidth: 250,
    },
    {
      field: 'name',
      headerName: form?.field?.find((f) => f.fieldName === 'name')?.titleField || 'Tên',
      flex: 1,
    },
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
        const row = params.row as DTOTypeHr;

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

  // Form default values
  const formTypeHr: DTOTypeHr = {
    _id: '',
    code: '0',
    name: '',
    status: 0,
    statusName: 'Đang chỉnh sửa',
    typeData: typeData,
  };

  // React Hook Form
  const { handleSubmit, register, reset, control } = useForm<DTOTypeHr>({
    defaultValues: formTypeHr,
  });

  // useEffect để gọi API khi component mount
  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;
    fetchData();
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

    APIGetListTypeHr({
      typeData: typeData,
      keyword: search,
      status: newStatuses,
    });
  };

  // Xử lý sự kiện khi search
  const onSearch = () => {
    fetchData();
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

  // Hàm dùng chung để gọi API với filter
  const fetchData = (custom = {}) => {
    APIGetListTypeHr({
      typeData: typeData,
      keyword: search,
      status: statuses,
      ...custom,
    });
  };

  // #region Button grid
  // Xử lý cập nhật
  const handleEdit = (typeHe: DTOTypeHr) => {
    setMode('edit');
    setSelectedTypeHR(typeHe);
    reset(typeHe);
    setIsModalOpen(true);
  };

  // Xử lý xóa
  const handleDelete = (typeHr: DTOTypeHr) => {
    Modal.confirm({
      title: 'XÁC NHẬN',
      content: `Bạn có chắc chắn muốn xóa Danh mục ${typeHr.name} này không?`,
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk: () => {
        APIDeleteTypeHr([{ code: typeHr.code } as DTOTypeHr]);
      },
    });
  };

  //#region Modal Form
  // Xử lý mở modal thêm mới
  const addModal = () => {
    setMode('add');
    setSelectedTypeHR(null);
    reset({ ...formTypeHr, code: '0' });
    setIsModalOpen(true);
  };

  // Xử lý đóng modal
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // Hàm xử lý logic options dropdown trạng thái
  const handelOptionDropdown = () => {
    if (mode === 'add') {
      return [{ label: 'Đang chỉnh sửa', value: 0 }];
    }

    switch (selectedTypeHr?.status) {
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

  // Hàm xử lý submit form
  const onSubmit = (data: DTOTypeHr) => {
    if (!utilitiesObjService.hasValueString(data.name)) {
      notificationService.error('Lỗi: Vui lòng nhập tên!');
      return;
    }
    APIUpdateTypeHr(data);
  };

  // Mở modal xóa nhiều
  const onOpenDeleteModal = () => {
    setOpenDeleteModal(true);
  };

  // Xử lý xóa nhiều
  const handleDeleteArray = (data: DTOTypeHr[]) => {
    APIDeleteTypeHr(data);
    setOpenDeleteModal(false);
  };

  // #region API GET LIST
  const APIGetListTypeHr = async (filter = {}) => {
    try {
      setLoading(true);
      const payload = {
        page: 1,
        pageSize: 10,
        ...filter,
        typeData,
      };
      const res = await GetListTypeHrService(payload);
      const data: DTOTypeHr[] = res.data;

      // DataGrid bắt buộc phải có id
      const mapped = data.map((item, index) => ({
        ...item,
        id: item.code || index + 1,
      }));

      setRows(mapped);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      notificationService.error('Lỗi: Lấy danh sách danh mục bị lỗi');
    }
  };

  // #region API UPDATE
  function APIUpdateTypeHr(data: DTOTypeHr) {
    setLoading(true);
    UpdateTypeHrService(data)
      .then(() => {
        setIsModalOpen(false);
        setLoading(false);
        APIGetListTypeHr();
      })
      .catch((error) => {
        setLoading(false);
        setIsModalOpen(false);
        notificationService.error('Lỗi: Cập nhật danh mục thất bại!');
      });
  }

  // #region API DELETE
  const APIDeleteTypeHr = (data: DTOTypeHr[]) => {
    setLoading(true);
    DeleteTypeHrService(data)
      .then(() => {
        setLoading(false);
        setIsModalOpen(false);
        notificationService.success('Xóa dữ liệu thành công!');
        APIGetListTypeHr();
      })
      .catch((error) => {
        setLoading(false);
        setIsModalOpen(false);
        notificationService.error('Lỗi: Xóa danh mục thất bại!');
      });
  };

  //#region UI
  return (
    <Spin spinning={loading}>
      <Breadcrumb
        className="breadcrumb"
        items={[
          {
            className: 'breadcrumb-itemA',
            title: <HomeOutlined />,
          },
          {
            className: 'breadcrumb-itemB',
            title: breadcumb,
            onClick: onBreadcrumb,
          },
        ]}
      />
      <div className="typeHr">
        <Box className="typeHr-container">
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
                  placeholder={valueSearch}
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
          className="modal-typeHr"
          title={form?.titleForm}
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
          loading={loading}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
            {form?.field.map((item) => {
              const name = item.fieldName;

              return (
                <div key={String(name)} className="form-container">
                  <label htmlFor={String(name)} className="form-container-label">
                    {item.titleField}
                    <p className="form-label_note">(*)</p>
                  </label>

                  <input
                    id={String(name)}
                    {...register(name)}
                    placeholder={item.titleField}
                    // disabled={item.disabledForm}
                    className="form-container-input"
                    disabled={
                      selectedTypeHr?.status === 1 ||
                      selectedTypeHr?.status === 2 ||
                      item.disabledForm
                    }
                  />
                </div>
              );
            })}

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
                  className="form-dropdown"
                />
              )}
            />

            <div className="form-btn">
              <button type="submit" className="form-btn-submit">
                {selectedTypeHr?.code === '0' || mode === 'add' ? 'Tạo mới' : 'Cập nhật'}
              </button>
              <button
                type="button"
                className="form-btn-delete"
                onClick={() => {
                  if (!selectedTypeHr) return;
                  handleDelete(selectedTypeHr);
                }}
                hidden={
                  selectedTypeHr?.code === '0' ||
                  mode === 'add' ||
                  selectedTypeHr?.status === 1 ||
                  selectedTypeHr?.status === 2
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
      </div>
    </Spin>
  );
};

export default TypeHr;
