import React from "react";
import { Link } from "react-router-dom";

function NavItems({ location, pathname, children }) {
    let isActive = false;

    if (pathname === "/admin/dashboard") {
      isActive = pathname === "/admin/dashboard" && location.startsWith("/admin");
    } else {
      isActive = `/${location.split("/")[1]}` === pathname;
    }

  return (
    <div
      className={`group ${
        isActive
          ? "text-richblue-100"
          : "text-richblue-200 font-inter font-normal"
      }`}
    >
      <Link to={pathname}>
        <div className="mb-0 p-2">
          <p>{children}</p>
        </div>
      </Link>
      {isActive && (
        <div className="w-6 h-[4px] rounded-full m-0 mx-auto bg-richblue-100"></div>
      )}
    </div>
  );
}

export default NavItems;
