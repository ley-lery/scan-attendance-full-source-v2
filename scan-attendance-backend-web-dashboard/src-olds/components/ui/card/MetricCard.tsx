import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Cpu } from "lucide-react"
import type React from "react"


interface LineChartProps {
  data: number[]
  color: string
  shadowSize?: number
  strokeWidth?: number
}

export function LineChart({ data, color, shadowSize, strokeWidth }: LineChartProps) {
  if (data.length < 2) {
      return null 
  }
  
  const width = 160 
  const height = 80 
  const padding = 10 
  
  const minVal = Math.min(...data)
  const maxVal = Math.max(...data)
  
  // Scale data points to fit within the SVG height, considering padding
  const scaleY = (value: number) => {
      if (maxVal === minVal) return height / 2
      return height - padding - ((value - minVal) / (maxVal - minVal)) * (height - 2 * padding)
  }
  
  // Scale data points to fit within the SVG width
  const scaleX = (index: number) => {
      return (index / (data.length - 1)) * width
  }
  
  // Generate SVG path string for the line
  const pathData = data
      .map((value, index) => {
      const x = scaleX(index)
      const y = scaleY(value)
      return `${index === 0 ? "M" : "L"} ${x} ${y}`
      })
      .join(" ")
  
  // Generate SVG path string for the area (line + bottom edges)
  const areaPathData = `${pathData} L ${width} ${height} L 0 ${height} Z`
  
  return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
      <defs>
          <linearGradient id={`chartGradient-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={shadowSize || 0.1} />
          <stop offset="100%" stopColor={color} stopOpacity={shadowSize || 0} />
          </linearGradient>
      </defs>
      <motion.path
          d={areaPathData}
          fill={`url(#chartGradient-${color})`}
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          transition={{ duration: 4, ease: "easeOut" }}
      />
      <motion.path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth || 1}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
      />
      </svg>
  )
}

interface MetricCardProps {
  title: string
  value: number
  icon: React.ReactNode
  variant?: "primary" | "success" | "warning" | "danger" | "secondary"
  colorChart?: string
  description?: string
  type?: string
  showProgress?: boolean
  showChart?: boolean
  classNames?:{
    base?:string
    icon?:string
    title?:string
    value?:string
    progress?:string
    chart?:string
  }
}

export function MetricCard({ title, value, icon, variant, description, type, showProgress = true, showChart = false, colorChart,classNames }: MetricCardProps) {
  const getIcon = () => {
    if (icon) {
      return icon
    }
    return <Cpu className="h-6 w-6" />
  }

  const getIconColor = () => {
    switch (variant) {
        case "primary":
            return "text-primary-500 bg-primary/10 p-2 text-2xl rounded-lg"
        case "success":
            return `text-success-500 bg-success/10 p-2 text-2xl rounded-lg`
        case "warning":
            return "text-warning-500 bg-warning/10 p-2 text-2xl rounded-lg"
        case "danger":
            return "text-danger-500 bg-danger/10 p-2 text-2xl rounded-lg"
        case "secondary":
            return "text-secondary-500 bg-secondary/10 p-2 text-2xl rounded-lg"
        default:
            return "text-gray-500 bg-gray/10 p-2 text-2xl rounded-lg"
        
    }
  }

  const getProgressColor = () => {
    switch (variant) {
      case "primary":
        return "bg-primary-500 shadow-primary"
      case "success":
        return "bg-success-500 shadow-success"
      case "warning":
        return "bg-warning-500 shadow-warning"
      case "danger":
        return "bg-danger-500 shadow-danger"
      case "secondary":
        return "bg-secondary-500 shadow-secondary"
      default:
        return "bg-default-500 shadow-default"
    }
  }

  const getChartColor = () => {
    switch (colorChart) {
      case "primary":
        return "#006FEE"
      case "success":
        return "#17c964"
      case "warning":
        return "#f5a524"
      case "danger":
        return "#f31260"
      case "secondary":
        return "#7828c8"
      default:
        return "#17c964"
    }
  }

  return (
    <div 
      className={cn(
        "rounded-3xl flex flex-col justify-between bg-zinc-100 dark:bg-zinc-800 border space-y-2 border-transparent dark:border-zinc-800/50 p-4 backdrop-blur-sm overflow-hidden",
        classNames?.base
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className={`${getIconColor()}`}>{getIcon()}</div>
          <div className="space-y-0">
            <h3 className="text-zinc-600 dark:text-zinc-300 text-base font-medium">{title}</h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">{description}</p>
          </div>
        </div>
      </div>
      <div className="m-0 p-0">
        <div className="text-2xl font-semibold text-zinc-700 dark:text-zinc-300"> <span >{value}</span> <span className="text-sm text-zinc-500 dark:text-zinc-400 font-normal">{type}</span></div>
        {showProgress && <div className="relative h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full border-2 border-zinc-200/50 dark:border-zinc-700 overflow-hidden">
          <div
            className={`absolute inset-y-0 left-0  ${getProgressColor()} rounded-full transition-all duration-300`}
            style={{ width: `${value}%` }}
          />
        </div>}
      </div>
      {showChart && <div className="absolute -bottom-8 -right-10 scale-75"><LineChart data={[50, 45, 55, 48, 60, 52, 65, 58, 70, 62]} color={getChartColor()} /></div>}
    </div>
  )
}
