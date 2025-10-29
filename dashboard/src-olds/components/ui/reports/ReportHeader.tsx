import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@/components/hero-ui"
import { MetricCard } from "../card/MetricCard"
import { useTranslation } from "react-i18next"
import { CiExport, CiFilter } from "react-icons/ci"
import { IoPrintOutline, IoSettingsOutline } from "react-icons/io5"
import { FiChevronDown } from "react-icons/fi"
import { useState } from "react"
import type { Selection,  } from "@heroui/react"

interface ReportHeaderProps {
    title?: string
    description?: string
    data: any[]
    columns?: any[]
    defaultVisibleColumns?: string[]
    onVisibleColumnsChange?: (columns: string[]) => void
    onFilter?: () => void
    onOpenCustomize?: () => void
}

const ReportHeader = ({title, description, data, columns, defaultVisibleColumns, onVisibleColumnsChange, onFilter, onOpenCustomize}: ReportHeaderProps) => {
    const { t } = useTranslation()
    
    const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(defaultVisibleColumns))

    const handleSelectionChange = (keys: Selection) => {
        setVisibleColumns(keys)
        if (onVisibleColumnsChange && keys !== "all") {
            onVisibleColumnsChange(Array.from(keys as Set<string>))
        } else if (onVisibleColumnsChange && keys === "all") {
            onVisibleColumnsChange(columns?.map(col => col.accessor) || [])
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center w-full">
                <div>
                    <h2 className="text-2xl font-semibold text-zinc-700 dark:text-zinc-200">{title}</h2>
                    <p className="text-zinc-500 dark:text-zinc-400">{description}</p>
                </div>
                <div className="flex items-center gap-1">
                    <Button variant="solid" size="md" color="primary" startContent={<CiFilter size={18}/>} onClick={onFilter}>{t('filter')}</Button>
                    <Button variant="solid" size="md" color="secondary" startContent={<IoPrintOutline size={18}/>}>{t('print')}</Button>
                    <Button variant="solid" size="md" color="success" startContent={<CiExport size={18}/>}>{t('export')}</Button>
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
            {
                data &&
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-6">
                    {data.map((item, index) => (
                        <MetricCard
                            key={index} 
                            title={item.title} 
                            value={item.value} 
                            icon={item.icon} 
                            variant={item.variant as any} 
                            type={item.type}
                            showProgress={false}
                            showChart
                            colorChart={item.variant}
                            classNames={{base: "bg-zinc-50 dark:bg-zinc-800 shadow-lg shadow-zinc-200/50 dark:shadow-black/20"}}
                            description={item.desc}
                        />
                    ))} 
                </div>
            }
        </div>
    )
}

export default ReportHeader