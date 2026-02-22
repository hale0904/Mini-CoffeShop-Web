import { useState } from 'react';
import LoginService from '../services/login.service';
import type { Account } from '../types/account.types';
import AuthHelper from '../../../shared/auth/auth.helper';
import './login.scss';
import slider1 from '../../../assets/slider1.jpeg';

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username || !password) {
      alert('Please fill in all fields');
      return;
    }

    const accountDto: Account = {
      email: username,
      password: password,
    };

    try {
      const res = await LoginService(accountDto);
      console.log('Login success:', res);
      alert('Login success');
      AuthHelper.setTokens({
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
      });
      window.location.href = '/';
    } catch (error) {
      console.error(error);
      alert('Login failed');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
            placeholder="Username"
          />

          <input
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            placeholder="Password"
          />

          <button type="submit">Login</button>
        </form>
      </div>
      <div className="login-image">
        <img src={slider1} alt="slider1" />
      </div>
    </div>
  );
};

export default Login;
