import { createHashRouter } from 'react-router';
import AdminLayout from '../layout/AdminLayout';
import FrontendLayout from '../layout/FrontendLayout';
import Home from '../pages/home';
import Rooms from '../pages/rooms';
import Room from '../pages/singleRoom';
import Local from '../pages/local';
import Contact from '../pages/contact';
import Login from '../pages/login';
import HomeStay  from '../pages/admin/homeStay'
import OrderList from '../pages/admin/orderList';
import Souvenirs from '../pages/admin/souvenirs'
import Register from '../pages/admin/register'


export const routes = createHashRouter([
  {
    path: '/',
    element: <FrontendLayout />,
    children: [
    {
      index: true,
      element: <Home />
    },
    {
      path: 'rooms',
      element: <Rooms />
    },
    {
      path: "room/:id",
      element: <Room />,
    },
    {
      path: 'contact',
      element: <Contact />
    },
    {
      path: 'orderList',
      element: <OrderList />
    },
    {
      path: 'local',
      element: <Local />
    },
    {
      path: 'login',
      element: <Login />
    }
  ]
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        path: 'homeStay',
        element: <HomeStay />
      },
      {
        path: 'souvenirs',
        element: <Souvenirs />
      },
      {
        path: 'register',
        element: <Register />
      },
      
      {
        path: 'orderList',
        element: <OrderList />
      },
      
    ]
  }
]);
