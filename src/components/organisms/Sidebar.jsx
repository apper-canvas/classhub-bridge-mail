import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Navigation from '@/components/molecules/Navigation'
import Button from '@/components/atoms/Button'

const Sidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-white shadow-lg border-r border-gray-200 z-30">
        <div className="flex flex-col h-full">
          <div className="flex items-center px-6 py-4 border-b">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <ApperIcon name="GraduationCap" className="w-6 h-6 text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold font-display gradient-text">ClassHub</h1>
                <p className="text-xs text-gray-500">Student Management</p>
              </div>
            </div>
          </div>
          <div className="flex-1 px-4 py-6">
            <Navigation />
          </div>
          <div className="p-4 border-t">
            <div className="bg-gradient-accent rounded-lg p-4 text-center">
              <ApperIcon name="Award" className="w-8 h-8 text-white mx-auto mb-2" />
              <p className="text-white text-sm font-medium">Academic Year</p>
              <p className="text-white/80 text-xs">2024-2025</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button variant="ghost" size="sm" onClick={toggleMobileMenu}>
          <ApperIcon name="Menu" className="w-6 h-6" />
        </Button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                  <Link to="/" className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <ApperIcon name="GraduationCap" className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-3">
                      <h1 className="text-xl font-bold font-display gradient-text">ClassHub</h1>
                      <p className="text-xs text-gray-500">Student Management</p>
                    </div>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(false)}>
                    <ApperIcon name="X" className="w-5 h-5" />
                  </Button>
                </div>
                <div className="flex-1 px-4 py-6">
                  <Navigation isMobile={true} />
                </div>
                <div className="p-4 border-t">
                  <div className="bg-gradient-accent rounded-lg p-4 text-center">
                    <ApperIcon name="Award" className="w-8 h-8 text-white mx-auto mb-2" />
                    <p className="text-white text-sm font-medium">Academic Year</p>
                    <p className="text-white/80 text-xs">2024-2025</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Sidebar