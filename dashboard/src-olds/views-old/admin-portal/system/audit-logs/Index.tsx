import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Autocomplete, AutocompleteItem, DataTable, DatePicker, ShowToast } from "@/components/hero-ui";
import { getLocalTimeZone, today, type DateValue } from "@internationalized/date";
import { useFetch } from "@/hooks/useFetch";
import { useDisclosure, Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter } from "@/god-ui";
import { cn } from "@/lib/utils";
import { Button, Divider } from "@heroui/react";
import View from "./View";
import { useMutation } from "@/hooks/useMutation";
import { IoMdAdd } from "react-icons/io";
import { IoTrashOutline } from "react-icons/io5";
import { RxUpdate } from "react-icons/rx";
import { GrClear } from "react-icons/gr";
import { MdFilterTiltShift } from "react-icons/md";


// === Helpers ===
const formatDateValue = (date: DateValue | null) =>
  date ? date.toString() : null;

// Custom hook for separate view dialog
const useViewClosure = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return { isOpenView: isOpen, onOpenView: onOpen, onCloseView: onClose };
};


type AuditLog = {
  action: string;
  tableName: string;
  user: string | null;
  startDate: DateValue | null;
  endDate: DateValue | null;
  startTime: string | null;
  endTime: string | null;
  clientIp: string;
};

const Index = () => {
  const { t } = useTranslation();

  // ==== State Modal Management ====
  const { isOpenView, onOpenView, onCloseView } = useViewClosure();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // ==== State Management ====
  const [searchKeyword, setSearchKeyword] = useState("");
  const [viewRow, setViewRow] = useState<any>(null);
  const [rows, setRows] = useState<any[]>([]);
  const [isFiltered, setIsFiltered] = useState(false);

  const defaultFilter: AuditLog = {
    action: "",
    tableName: "",
    user: null,
    startDate: today(getLocalTimeZone()),
    endDate: today(getLocalTimeZone()),
    startTime: null,
    endTime: null,
    clientIp: "",
  };

  const [filter, setFilter] = useState<AuditLog>(defaultFilter);

  // ==== Pagination ====
  const [pagination, setPagination] = useState({
    page: 1,
    limit: parseInt(import.meta.env.VITE_DEFAULT_PAGE_LIMIT) || 10,
  });
  const [totalPage, setTotalPage] = useState(1);

  // ==== Form Load ====
  const { data: formLoad, loading: formLoadLoading } = useFetch<{ users: any[] }>("/auditlog/formload");

  

  // ==== Fetch Data ====
  const { data, loading, refetch } = useFetch<{
    rows: any[];
    total_count: number;
  }>(searchKeyword.trim() === "" ? "/auditlog/list" : "/auditlog/search", {
    params: {
      page: pagination.page,
      limit: pagination.limit,
      ...(searchKeyword.trim() !== "" && { keyword: searchKeyword }),
    },
    deps: [pagination.page, pagination.limit, searchKeyword],
  });

  useEffect(() => {
    console.log(formLoad, 'formLoad');
    console.log(data, 'data');
  }, [formLoad, data]);

  useEffect(() => {
    if (!isFiltered) {
      setRows(data?.data?.rows || []);
      setTotalPage(Math.ceil((data?.data?.total || 0) / pagination.limit) || 1);
    }
  }, [data, isFiltered, pagination.limit]);

  // ==== Table Columns ====
  const cols = useMemo(
    () => [
      { name: t("id"), uid: "id", sortable: true },
      { name: t("tableName"), uid: "table_name", sortable: true },
      { name: t("action"), uid: "action", sortable: true },
      { name: t("changedByUser"), uid: "user_username" },
      { name: t("userEmail"), uid: "user_email" },
      { name: t("changedDate"), uid: "changed_date" },
      { name: t("changedTime"), uid: "changed_time" },
      { name: t("action"), uid: "actions" },
    ],
    [t]
  );

  const visibleCols = [
    "id",
    "table_name",
    "action",
    "user_username",
    "changed_time",
    "changed_date",
    "actions",
  ];

  // ==== Search Handlers ====
  const onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
    setIsFiltered(false);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleClearSearch = () => {
    setSearchKeyword("");
    setIsFiltered(false);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleDateChange = (field: keyof AuditLog, value: DateValue | null) => {
    setFilter((prev) => ({ ...prev, [field]: value }));
  };

  // ==== CRUD View ====
  const onView = (row: object) => {
    setViewRow(row);
    onOpenView();
  };

  // ==== Filter ====
  const { mutate: filterAuditLog, loading: filterLoading } = useMutation({
    onSuccess: (response) => {
      setRows(response?.data?.rows || []);
      setTotalPage(Math.ceil((response?.data?.total || 0) / pagination.limit) || 1);
      setIsFiltered(true);
      onClose();
    },
    onError: (err) => {
      ShowToast({
        color: "error",
        title: "Error",
        description: err.message || "Failed to apply filter",
      });
    },
  });

  // Handle pagination changes when filtered
  useEffect(() => {
    if (isFiltered && pagination.page > 1) {
      applyFilterWithPagination();
    }
  }, [pagination.page]);

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: Key } }) => {
  //   const { name, value } = e.target;
  //   setFilter((prev) => ({ ...prev, [name]: value }));
  // };
  

  const applyFilterWithPagination = async () => {
    const payload = {
      tableName: filter.tableName,
      action: filter.action,
      user: filter.user,
      startDate: formatDateValue(filter.startDate),
      endDate: formatDateValue(filter.endDate),
      startTime: filter.startTime,
      endTime: filter.endTime,
      clientIp: filter.clientIp,
      page: pagination.page,
      limit: pagination.limit,
    };

    await filterAuditLog(`/auditlog/filter`, payload, "POST");
  };

  const resetFilter = () => {
    setFilter(defaultFilter);
    setIsFiltered(false);
    setPagination((prev) => ({ ...prev, page: 1 }));
    refetch();
  };

  const onFilter = async () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    
    const payload = {
      tableName: filter.tableName,
      action: filter.action,
      user: filter.user,
      startDate: formatDateValue(filter.startDate),
      endDate: formatDateValue(filter.endDate),
      startTime: filter.startTime,
      endTime: filter.endTime,
      clientIp: filter.clientIp,
      page: 1,
      limit: pagination.limit,
    };

    await filterAuditLog(`/auditlog/filter`, payload, "POST");
  };

  const actionIcon = (action: string) => {
    switch (action) {
      case "INSERT":
        return <IoMdAdd />;
      case "UPDATE":
        return <RxUpdate />;
      case "DELETE":
        return <IoTrashOutline />;
      default:
        return <IoMdAdd />;
    }
  };
  // ==== Column Customize ====
  const customizeCols = (data: any) => {
    return (
      <span
        className={cn(
          "px-3 py-1 rounded-full w-fit text-xs/tight font-medium inline-flex items-center gap-2",
          data.action === "INSERT" && "text-success bg-success/20",
          data.action === "UPDATE" && "text-warning bg-warning/20",
          data.action === "DELETE" && "text-danger bg-danger/20"
        )}
      >
        {actionIcon(data.action)} {data.action}
      </span>
    );
  };

  const colsKeys = [
    { key: "action", value: (data: any) => customizeCols(data) },
  ];

  return (
    <div className="p-4">
      <View isOpen={isOpenView} onClose={onCloseView} row={viewRow} />

      {/* === Filter Drawer === */}
      <Drawer isOpen={isOpen} onClose={onClose} size="xs" radius="none" backdrop="transparent" shadow="none">
        <DrawerHeader>
          <h2 className="text-lg font-semibold">{t("filter")}</h2>
        </DrawerHeader>
        <DrawerContent>
          <DrawerBody>
            <form className="space-y-4">
              {/* Date & Time */}
              <div>
                <h3 className="text-sm font-normal text-zinc-500 dark:text-zinc-400">
                  {t("dateTimeRange")}
                </h3>
                <Divider className="mb-2"/>
                <div className="grid grid-cols-2 gap-4">
                  <DatePicker
                    label={t("startDate")}
                    value={filter.startDate}
                    onChange={(val) => handleDateChange("startDate", val)}
                    maxValue={filter.endDate}
                    labelPlacement="outside"
                    size="sm"
                    classNames={{
                      selectorIcon: 'text-sm',
                      selectorButton: 'p-0'
                    }}
                  />
                  <DatePicker
                    label={t("endDate")}
                    value={filter.endDate}
                    onChange={(val) => handleDateChange("endDate", val)}
                    minValue={filter.startDate}
                    labelPlacement="outside"
                    size="sm"
                    classNames={{
                      selectorIcon: 'text-sm',
                      selectorButton: 'p-0'
                    }}
                  />
                </div>
              </div>
              {/* General */}
              <div>
                <h3 className="text-sm font-normal text-zinc-500 dark:text-zinc-400">{t("general")}</h3>
                <Divider className="mb-4"/>
                <div className="grid grid-cols-1 gap-2">
                  <Autocomplete
                    label={t("table")}
                    placeholder={t("chooseTable")}
                    selectedKey={filter.tableName ?? ""}
                    isClearable
                    onSelectionChange={(key) =>
                      setFilter((prev) => ({
                        ...prev,
                        tableName: key?.toString() || "",
                      }))
                    }
                    labelPlacement="outside"
                    size="sm"
                    isLoading={formLoadLoading}
                  >
                    {formLoad?.data?.tableList?.map((u: { value: string, label: string }) => (
                      <AutocompleteItem key={u.value}>
                        {u.label}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>

                  <Autocomplete
                    label={t("action")}
                    placeholder={t("chooseAction")}
                    selectedKey={filter.action ?? ""}
                    isClearable
                    onSelectionChange={(key) =>
                      setFilter((prev) => ({
                        ...prev,
                        action: key?.toString() || "",
                      }))
                    }
                    labelPlacement="outside"
                    size="sm"
                  >
                    {formLoad?.data?.actionList?.map((a: { value: string, label: string }) => (
                      <AutocompleteItem key={a.value}>{a.label}</AutocompleteItem>
                    ))}
                  </Autocomplete>

                  <Autocomplete
                    label={t("user")}
                    placeholder={t("chooseUser")}
                    selectedKey={filter.user ?? ""}
                    isClearable
                    onSelectionChange={(key) =>
                      setFilter((prev) => ({
                        ...prev,
                        user: key?.toString() || null,
                      }))
                    }
                    labelPlacement="outside"
                    size="sm"
                    isLoading={formLoadLoading}
                  >
                    {formLoad?.data?.users?.map((u: { id: string; username: string }) => (
                      <AutocompleteItem key={u.id}>
                        {u.username}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                </div>
              </div>
            </form>
          </DrawerBody>
        </DrawerContent>
        <DrawerFooter>
          <Button onPress={resetFilter} size="sm" variant="flat" color="danger" startContent={<GrClear size={16} /> }>
            {t("reset")}
          </Button>
          <Button
            onPress={onFilter}
            size="sm"
            variant="solid"
            color="primary"
            isLoading={filterLoading}
            startContent={<MdFilterTiltShift size={16} /> }
          >
            {t("apply")}
          </Button>
        </DrawerFooter>
      </Drawer>

      {/* === Table === */}
      <DataTable
        loading={loading || filterLoading}
        dataApi={rows}
        cols={cols}
        visibleCols={visibleCols}
        onView={onView}
        loadData={refetch}
        selectRow={false}
        onOpenFilter={onOpen}
        isFiltered={isFiltered}
        colKeys={colsKeys}
        permissionCreate="create:auditlog"
        permissionDelete="delete:auditlog"
        permissionEdit="update:auditlog"
        permissionView="view:auditlog"
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
      />
    </div>
  );
};

export default Index;