import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@/components/hero-ui"
import { MetricCard } from "../../card/MetricCard"
import { useTranslation } from "react-i18next"
import { CiExport, CiFilter } from "react-icons/ci"
import { IoChevronDown, IoChevronUp, IoPrintOutline, IoSettingsOutline, IoTrendingUp } from "react-icons/io5"
import { FiChevronDown } from "react-icons/fi"
import { useState } from "react"
import type { Selection,  } from "@heroui/react"
import { PiStudentThin } from "react-icons/pi"
import { AnimatePresence, motion } from "framer-motion"


type StatsData = {
  total_students: number,
  total_presents: string | number,
  total_absents: string | number,
  total_lates: string | number,
  total_permissions: string | number,
  total_all_sessions: string | number,
  average_attendance_percentage: string | number
}

interface ReportHeaderProps {
    title?: string
    description?: string
    data: StatsData 
    columns?: any[]
    defaultVisibleColumns?: string[]
    onVisibleColumnsChange?: (columns: string[]) => void
    onFilter?: () => void
    onOpenCustomize?: () => void
    isHiddenState?: boolean
    setIsHiddenState?: (value: boolean) => void
}

const ReportHeader = ({title, description, data, columns, defaultVisibleColumns, onVisibleColumnsChange, onFilter, onOpenCustomize, isHiddenState, setIsHiddenState}: ReportHeaderProps) => {
    const { t } = useTranslation()
    const [hiddenState, setHiddenState] = useState<boolean>(isHiddenState || false)
    
    const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(defaultVisibleColumns))

    const handleSelectionChange = (keys: Selection) => {
        setVisibleColumns(keys)
        if (onVisibleColumnsChange && keys !== "all") {
            onVisibleColumnsChange(Array.from(keys as Set<string>))
        } else if (onVisibleColumnsChange && keys === "all") {
            onVisibleColumnsChange(columns?.map(col => col.accessor) || [])
        }
    }
    const handleHiddenState = () => {
        setHiddenState(!hiddenState)
        setIsHiddenState?.(!hiddenState)
    }

    return (
        <div className="relative">
            <div className="absolute -bottom-4 left-0 flex items-center justify-center w-full z-10">
                <button 
                    onClick={handleHiddenState} 
                    className="cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors rounded-full p-2"
                >
                    {hiddenState ? <IoChevronUp size={20}/> : <IoChevronDown size={20}/>}
                </button>
            </div>
            <div className="flex justify-between items-center w-full">
                <div>
                    <h2 className="text-2xl font-semibold text-zinc-700 dark:text-zinc-200">{title}</h2>
                    <p className="text-zinc-500 dark:text-zinc-400">{description}</p>
                </div>
                <div className="flex items-center gap-1">
                    <Button variant="solid" color="primary" startContent={<CiFilter size={18}/>} onClick={onFilter}>{t('filter')}</Button>
                    <Button variant="solid" color="secondary" startContent={<IoPrintOutline size={18}/>}>{t('print')}</Button>
                    <Button variant="solid" color="success" startContent={<CiExport size={18}/>}>{t('export')}</Button>
                    <Dropdown backdrop="transparent">
                        <DropdownTrigger>
                            <Button
                                radius="md"
                                endContent={<FiChevronDown />}
                                size="sm"
                                variant="flat"
                                className="h-full"
                            >
                                Columns
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            disallowEmptySelection
                            selectionMode="multiple"
                            selectedKeys={visibleColumns}
                            onSelectionChange={handleSelectionChange}
                            classNames={{
                                base: "max-h-96 overflow-y-auto has-scrollbar-sm"
                            }}
                        >
                            {columns?.map((column) => (
                                <DropdownItem key={column.accessor} className="capitalize" closeOnSelect={false}>
                                    {column.label}
                                </DropdownItem>
                            ))}
                        </DropdownMenu>
                    </Dropdown>
                    <Button variant="flat"  startContent={<IoSettingsOutline size={20}/>} isIconOnly onClick={onOpenCustomize}/>
                </div>
            </div>
            <AnimatePresence initial={false}>
            {hiddenState && 
                <motion.div
                 className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-6"
                 initial={{ opacity: 0}}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 transition={{ duration: 0.2 }}
                >
                    <MetricCard
                        title="Total Students" 
                        value={data.total_students} 
                        icon={<PiStudentThin size={20}/>}
                        variant="primary" 
                        type="Student"
                        showProgress={false}
                        showChart
                        colorChart="primary"
                        classNames={{base: "bg-zinc-50 dark:bg-zinc-800 shadow-lg shadow-zinc-200/50 dark:shadow-black/20"}}
                        description="Total number of students enrolled in this class"
                    />
                    <MetricCard
                        title="Total Presents" 
                        value={Number(data.total_presents)} 
                        icon={<IoTrendingUp size={20}/>}
                        variant="success" 
                        type="Present"
                        showProgress={false}
                        showChart
                        colorChart="success"
                        classNames={{base: "bg-zinc-50 dark:bg-zinc-800 shadow-lg shadow-zinc-200/50 dark:shadow-black/20"}}
                        description="Average attendance percentage across all students"
                    />
                    <MetricCard
                        title="Total Absents" 
                        value={Number(data.total_absents)} 
                        icon={<IoTrendingUp size={20}/>} 
                        variant="danger" 
                        type="Absent"
                        showProgress={false}
                        showChart
                        colorChart="danger"
                        classNames={{base: "bg-zinc-50 dark:bg-zinc-800 shadow-lg shadow-zinc-200/50 dark:shadow-black/20"}}
                        description="Total number of students who were absent"
                    />
                    <MetricCard
                        title="Total Lates" 
                        value={Number(data.total_lates)} 
                        icon={<IoTrendingUp size={20}/>} 
                        variant="warning" 
                        type="Late"
                        showProgress={false}
                        showChart
                        colorChart="warning"
                        classNames={{base: "bg-zinc-50 dark:bg-zinc-800 shadow-lg shadow-zinc-200/50 dark:shadow-black/20"}}
                        description="Total number of students who were late"
                    />
                    <MetricCard
                        title="Total Permissions" 
                        value={Number(data.total_permissions)} 
                        icon={<IoTrendingUp size={20}/>} 
                        variant="secondary" 
                        type="Permission"
                        showProgress={false}
                        showChart
                        colorChart="secondary"
                        classNames={{base: "bg-zinc-50 dark:bg-zinc-800 shadow-lg shadow-zinc-200/50 dark:shadow-black/20"}}
                        description="Total number of students who were on permission"
                    />
                    <MetricCard
                        title="Total All Sessions" 
                        value={Number(data.total_all_sessions)} 
                        icon={<IoTrendingUp size={20}/>} 
                        variant="primary" 
                        type="Session"
                        showProgress={false}
                        showChart
                        colorChart="primary"
                        classNames={{base: "bg-zinc-50 dark:bg-zinc-800 shadow-lg shadow-zinc-200/50 dark:shadow-black/20"}}
                        description="Total number of sessions"
                    />
                </motion.div>
            }
            </AnimatePresence>

        </div>
    )
}

export default ReportHeader