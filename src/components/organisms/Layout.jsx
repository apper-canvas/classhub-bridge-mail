import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/organisms/Sidebar'

const Layout = () => {
  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      <div className="lg:ml-64">
        <main className="min-h-screen">
          <div className="lg:p-8 p-4 pt-16 lg:pt-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout