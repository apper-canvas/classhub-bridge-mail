import { NavLink } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import { cn } from '@/utils/cn'

const Navigation = ({ className = "", isMobile = false }) => {
  const navItems = [
    { to: '/', label: 'Dashboard', icon: 'BarChart3' },
    { to: '/students', label: 'Students', icon: 'Users' },
    { to: '/grades', label: 'Grades', icon: 'BookOpen' },
    { to: '/attendance', label: 'Attendance', icon: 'Calendar' },
    { to: '/reports', label: 'Reports', icon: 'FileText' },
  ]

  return (
    <nav className={cn("space-y-2", className)}>
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-gradient-primary text-white shadow-lg"
                : "text-gray-600 hover:text-primary hover:bg-primary/10",
              isMobile && "py-3 text-base"
            )
          }
        >
          <ApperIcon name={item.icon} className="w-5 h-5 mr-3" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

export default Navigation