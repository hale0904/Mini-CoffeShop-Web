import TypeHr from "../../components/typeHr/typeHr";

function TypeOfPosition() {
  return (
    <div>
      <TypeHr
        breadcumb="LOẠI CHỨC DANH"
        valueSearch="Mã, Tên loại chức danh"
        typeData={2}
        form={{
          titleForm: 'THÔNG TIN LOẠI CHỨC DANH',
          field: [
            {
              fieldName: 'code',
              disabledForm: true,
              titleField: 'Mã loại chức danh',
            },
            {
              fieldName: 'name',
              disabledForm: false,
              titleField: 'Tên loại chức danh',
            },
          ],
        }}
      />
    </div>
  )
}

export default TypeOfPosition;
