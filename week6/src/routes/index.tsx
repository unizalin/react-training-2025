import { createHashRouter } from 'react-router';
import AdminLayout from '../layout/AdminLayout';
import FrontendLayout from '../layout/FrontendLayout';
import Home from '../pages/home';
import Rooms from '../pages/rooms';
import Room from '../pages/singleRoom';
import Locals from '../pages/locals';
import SingleLocal from '../pages/singleLocal';
import Orderlist from '../pages/orderList';
import Contact from '../pages/contact';
import Login from '../pages/login';
import Checkout from '../pages/checkout';
import HomeStay  from '../pages/admin/homeStay'
import AdminOrderList from '../pages/admin/orderList';
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
      path: 'checkout',
      element: <Checkout />
    },
    {
      path: 'orderlist',
      element: <Orderlist />
    },
    {
      path: 'locals',
      element: <Locals />
    },
    {
      path: 'singleLocal/:id',
      element: <SingleLocal />
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
        element: <AdminOrderList />
      },
      
    ]
  }
]);
