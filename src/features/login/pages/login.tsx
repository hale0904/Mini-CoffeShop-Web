import { useState } from 'react';
import LoginService from '../services/login.service';
import type { Account } from '../dtos/user.dto';
import AuthHelper from '../../../shared/auth/auth.helper';
import './login.scss';
import slider1 from '../../../assets/slider1.jpg';
import { Alert } from 'antd';
import { Spin } from 'antd';
import { utilitiesObjService } from '../../../shared/utilities/utilitiesObjService';
import { notificationService } from '../../../shared/notification';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // Biến form
  const formAccount: Account = {
    email: email,
    password: password,
  };

  // Hàm xử lý submit form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !utilitiesObjService.hasValueString(email) ||
      !utilitiesObjService.hasValueString(password)
    ) {
      notificationService.error('Lỗi: Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    await APILogin();
  };

  // API Login
  const APILogin = async () => {
    try {
      setLoading(true);
      const res = await LoginService(formAccount);
      AuthHelper.setTokens({
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
      });
      setLoading(false);
      notificationService.success('Đăng nhập thành công!');
      navigate('/');
    } catch (error) {
      setLoading(false);
      notificationService.error('Đăng nhập thất bại');
    }
  };

  return (
    <div className="pageLogin">
      <Spin spinning={loading}>
        <div className="login-container">
          <div className="login-form">
            <p className="login-form-title">ĐĂNG NHẬP</p>
            <form onSubmit={handleSubmit} className="login-form-content">
              <label className='login-form-email'>Email</label>
              <input
                className="inputForm"
                type="text"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                placeholder="Email"
              />
              <label className='login-form-pw'>Mật khẩu</label>
              <input
                className="inputForm"
                type="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                placeholder="Mật khẩu"
              />

              <button type="submit">Đăng nhập</button>
            </form>
            {/* {errorMsg && (
              <Alert type="error" message={errorMsg} showIcon style={{ marginBottom: 12 }} />
            )}
            {successMsg && (
              <Alert type="success" message={successMsg} showIcon style={{ marginBottom: 12 }} /> */}
            {/* )} */}
          </div>
          <div className="login-image">
            <img src={slider1} alt="slider1" />
          </div>
        </div>
      </Spin>
    </div>
  );
}

export default Login;
