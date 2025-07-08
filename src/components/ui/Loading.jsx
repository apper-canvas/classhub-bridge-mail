import { motion } from 'framer-motion'

const Loading = ({ type = 'table', rows = 5, columns = 6 }) => {
  if (type === 'table') {
    return (
      <div className="bg-white rounded-lg shadow-card p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="skeleton h-8 w-48 rounded-md"></div>
            <div className="skeleton h-10 w-32 rounded-md"></div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  {Array.from({ length: columns }).map((_, i) => (
                    <th key={i} className="py-3 px-4 text-left">
                      <div className="skeleton h-4 w-20 rounded"></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: rows }).map((_, i) => (
                  <tr key={i} className="border-b">
                    {Array.from({ length: columns }).map((_, j) => (
                      <td key={j} className="py-3 px-4">
                        <div className="skeleton h-4 w-full rounded"></div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  if (type === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: rows }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-lg shadow-card p-6"
          >
            <div className="space-y-4">
              <div className="skeleton h-6 w-3/4 rounded"></div>
              <div className="skeleton h-4 w-full rounded"></div>
              <div className="skeleton h-4 w-2/3 rounded"></div>
              <div className="skeleton h-8 w-24 rounded-md"></div>
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  if (type === 'dashboard') {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-lg shadow-card p-6"
            >
              <div className="space-y-3">
                <div className="skeleton h-4 w-20 rounded"></div>
                <div className="skeleton h-8 w-16 rounded"></div>
                <div className="skeleton h-3 w-24 rounded"></div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="space-y-4">
            <div className="skeleton h-6 w-48 rounded"></div>
            <div className="skeleton h-64 w-full rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  )
}

export default Loading