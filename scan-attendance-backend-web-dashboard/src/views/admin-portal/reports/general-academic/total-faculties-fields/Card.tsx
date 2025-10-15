import { ShoppingBag } from "lucide-react"

interface SalesCardProps {
  amount: number
  percentage: number
  timeframe?: string
  currency?: string
}

export function SalesCard({ amount, percentage, timeframe = "Last 24 Hours", currency = "$" }: SalesCardProps) {
  // Calculate the stroke dash offset for the circular progress
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="bg-[#1a1d29] rounded-2xl p-6 w-[280px] relative">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          {/* Icon */}
          <div className="w-12 h-12 rounded-full bg-[#6366f1]/20 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-[#6366f1]" strokeWidth={2} />
          </div>

          {/* Content */}
          <div className="space-y-1">
            <p className="text-gray-400 text-sm font-medium">Total Sales</p>
            <h2 className="text-white text-3xl font-bold tracking-tight">
              {currency}
              {amount.toLocaleString()}
            </h2>
          </div>

          {/* Timeframe */}
          <p className="text-gray-500 text-xs">{timeframe}</p>
        </div>

        {/* Circular Progress */}
        <div className="relative w-20 h-20">
          <svg className="transform -rotate-90 w-20 h-20">
            {/* Background circle */}
            <circle cx="40" cy="40" r={radius} stroke="#2a2d3a" strokeWidth="8" fill="none" />
            {/* Progress circle */}
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke="#6366f1"
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500 ease-out"
            />
          </svg>
          {/* Percentage text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-sm font-semibold">{percentage}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
