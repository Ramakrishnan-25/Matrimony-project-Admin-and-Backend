import { useState } from "react";

const Sidebar = () => {
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleSubmenu = (menuKey) => {
    console.log("Toggling menu:", menuKey);
    setExpandedMenus((prev) => {
      const newState = {
        ...prev,
        [menuKey]: !prev[menuKey],
      };
      console.log("New state:", newState);
      return newState;
    });
  };

  return (
    <div className="pan-lhs ad-menu-main">
      <div className="ad-menu">
        <ul>
          <li className="ic-db">
            <a href="/admin/dashboard">Dashboard</a>
          </li>

          <li className="ic-user">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                toggleSubmenu("users");
              }}
              className={expandedMenus.users ? "active" : ""}
            >
              Users
            </a>
            {/* Fixed: Using div without submenu class to match HTML structure */}
            <div style={{ display: expandedMenus.users ? "block" : "none" }}>
              <ol>
                <li>
                  <a href="/admin/new-user-requests">New User Requests</a>
                </li>
                <li>
                  <a href="/admin/all-user-list">All Users</a>
                </li>
                <li>
                  <a href="/admin/paid-user-list">Paid Users</a>
                </li>
                {/* <li>
                  <a href="/admin/standard-user-list">Standard Users</a>
                </li>
                <li>
                  <a href="/admin/premium-user-list">Premium Users</a>
                </li> */}
                <li>
                  <a href="/admin/add-new-user">Add new User</a>
                </li>
                 <li>
                   <a href="/admin/deleted-users">Deleted Users</a>
                 </li>
              </ol>
            </div>
          </li>

          <li className="ic-pri">
            <a href="/admin/pricing-plans-list">Pricing Plans</a>
          </li>

          <li className="ic-pri">
            {" "}
            {/* Reusing icon class for now */}
            <a href="/admin/events">Events</a>
          </li>
         

        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
