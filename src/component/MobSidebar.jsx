import { MoreVertical } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Icons } from '../assests/Icons'

function Sidebar({ children }) {
  const { user ,istoken} = useSelector((state) => state.profile);

  return (
    <aside className="h-full w-full pt-12 font-inter">
      <nav className="h-full flex w-full rounded-md flex-col bg-white ">
        <div className="p-4 pb-2 flex justify-between items-center">
        <Icons.img
            className={`overflow-hidden text-richblue-100 transition-all 
             w-32
            `}
            alt=""
          />
        </div>

        <ul className="flex-1 px-3">{children}</ul>

        {istoken && <div className="border-t flex p-3">
          <img
            src={user?.image}
            alt="User"
            className="w-10 h-10 object-cover object-center rounded-md"
          />
          <div className="ml-3 w-52 flex justify-between items-center">
            <div className="leading-4">
              <h4 className="font-semibold">{user?.username}</h4>
              <span className="text-xs text-gray-600">{user?.email}</span>
            </div>
            <MoreVertical size={20} />
          </div>
        </div>

        }



      </nav>
    </aside>
  );
}

export function SidebarItem({ icon, text, active, alert, link }) {
  return (
    <Link to={link}>
      <li
        className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors
        ${
          active
            ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
            : "hover:bg-indigo-50 text-gray-600"
        }`}
      >
        {icon}
        <span className="ml-3">{text}</span>
        {alert && (
          <div className="absolute right-2 w-2 h-2 rounded bg-indigo-400" />
        )}
      </li>
    </Link>
  );
}

export default Sidebar;
