import { DataTable, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Button } from "@/components/hero-ui";
import { useFetch } from "@/hooks/useFetch"
import { useEffect, useMemo, useState } from "react"
import { CiCreditCard2, CiFilter, CiSearch } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5";
import { LuUniversity } from "react-icons/lu";
import { HiOutlineTableCells } from "react-icons/hi2";
import { useTranslation } from "react-i18next";

interface CardProps {
  className: string;
  roomName: string;
  term: string;
  year: string;
}

const Card = ({ className, roomName, term, year }: CardProps) => {
  return (
    <div className="p-4 rounded-3xl bg-zinc-100 dark:bg-zinc-900  inset-shadow-sm inset-shadow-white dark:inset-shadow-zinc-500/50 shadow-lg shadow-zinc-200 dark:shadow-black/50 space-y-2 ">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-zinc-100 dark:bg-zinc-900 inset-shadow-sm inset-shadow-white dark:inset-shadow-zinc-500/50 shadow-lg shadow-zinc-200 dark:shadow-black/50">
          <LuUniversity size={20} className="text-zinc-500 dark:text-zinc-400"/>
        </div>
        <div className="flex items-start justify-between w-full gap-2">
          <div>
            <h2 className="text-base font-medium">{className}</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{roomName}</p>
          </div>
          <Button size="sm" variant="flat" color="success" radius="lg">View</Button>
        </div>
      </div>
      <div className="flex justify-evenly  p-2 rounded-xl">
        <div className="flex flex-col text-center gap-1">
          <span className="text-sm text-zinc-500 dark:text-zinc-400">Year</span>
          <p className="text-xl font-semibold">{year}</p>
        </div>
        <div className="flex flex-col text-center gap-1">
          <span className="text-sm text-zinc-500 dark:text-zinc-400">Term</span>
          <p className="text-xl font-semibold">{term}</p>
        </div>
      </div>
    </div>
  )
}

const Index = () => {

  const { t } = useTranslation();
  const [view, setView] = useState(new Set(["default"]))
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [viewRow, setViewRow] = useState<any>(null);

  // ==== Pagination State ====
  const [pagination, setPagination] = useState({
    page: 1,
    limit: parseInt(import.meta.env.VITE_DEFAULT_PAGE_LIMIT) || 10,
  });


  // ==== Fetch Data ====
  const {data, loading, refetch} = useFetch("/student/classstudent/list")

  useEffect(() => {
    console.log(data, "class student")
  }, [data])

  // ==== Table Data & Total Pages ====
  const dataRows = data?.data?.rows;
  const rows = dataRows || [];
  const totalPage = Math.ceil((data?.data?.total || 0) / pagination.limit) || 1;

  // ==== Columns Definitions ====
  const cols = useMemo(
    () => [
      { name: t("id"), uid: "id", sortable: true },
      { name: t("class"), uid: "class_name", sortable: true },
      { name: t("room"), uid: "room_name" },
      { name: t("year"), uid: "promotion_no", sortable: true },
      { name: t("term"), uid: "term_no", sortable: true },
      { name: t("status"), uid: "status", sortable: true },
      { name: t("action"), uid: "actions" },
    ],
    [t],
  );

  const visibleCols = [ "id",  "class_name", "room_name", "promotion_no", "term_no", "status", "actions"];

  const status = [
    { name: "Active", uid: "Active" },
    { name: "Inactive", uid: "Inactive" },
  ];
    
  const onView = (row: object) => {
    setViewRow(row);
  };

  
  // ==== Search Input Handlers ====
  const onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleClearSearch = () => {
    setSearchKeyword("");
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium">My Classes</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">List of your classes</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" color="primary" startContent={<CiFilter size={20} />}>Filter</Button>
          <Dropdown >
            <DropdownTrigger>
              <Button size="sm" color="default" isIconOnly startContent={<IoSettingsOutline size={20} />}/>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Single selection example"
              selectedKeys={view}
              selectionMode="single"
              variant="flat"
              onSelectionChange={(keys: any) => {
                setView(new Set(keys));
              }}
            >
              <DropdownItem startContent={<CiCreditCard2 size={20}/>} key="default">Default</DropdownItem>
              <DropdownItem startContent={<HiOutlineTableCells size={20}/>} key="table">Table</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      {view.has("default") && (
        <Input
          size="md"
          placeholder={t("search")}
          value={searchKeyword}
          onChange={onSearchInputChange}
          onKeyDown={(e) => e.key === "Enter" && refetch()}
          onClear={handleClearSearch}
          isClearable
          classNames={{
            clearButton: "text-default-500 hover:text-default-600",
            inputWrapper: 'bg-zinc-200 dark:bg-zinc-800 shadow-none focus:bg-zinc-200',
            input: "px-2 font-normal",
            base: "max-w-xs"
          }}
          radius="md"
          startContent={<CiSearch size={20} className=" text-default-500" />}
        />
      )}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {view.has("default") && data?.data?.rows?.map((item: any) => (
          <Card key={item.id} className={item.class_name} roomName={item.room_name} term={item.term_no} year={item.promotion_no} />
        ))}
      </div>
      {
        view.has("table") && 
          <DataTable
            loading={loading}
            dataApi={rows}
            cols={cols}
            visibleCols={visibleCols}
            onView={onView}
            loadData={refetch} 
            selectRow={false}
            permissionView="view:classstudent"
            searchKeyword={searchKeyword}
            onSearchInputChange={onSearchInputChange}
            handleClearSearch={handleClearSearch}
            handleSearch={refetch} 
            initialPage={pagination.page}
            totalPages={totalPage}
            page={pagination.page}
            onChangePage={(newPage: number) =>
              setPagination((prev) => ({ ...prev, page: newPage }))
            }
            status={status}
          />
      }
    </div>
  )
}

export default Index