import TypeHr from '../../components/typeHr/typeHr';

function TypeOfPersonnel() {
  return (
    <div>
      <TypeHr
        breadcumb="LOẠI HÌNH NHÂN SỰ"
        valueSearch="Mã, Tên loại nhân sự"
        typeData={1}
        form={{
          titleForm: 'Thông tin loại nhân sự',
          field: [
            {
              fieldName: 'code',
              disabledForm: true,
              titleField: 'Mã loại nhân sự',
            },
            {
              fieldName: 'name',
              disabledForm: false,
              titleField: 'Tên loại nhân sự',
            },
          ],
        }}
      />
    </div>
  );
}

export default TypeOfPersonnel;
