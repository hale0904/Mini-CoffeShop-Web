import { useState } from 'react';
import LoginService from '../services/login.service';
import type { Account } from '../dtos/user.dto';
import AuthHelper from '../../../shared/auth/auth.helper';
import './login.scss';
import slider1 from '../../../assets/slider1.jpeg';
import { Alert } from 'antd';
import { Spin } from 'antd';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMsg('Lỗi: Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    const accountDto: Account = {
      email: email,
      password: password,
    };

    try {
      setLoading(true);
      const res = await LoginService(accountDto);
      setSuccessMsg('Đăng nhập thành công!');
      AuthHelper.setTokens({
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
      });
      setLoading(false);
      window.location.href = '/';
    } catch (error) {
      console.error(error);
      setErrorMsg('Đăng nhập thất bại');
      setLoading(false);
    }
  };

  return (
    <Spin spinning={loading}>
      <div className="login-container">
        <div className="login-form">
          <p className="login-form-title">ĐĂNG NHẬP</p>
          <form onSubmit={handleSubmit} className="login-form-content">
            <input
              type="text"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              placeholder="Email"
            />

            <input
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              placeholder="Mật khẩu"
            />

            <button type="submit">Login</button>
          </form>
          {errorMsg && (
            <Alert type="error" message={errorMsg} showIcon style={{ marginBottom: 12 }} />
          )}
          {successMsg && (
            <Alert type="success" message={successMsg} showIcon style={{ marginBottom: 12 }} />
          )}
        </div>
        <div className="login-image">
          <img src={slider1} alt="slider1" />
        </div>
      </div>
    </Spin>
  );
};

export default Login;
