import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'

const StatCard = ({ title, value, icon, trend, trendValue, variant = 'default' }) => {
  const getTrendColor = () => {
    if (trend === 'up') return 'text-success'
    if (trend === 'down') return 'text-error'
    return 'text-gray-500'
  }

  const getTrendIcon = () => {
    if (trend === 'up') return 'TrendingUp'
    if (trend === 'down') return 'TrendingDown'
    return 'Minus'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card variant={variant} className="relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className={`text-sm font-medium ${variant === 'default' ? 'text-gray-600' : 'text-white/80'}`}>
              {title}
            </p>
            <p className={`text-3xl font-bold font-display mt-2 ${variant === 'default' ? 'gradient-text' : 'text-white'}`}>
              {value}
            </p>
            {trend && (
              <div className={`flex items-center mt-2 ${variant === 'default' ? getTrendColor() : 'text-white/80'}`}>
                <ApperIcon name={getTrendIcon()} className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">{trendValue}</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-full ${variant === 'default' ? 'bg-gradient-primary' : 'bg-white/20'}`}>
            <ApperIcon name={icon} className={`w-6 h-6 ${variant === 'default' ? 'text-white' : 'text-white'}`} />
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default StatCard