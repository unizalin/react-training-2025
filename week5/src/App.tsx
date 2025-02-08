import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { useEffect, useState } from 'react'
import Sidebar from "./component/sideBar";
import HomeStay from "./pages/homeStay";
import Souvenirs from "./pages/souvenirs";
import Register from "./pages/register";
import OrderList from "./pages/orderList";

import axios from "axios";

function App() {
  interface User {
    username: string;
    password: string;
  }
  const [user, setUser] = useState<User>({
    username: '',
    password: ''
  })
  const [isLogin, setIsLogin] = useState<boolean>(false)

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    async function initialize() {
      await checkLogin();
    }
    initialize();
  }, [])

  const handleLogin = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const {name,value} = e.target
    setUser({
      ...user,
      [name]: value
    })
  }
  async function login() {
    try {
      const signInRes = await axios.post(`${apiUrl}admin/signin`,user)
      const { token, expired } = signInRes.data
      document.cookie = `hexToken=${token};expires=${new Date(expired)};`;
      axios.defaults.headers.common.Authorization = `${token}`;
      if(signInRes.status == 200){
        setIsLogin(true)
      }
    } catch (error) {
      console.log('login error :'+error)
    }
  }

  async function checkLogin () {
    try {
      const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("hexToken="))
      ?.split("=")[1];
      axios.defaults.headers.common.Authorization = token;

      const checkRes = await axios.post(`${apiUrl}api/user/check`)
      if(checkRes.status == 200){
        setIsLogin(true)
      }else{
        setIsLogin(false)
      }
      console.log('checkRes',checkRes)
    } catch (error) {
      console.log('checkLogin error :'+error)
    }
  }

  return (
    <>
     <Router>
      {!isLogin?
      <div className='h-100vh d-flex justify-content-center align-items-center'>
        <form>
          <div className="card">
            <div className="mb-3">
              <label htmlFor="usernameInput"  className="form-label">username</label>
              <input type="text" name="username" className="form-control" id="usernameInput" placeholder="name@example.com" value={user.username} onChange={handleLogin}
              autoComplete="username"/>
            </div>
            <div className="mb-3">
              <label htmlFor="passwordInput" className="form-label">password</label>
              <input type="password" name="password" className="form-control" id="passwordInput" value={user.password} onChange={handleLogin} autoComplete="current-password"/>
            </div>
            <button className='btn btn-primary' onClick={login}>Login</button>
          </div>
        </form>
      </div>
      :
      <div className='d-flex h-100vh'>
        {/**Sidebar*/}
        <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark" style={{ width: '280px' }}>
          <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
            <span className="fs-4">JINGHOUSE</span>
          </a>
          <hr />
          <Sidebar></Sidebar>
        </div>
        {/**content*/}
        <div className='container p-4'>
          <Routes>
            <Route path="/homeStay" element={<HomeStay />} />
            <Route path="/souvenirs" element={<Souvenirs />} />
            <Route path="/register" element={<Register />} />
            <Route path="/orderList" element={<OrderList />} />
          </Routes>
        </div>
      </div>}
      </Router>
    </>
  )
}

export default App
