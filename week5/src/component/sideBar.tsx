import { Link, useLocation } from "react-router-dom";

const SideBar = () => {
  const location = useLocation();

  return (
    <ul className="nav nav-pills flex-column mb-auto">
      <li className="nav-item">
        <Link to="/homeStay" className={`nav-link text-white ${location.pathname == '/homeStay' ? 'active': ''}`} aria-current={location.pathname == '/homeStay' ? 'page' : undefined}>
          民宿資訊
        </Link>
      </li>
      <li className="nav-item ">
        <Link to="/souvenirs" className={`nav-link ${location.pathname == '/souvenirs' ? 'active': ''} text-white
        `} aria-current={location.pathname == '/souvenirs' ? 'page' : undefined}>
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
      <hr />
      <li className="nav-item ">
        <Link to="/register" className={`nav-link ${location.pathname == '/register' ? 'active': ''} text-white
        `} aria-current={location.pathname == '/register' ? 'page' : undefined}>
          伴手禮購買
        </Link>
      </li>
      <li className="nav-item ">
        <Link to="/orderList" className={`nav-link ${location.pathname == '/orderList' ? 'active': ''} text-white
        `} aria-current={location.pathname == '/orderList' ? 'page' : undefined}>
          訂單/付款
        </Link>
      </li>
    </ul>
  )
}


export default SideBar;