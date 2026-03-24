import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { Modal, Spin } from 'antd';
import { useEffect, useRef, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import FilterListAltIcon from '@mui/icons-material/FilterListAlt';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import { Controller, useForm } from 'react-hook-form';
import { Select } from 'antd';
import './listProduct.scss';
import type { DTOProduct } from '../../dtos/dtoProduct.dto';
import { GetListProductService, UpdateProductStaffService } from '../../services/product.service';

function ListProduct() {
  const calledRef = useRef(false);
  const [rows, setRows] = useState<DTOProduct[]>([]);
  const [mode, setMode] = useState<'add' | 'edit' | 'view'>('add');
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<DTOProduct | null>(null);
  

  const columns: GridColDef<DTOProduct>[] = [
    { field: 'code', headerName: 'Mã sản phẩm', flex: 1, minWidth: 180 },
    { field: 'image', headerName: 'Hình ảnh', flex: 1, minWidth: 150 },
    { field: 'name', headerName: 'Tên sản phẩm', flex: 2, minWidth: 250 },
    { field: 'price', headerName: 'Giá sản phẩm', flex: 1, minWidth: 300 },
    { field: 'statusName', headerName: 'Trạng thái', flex: 1, minWidth: 150 },
    {
      field: 'actions',
      headerName: 'Thao tác',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      minWidth: 180,
      renderCell: (params) => {
        const row = params.row as DTOProduct;

        return (
          <IconButton color="primary" onClick={() => handleEdit(row)}>
            <EditIcon />
          </IconButton>
        );
      },
    },
  ];

  const formProduct: DTOProduct = {
    code: '0',
    name: '',
    price: 0,
    categoryCode: '',
    image: '',
    description: '',
    status: 0,
    statusName: '',
  };

  const { handleSubmit, register, reset, control } = useForm<DTOProduct>({
    defaultValues: formProduct,
  });

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;
    loadStaff();
  }, []);

  const addModal = () => {
    setMode('add');
    reset({ ...formProduct, code: '0' });
    setIsModalOpen(true);
  };

  function handleEdit(product: DTOProduct) {
      setMode('edit');
      setSelectedProduct(product);
      reset(product);
      setIsModalOpen(true);
    }

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const loadStaff = async () => {
    try {
      const payload = {
        page: 1,
        pageSize: 10,
      };
      const res = await GetListProductService(payload);
      const data: DTOProduct[] = res.data;

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

  function APIUpdateCategory(data: DTOProduct) {
      setLoading(true);
      UpdateProductStaffService(data)
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

  const onSubmit = (data: DTOProduct) => {
      if (data.code === '0') {
        // API create
        APIUpdateCategory(data);
      } else {
        // API update
        APIUpdateCategory(data);
      }
    };

  return (
    <Spin spinning={loading}>
      <Box className="listCategory">
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
          disableColumnSorting
          disableColumnMenu
          disableColumnResize
        />
      </Box>
      <Modal
        className="modal-category"
        title="DANH MỤC ĐỒ UỐNG"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
          <label htmlFor="code">Mã sản phẩm</label>
          <input {...register('code')} placeholder="Mã danh mục" disabled />

          <label htmlFor="name">Tên sản phẩm</label>
          <input {...register('name')} placeholder="Tên danh mục đồ uống" />

          <label htmlFor="description">Mô tả</label>
          <input {...register('description')} placeholder="Mô tả" />

          <label htmlFor="statusName">Trạng thái</label>
          <Controller
            name="status"
            control={control}
            defaultValue={1}
            render={({ field }) => (
              <Select
                {...field}
                style={{ width: '100%' }}
                placeholder="Trạng thái"
                onChange={(value) => field.onChange(value)}
              >
                {/* <Option value={1}>Hoạt động</Option>
                <Option value={2}>Ngưng hoạt động</Option> */}
              </Select>
            )}
          />

          <div className="form-btn">
            <button type="submit" className="btn-submit">
              {selectedProduct?.code === '0' || mode === 'add' ? 'Tạo mới' : 'Cập nhật'}
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

export default ListProduct;
