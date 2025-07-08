import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { AuthContext } from "../../App";
import ApperIcon from "@/components/ApperIcon";
import Sidebar from "@/components/organisms/Sidebar";
import Button from "@/components/atoms/Button";

function Layout() {
  const { logout } = useContext(AuthContext)
  const { user, isAuthenticated } = useSelector((state) => state.user)

  return (
    <div className="flex h-screen bg-surface">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {/* Header with user info and logout */}
        <div className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-gray-900">ClassHub</h1>
            </div>
            {isAuthenticated && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </span>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </div>
                    <div className="text-gray-500">{user?.emailAddress}</div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="flex items-center gap-2"
                >
                  <ApperIcon name="LogOut" className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Main content */}
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
)
}

export default Layout