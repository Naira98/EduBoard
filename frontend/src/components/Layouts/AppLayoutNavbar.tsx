import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";

const AppLayoutNavbar = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default AppLayoutNavbar;
