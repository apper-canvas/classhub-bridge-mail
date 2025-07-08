import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const Empty = ({ 
  title = "No data found", 
  description = "Get started by adding your first item.", 
  icon = "Database",
  actionText = "Add New",
  onAction,
  illustration = null 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-card p-12 text-center"
    >
      <div className="flex flex-col items-center space-y-6">
        {illustration || (
          <div className="w-20 h-20 bg-gradient-accent rounded-full flex items-center justify-center">
            <ApperIcon name={icon} className="w-10 h-10 text-white" />
          </div>
        )}
        <div className="space-y-2">
          <h3 className="text-2xl font-display font-semibold text-gray-900">{title}</h3>
          <p className="text-gray-600 max-w-md">{description}</p>
        </div>
        {onAction && (
          <Button onClick={onAction} variant="primary" size="lg">
            <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
            {actionText}
          </Button>
        )}
      </div>
    </motion.div>
  )
}

export default Empty