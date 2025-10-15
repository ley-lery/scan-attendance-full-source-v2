import {
  Button,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react'
import { FiChevronDown } from 'react-icons/fi'
import { GoDotFill } from 'react-icons/go'
import { useTranslation } from 'react-i18next'
import React, { useEffect, useState } from 'react'
import LoadingUi from '../loading/Loading'
import { Input, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@/components/hero-ui"
import { BrushCleaning, Filter, Search } from 'lucide-react'
interface TableUiProps {
  data: any[]
  loading: boolean
  headerColumns?: string[] // not used
  bodyColumns?: string[] // you can remove this, will handle inside
  bottomContent?: React.ReactNode
  background?: boolean
  cols?: { key: string; label: string }[]
  actions?: React.ReactNode
  status?: string[]
  openFilter?: () => void
  handleClearFilter?: () => void
}

const TableUi = ({
  data,
  loading,
  bottomContent,
  background,
  cols,
  actions,
  status,
  openFilter,
  handleClearFilter,
}: TableUiProps) => {
  const { t } = useTranslation()
  const [filteredData, setFilteredData] = useState<any[]>(data)
  const [page, setPage] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  const [selectedStatus, setSelectedStatus] = useState(new Set(status || ['Pending', 'Approved', 'Rejected']))
  const [searchTerm, setSearchTerm] = useState('')

  // Use cols keys as the columns to search in
  const searchableKeys = cols?.map((c) => c.key) || []

  useEffect(() => {
    const selectedStatuses = Array.from(selectedStatus)
  
    const filtered = data.filter((item) => {
      const matchesStatus = selectedStatuses.includes(item.status)
      const matchesSearch =
        searchTerm === '' ||
        searchableKeys.some((key) =>
          item[key]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      return matchesStatus && matchesSearch
    })
  
    setFilteredData(filtered)
    setTotal(filtered.length)
  }, [data, selectedStatus, searchTerm])
  
  // Reset page only when filters change — not when `page` changes itself
  useEffect(() => {
    setPage(1)
  }, [selectedStatus, searchTerm])
  
  
  const handleSearch = (value: string) => {
    setSearchTerm(value)
  }

  const topContent = (
    <div className="flex justify-between items-center gap-2">
      <div className="min-w-96">
        <Input
          placeholder="Search"
          size="md"
          color="default"
          radius="full"
          classNames={{
            inputWrapper: 'bg-zinc-100 dark:bg-zinc-800 shadow-none',
            input: 'text-zinc-700 dark:text-zinc-300',
          }}
          startContent={<Search size={18} className="text-zinc-500 dark:text-zinc-400" />}
          onValueChange={handleSearch}
          value={searchTerm}
          isClearable
        />
      </div>
      <div className="flex items-center gap-2">
        <Dropdown>
          <DropdownTrigger>
            <Button className="capitalize btn-small-ui" variant="solid" radius="full" endContent={<FiChevronDown />}>
              {t('status')}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="Status filter"
            selectedKeys={selectedStatus}
            variant="flat"
            selectionMode="multiple"
            onSelectionChange={setSelectedStatus}
            closeOnSelect={false}
          >
            <DropdownItem key="Pending">{t('pending')}</DropdownItem>
            <DropdownItem key="Approved">{t('approved')}</DropdownItem>
            <DropdownItem key="Rejected">{t('rejected')}</DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <Button color="danger" radius="full" className="btn-small-ui" onPress={handleClearFilter} startContent={<BrushCleaning size={14} />}>
          Clear Filter
        </Button>

        <Button color="primary" radius="full" className="btn-small-ui" onPress={openFilter} startContent={<Filter size={14} />}>
          Filter
        </Button>
      </div>
    </div>
  )

  return (
    <div
      className={`rounded-[2rem] h-[66vh] 3xl:h-[73vh] flex flex-col justify-between p-4 ${
        background ? 'bg-zinc-50 border-white border dark:border-transparent dark:bg-zinc-800/50 shadow-zinc-200/30 dark:shadow-black/30' : ''
      }`}
    >
      <Table
        aria-label="Leave requests"
        className="w-full"
        shadow="none"
        removeWrapper
        classNames={{
          wrapper: 'overflow-x-auto ',
          table: 'min-w-full rounded-2xl',
          thead: 'bg-transparent ',
          th: 'text-left text-sm font-semibold text-zinc-700 dark:text-zinc-300 bg-transparent border-b border-zinc-200 dark:border-zinc-700 px-4 py-4',
          td: 'px-4',
        }}
        topContent={topContent}
        bottomContent={bottomContent}
      >
       <TableHeader>
        <>
            {cols?.map((column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
            ))}
            <TableColumn key="actions">Actions</TableColumn> 
        </>
        </TableHeader>

        <TableBody emptyContent={loading ? <LoadingUi /> : t('noData')}>
          {filteredData.map((item) => (
           <TableRow key={item.id}>
              {cols?.map((column) => (
                <TableCell key={column.key}>
                  {column.key === 'status' ? (
                    <div className="flex items-center gap-2">
                      <GoDotFill
                        className={
                          item.status === 'Approved' || item.status === 'Present'  
                            ? 'text-success-500'
                            : item.status === 'Rejected' || item.status === 'Late'
                            ? 'text-warning-500'
                            : 'text-danger-500'
                        }
                      />
                      {item.status}
                    </div>
                  ) : (
                    item[column.key]
                  )}
                </TableCell>
              ))}
           <TableCell>
              {actions}
           </TableCell>
         </TableRow>
         
          ))}
        </TableBody>
      </Table>

      <Pagination hidden={total <= 10} total={Math.ceil(total/10)} page={page} onChange={setPage} showControls radius="lg" className="mt-4" variant="light" />
    </div>
  )
}
export default TableUi
