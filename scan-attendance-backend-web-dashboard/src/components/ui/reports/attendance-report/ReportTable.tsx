import { cn } from "@/lib/utils"
import { Pagination } from "@heroui/react"

interface ReportTableProps {
    title?: string
    data: any[]
    columns: {
        label: string
        accessor: string
        align?: 'left' | 'center' | 'right'
    }[]
    visibleColumns?: string[]
    removeWrapper?: boolean
    classNames?:{
        base?: string
        title?: string
        tableWrapper?: string
        table?: string
        thead?: string
        tbody?: string
        tr?: string
        th?: string
        td?: string
        emptyState?: string
    }
    customRender?: {
        [key: string]: (value: any, row?: any) => React.ReactNode
    }
    onRowClick?: (row: any, index: number) => void
    emptyStateMessage?: string
    striped?: boolean
    bordered?: boolean
    hoverable?: boolean
    page?: number
    initialPage?: number
    onChangePage?: (page: number) => void
    totalPages?: number
}

const ReportTable = ({
    title, 
    data, 
    columns, 
    visibleColumns,
    removeWrapper, 
    classNames, 
    customRender,
    onRowClick,
    emptyStateMessage = "No data available",
    striped = false,
    bordered = false,
    hoverable = true,
    page = 1,
    initialPage = 1,
    onChangePage = () => {},
    totalPages = 0,
}: ReportTableProps) => {
  
  const getAlignmentClass = (align?: 'left' | 'center' | 'right') => {
    switch (align) {
      case 'center':
        return 'text-center'
      case 'right':
        return 'text-right'
      default:
        return 'text-left'
    }
  }

  // Filter columns based on visibleColumns prop
  const filteredColumns = visibleColumns 
    ? columns.filter(col => visibleColumns.includes(col.accessor))
    : columns

  return (
    <div className={cn(!removeWrapper && "bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-2", "h-full", classNames?.base)}>
        {title && (
            <h3 className={cn("text-xl font-semibold text-zinc-700 dark:text-zinc-200 mb-2", classNames?.title)}>
                {title}
            </h3>
        )}
        <div className={cn("flex flex-col justify-between overflow-x-auto  w-full overflow-y-auto has-scrollbar pb-4 ", classNames?.tableWrapper)}>
            <table className={cn("w-full border-collapse", classNames?.table)}>
                <thead className={cn(classNames?.thead, 'sticky top-0 z-10 bg-zinc-100 dark:bg-zinc-900')}>
                    <tr className={cn(classNames?.tr)}>
                        {filteredColumns.map((column, index) => (
                            <th 
                                key={index}
                                className={cn(
                                    "px-4 py-3 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider",
                                    "whitespace-nowrap",
                                    bordered ? "border border-white/5 dark:border-white/5" : "border-b border-zinc-200 dark:border-zinc-600",
                                    getAlignmentClass(column.align),
                                    classNames?.th
                                )}
                            >
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className={cn(classNames?.tbody)}>
                    {data.length === 0 ? (
                        <tr>
                            <td 
                                colSpan={filteredColumns.length} 
                                className={cn(
                                    "px-4 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400",
                                    classNames?.emptyState
                                )}
                            >
                                {emptyStateMessage}
                            </td>
                        </tr>
                    ) : (
                        data.map((item, rowIndex) => (
                            <tr 
                                key={rowIndex}
                                onClick={() => onRowClick?.(item, rowIndex)}
                                className={cn(
                                    hoverable && "hover:bg-black/5 dark:hover:bg-white/5 transition-colors",
                                    striped && rowIndex % 2 !== 0 && "bg-zinc-50/50 dark:bg-zinc-700/20",
                                    onRowClick && "cursor-pointer",
                                    classNames?.tr
                                )}
                            >
                                {filteredColumns.map((column, colIndex) => (
                                    <td 
                                        key={colIndex}
                                        className={cn(
                                            "px-4 py-1.5 text-sm text-zinc-600 dark:text-zinc-300 whitespace-nowrap",
                                            bordered && "border border-white/5 dark:border-white/5",
                                            getAlignmentClass(column.align),
                                            classNames?.td
                                        )}
                                    >
                                        {customRender?.[column.accessor] 
                                            ? customRender[column.accessor](item[column.accessor], item) 
                                            : item[column.accessor] ?? 'N/A'}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
        <div className="pt-4">
            <Pagination
                initialPage={initialPage}
                variant="light"
                total={totalPages}
                page={page}
                onChange={onChangePage}
                showControls
                hidden={totalPages < 2}
                size="sm"
            />
        </div>
    </div>
  )
}

export default ReportTable