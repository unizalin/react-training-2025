import { Outlet, Link } from "react-router";
import Header from "../components/frontend/header";

const FrontendLayout = () => {
  return (
    <div>
      <Header/>
      <main>
        <Outlet />
      </main>
      <footer className="mt-5 text-center">
        <p>© 2024 我的網站</p>
      </footer>
    </div>
  );
};

export default FrontendLayout;
