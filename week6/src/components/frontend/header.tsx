import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router";

function header() {
  return (
  <>
  <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top shadow">
    <div className="container">
      <Link className="navbar-brand" to="/">民宿LOGO</Link>
      <button 
        className="navbar-toggler" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarNav" 
        aria-controls="navbarNav" 
        aria-expanded="false" 
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/rooms">房型介紹</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/local">在地體驗</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/orderlist">訂單查詢</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/contact">聯絡我們</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/login">登入</Link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  </>
  )
};

export default header;