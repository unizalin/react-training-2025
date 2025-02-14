import { useEffect } from 'react'
import { useNavigate } from "react-router";

import { Outlet } from "react-router";
import SideBar from "../components/admin/sideBar";

import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

function AdminLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    checkLogin();
  }, [])

  async function checkLogin () {
    try {
      const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("hexToken="))
      ?.split("=")[1];
      axios.defaults.headers.common.Authorization = token;

      const checkRes = await axios.post(`${apiUrl}api/user/check`)

      console.log('checkRes',checkRes)
      if(checkRes.status != 200){
        navigate("/login");
      }

    } catch (error) {
      console.log('checkLogin error :'+error)
    }
  }

  return (
    <div>
      <main className="d-flex">
        <SideBar/>
        <Outlet />
      </main>
      <footer className="mt-5 text-center">
        <p>© 2024 我的網站</p>
      </footer>
    </div>
  );
}

export default AdminLayout;