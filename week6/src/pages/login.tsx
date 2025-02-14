import { useState } from 'react'
import { useNavigate } from "react-router";

import axios from "axios";
// API URL
const apiUrl = import.meta.env.VITE_API_URL;

interface User {
  username: string;
  password: string;
}

function Login(){ 
  const navigate = useNavigate();

  const [user, setUser] = useState<User>({
    username: '',
    password: ''
  })

  const handleLogin = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const {name,value} = e.target
    setUser({
      ...user,
      [name]: value
    })
  }
  async function login(event: React.FormEvent<HTMLFormElement>) {
    try {
      event.preventDefault();
      console.log('login',user)
      const signInRes = await axios.post(`${apiUrl}admin/signin`,user)
      console.log('signInRes',signInRes)
      const { token, expired } = signInRes.data
      document.cookie = `hexToken=${token};expires=${new Date(expired)};`;
      axios.defaults.headers.common.Authorization = `${token}`;

      navigate("/admin/homeStay");
    } catch (error) {
      console.log('login error :'+error)
    }
  }

  return (
    <div className='vh-100 d-flex justify-content-center align-items-center'>
      <form onSubmit={login} method='post'>
        <div className="card p-4">
          <div className="mb-3">
            <label htmlFor="usernameInput"  className="form-label">信箱</label>
            <input type="text" name="username" className="form-control" id="usernameInput" placeholder="name@example.com" value={user.username} onChange={handleLogin}
            autoComplete="username"/>
          </div>
          <div className="mb-3">
            <label htmlFor="passwordInput" className="form-label">密碼</label>
            <input type="password" name="password" className="form-control" id="passwordInput" value={user.password} onChange={handleLogin} autoComplete="current-password"/>
          </div>
          <button  type="submit" className='btn btn-primary'>登入</button>
        </div>
      </form>
    </div>
  );

}

export default Login;