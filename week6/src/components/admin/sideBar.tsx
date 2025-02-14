import { Link, useLocation } from "react-router";

const SideBar = () => {
  const location = useLocation();

  return (
    <ul className="vh-100 p-4 bg-dark nav nav-pills flex-column mb-auto">
      <li className="nav-item">
        <Link to="/admin/homeStay" className={`nav-link text-white ${location.pathname == '/admin/homeStay' ? 'active': ''}`} aria-current={location.pathname == '/admin/homeStay' ? 'page' : undefined}>
          民宿資訊
        </Link>
      </li>
      <li className="nav-item ">
        <Link to="/admin/souvenirs" className={`nav-link ${location.pathname == '/admin/souvenirs' ? 'active': ''} text-white
        `} aria-current={location.pathname == '/admin/souvenirs' ? 'page' : undefined}>
          伴手禮資訊
        </Link>
      </li>
      <li>
        <a href="#" className="nav-link text-white">
          客人資訊
        </a>
      </li>
      <li>
        <a href="#" className="nav-link text-white">
          備品資訊
        </a>
      </li>
      <li>
        <Link to="/" className="nav-link text-white">
          回商品頁面
        </Link>
      </li>
      <hr />
      <li className="nav-item ">
        <Link to="/admin/register" className={`nav-link ${location.pathname == '/register' ? 'active': ''} text-white
        `} aria-current={location.pathname == '/register' ? 'page' : undefined}>
          伴手禮購買
        </Link>
      </li>
      <li className="nav-item ">
        <Link to="/admin/orderList" className={`nav-link ${location.pathname == '/orderList' ? 'active': ''} text-white
        `} aria-current={location.pathname == '/orderList' ? 'page' : undefined}>
          訂單/付款
        </Link>
      </li>
    </ul>
  )
}


export default SideBar;