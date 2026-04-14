import TypeHr from "../../components/typeHr/typeHr";

function TypeOfContract() {
  return (
    <div>
      <TypeHr
        breadcumb="LOẠI HỢP ĐỒNG"
        valueSearch="Mã, Tên loại hợp đồng"
        typeData={3}
        form={{
          titleForm: 'THÔNG TIN LOẠI HỢP ĐỒNG',
          field: [
            {
              fieldName: 'code',
              disabledForm: true,
              titleField: 'Mã loại hợp đồng',
            },
            {
              fieldName: 'name',
              disabledForm: false,
              titleField: 'Tên loại hợp đồng',
            },
          ],
        }}
      />
    </div>
  )
}

export default TypeOfContract;
