import { Package, TrendingUp, DollarSign } from 'lucide-react'

const cards = [
  {
    key: 'total_products',
    label: 'Total Products',
    icon: Package,
    gradient: 'from-indigo-500 to-indigo-600',
    textColor: 'text-indigo-500',
  },
  {
    key: 'total_sales',
    label: 'Total Sales',
    icon: TrendingUp,
    gradient: 'from-emerald-500 to-emerald-600',
    textColor: 'text-emerald-500',
  },
  {
    key: 'revenue',
    label: 'Revenue',
    icon: DollarSign,
    gradient: 'from-purple-500 to-purple-600',
    textColor: 'text-purple-500',
    format: 'currency',
  },
]

function formatValue(value, format) {
  if (format === 'currency') {
    return `$${Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }
  return Number(value || 0).toLocaleString()
}

export function StatsCards({ stats, loading }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.key}
            className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-5 border border-gray-200/50 dark:border-gray-700/50 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{card.label}</p>
                {loading ? (
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse mt-2" />
                ) : (
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">
                    {formatValue(stats?.[card.key], card.format)}
                  </p>
                )}
              </div>
              <div className={`p-2.5 bg-gradient-to-br ${card.gradient} rounded-xl`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
